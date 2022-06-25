import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { config } from "../utils";

import { Repository } from "typeorm";
import {
  ChangeAuthPasswordInput,
  CreateNewPasswordInput,
  LoginInput,
  LoginResponse,
  SignupInput,
} from "./dto/auth.dto";
import { Auth } from "./entities/auth.entity";

import { MailEventsEnum, MAIL_CLIENT } from "@app/common";
import { ClientProxy } from "@nestjs/microservices";
import { nanoid } from "nanoid";
import { Profile } from "../profile/entities/profile.entity";
import { generateID } from "../utils/helpers";

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    @Inject(MAIL_CLIENT) private readonly mailClient: ClientProxy,
  ) {}
  async getAuths(): Promise<Auth[]> {
    try {
      return this.authRepo.find();
    } catch (error) {
      throw error;
    }
  }
  async signup(input: SignupInput): Promise<Profile> {
    const { password, profileId } = input;
    try {
      const user = await this.profileRepo.findOne({ where: { id: profileId } });
      if (!user)
        throw new NotFoundException("User with the profileId not found");
      let auth = await this.authRepo.findOneBy({ email: user.email });
      if (auth) throw new BadRequestException("Email is already registered");

      if (!user?.email)
        throw new BadRequestException("Please make sure the email is correct");

      const newPassword = await this.hashPassword(password);

      auth = this.authRepo.create({
        password: newPassword,
        email: user.email,
      });
      auth.id = generateID();
      auth.profile = user;

      await this.profileRepo.update(
        { id: user.id },
        { isActive: true, isEmailVerified: true },
      );
      await this.authRepo.save(auth);
      await this.profileRepo.save(user);
      return user;
    } catch (error) {
      throw error;
    }
  }
  async login(input: LoginInput): Promise<LoginResponse> {
    const { email, password } = input;
    try {
      const auth = await this.authRepo.findOneBy({ email });
      if (!email) throw new BadRequestException("Email not registered");
      if (!auth?.profile?.id)
        throw new UnauthorizedException("Register your account to login");

      await this.comparePassword(auth.password, password);
      const token = `Bearer ${jwt.sign(
        { id: auth.profile?.id },
        config.SECRET,
      )}`;

      this.mailClient.emit(MailEventsEnum.LOGGED_IN, {
        email,
        name: auth.profile?.name,
      });

      return {
        token,
        id: auth.profile?.id,
      };
    } catch (error) {
      throw error;
    }
  }

  // Send invite
  async sendInvite(id: string): Promise<boolean> {
    const user = await this.profileRepo.findOne({ where: { id } });

    if (!user) throw new NotFoundException("No record found for user");
    const auth = await this.authRepo.findOne({ where: { email: user.email } });
    if (auth) throw new BadRequestException("Email is already registered");
    try {
      this.mailClient.emit(MailEventsEnum.INVITE_USER, user);
      return true;
    } catch (error) {
      throw new BadGatewayException("Unable to send email");
    }
  }

  // reset Auth incases where the email is no longer accessible but profile remains in auth
  async resetAuth(profileId: string): Promise<Profile> {
    // verify the profileId exists in Profile entiy
    const auth = await this.authRepo.findOne({
      where: { profile: { id: profileId } },
    });
    if (!auth)
      throw new UnauthorizedException("You can not reset this account");

    // delete the record to create a fresh one
    await this.authRepo.delete(auth.id);

    try {
      const user = await this.profileRepo.findOne({ where: { id: profileId } });

      this.mailClient.emit(MailEventsEnum.RESET_AUTH, user);

      return user;
    } catch (error) {
      throw error;
    }
  }

  // reset Password
  async resetPassword(email: string): Promise<boolean> {
    const auth = await this.authRepo.findOneBy({ email });
    if (!auth) throw new NotFoundException("Invalid account");

    try {
      auth.emailToken = nanoid(6);

      await this.authRepo.save(auth);
      this.mailClient.emit(MailEventsEnum.RESET_PASSWORD, auth);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Forgot password
  /**
   * @description After the `resetPassword()` a mail is sent to create a new password
   * @param data
   * @returns Boolean
   */
  async createNewPassword(data: CreateNewPasswordInput): Promise<boolean> {
    try {
      const auth = await this.authRepo.findOne({
        where: { emailToken: data.emailToken },
      });
      if (!auth) throw new NotFoundException("Invalid credentials");

      auth.password = await this.hashPassword(data.password);
      auth.emailToken = "";

      await this.authRepo.save(auth);
      this.mailClient.emit(MailEventsEnum.CHANGED_PASSWORD, auth);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // change AuthPassword
  async changeAuthPassword(data: ChangeAuthPasswordInput): Promise<boolean> {
    const user = await this.authRepo.findOne({
      where: { profile: { id: data.id } },
    });
    if (!user) throw new NotFoundException("No record found");

    try {
      await this.comparePassword(user.password, data.oldPassword);

      user.password = await this.hashPassword(data.password);

      await this.authRepo.save(user);

      return true;
    } catch (error) {
      throw error;
    }
  }

  // delete auth
  async deleteAuth(id: string): Promise<Auth> {
    try {
      const auth = await this.authRepo.findOneBy({ id });
      if (!auth) throw new NotFoundException("No record found");
      await this.authRepo.delete(id);
      return auth;
    } catch (error) {
      throw error;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    // generate salt
    const salt = bcrypt.genSaltSync(10);

    // generate hash

    const newPassword = salt + "-" + bcrypt.hashSync(password, 10);

    return newPassword;
  }

  private async comparePassword(
    hashedPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    try {
      const storePassword = hashedPassword?.split("-")?.[1];

      const isMatch = bcrypt.compareSync(plainPassword, storePassword);

      if (!isMatch) {
        throw new UnauthorizedException("Invalid email or password");
      }
      return isMatch;
    } catch (error) {
      this.logger.error(error);
      throw new BadGatewayException("Incorrect email or password");
    }
  }
}
