import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { config } from "../utils";
import { Profile } from "src/profile/entities/profile.entity";
import { Repository } from "typeorm";
import {
  ChangeAuthPasswordInput,
  ForgotPasswordInput,
  LoginInput,
  LoginResponse,
  SignupInput,
} from "./dto/auth.dto";
import { Auth } from "./entities/auth.entity";
import { sendgrid } from "src/utils/sendgrid";
import { nanoid } from "nanoid";

const { CLIENT_URL } = process.env;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) {}
  async getAuths(): Promise<Auth[]> {
    try {
      return this.authRepo.find();
    } catch (error) {
      throw error;
    }
  }
  async signup(input: SignupInput): Promise<Auth> {
    const { password, profileId } = input;
    try {
      const user = await this.profileRepo.findOne({ where: { id: profileId } });
      if (!user)
        throw new NotFoundException("User with the profileId not found");
      let auth = await this.authRepo.findOneBy({ email: user.email });
      if (auth) throw new BadRequestException("Email is already registered");

      if (!user?.email)
        throw new BadRequestException("Please make sure the email is correct");

      // generate salt
      const salt = bcrypt.genSaltSync(10);

      // generate hash

      const newPassword = salt + "-" + bcrypt.hashSync(password, 10);

      auth = this.authRepo.create({
        password: newPassword,
        email: user.email,
      });

      auth.profile = user;

      await this.profileRepo.update(
        { id: user.id },
        { isActive: true, isEmailVerified: true },
      );
      await this.authRepo.save(auth);
      await this.profileRepo.save(user);
      return auth;
    } catch (error) {
      throw error;
    }
  }
  async login(input: LoginInput): Promise<LoginResponse> {
    const { email, password } = input;
    try {
      const auth = await this.authRepo.findOneBy({ email });
      if (!email) throw new BadRequestException("Email not registered");

      const storePassword = auth.password?.split("-")?.[1];

      const isMatch = bcrypt.compareSync(password, storePassword);

      if (!isMatch) {
        throw new UnauthorizedException("Invalid email or password");
      }

      const token = `Bearer ${jwt.sign(
        { id: auth.profile?.id },
        config.SECRET,
      )}`;

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
      await sendgrid.sendMail({
        email: user.email,
        subject: "Create your profile",
        html: `
        <h1>Hello </h1>
        <p>You have been invited to join <strong>BDMIS Portal</strong>. Click <a href='${CLIENT_URL}/account/${user.id}'>here</a> to create your profile on BDMIS Portal </p>
        `,
      });
      return true;
    } catch (error) {
      throw new BadGatewayException("Unable to send email");
    }
  }
  // reset Password
  async resetPassword(email: string): Promise<boolean> {
    const auth = await this.authRepo.findOneBy({ email });
    if (!auth) throw new NotFoundException("Invalid account");

    try {
      auth.emailToken = nanoid(6);
      await sendgrid
        .sendMail({
          email: auth.email,
          subject: "Continue to reset your password",
          html: `<p>You requested to change your password, click the link below to continue</p> <a href='${CLIENT_URL}/forgot-password/${auth.emailToken}'>Reset Password now</a>`,
        })
        .catch((err) => {
          throw new BadGatewayException(err);
        });

      await this.authRepo.save(auth);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(data: ForgotPasswordInput): Promise<boolean> {
    try {
      const auth = await this.authRepo.findOne({
        where: { emailToken: data.emailToken },
      });
      if (!auth) throw new NotFoundException("Invalid credentials");

      auth.password = bcrypt.hashSync(data.password, 10);
      auth.emailToken = "";

      await sendgrid.sendMail({
        email: auth.email,
        subject: "Password Reset Completed",
        html: `Your password was successfully updated`,
      });
      await this.authRepo.save(auth);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // change AuthPassword
  async changeAuthPassword(
    data: ChangeAuthPasswordInput,
    userId: string,
  ): Promise<boolean> {
    try {
      const user = await this.authRepo.findOne({
        where: { profile: { id: userId } },
      });
      if (!user) throw new NotFoundException("No record found");
      const isMatch = bcrypt.compareSync(data.oldPassword, user.password);
      if (!isMatch) throw new UnauthorizedException("Invalid credentials");

      user.password = bcrypt.hashSync(data.password, 10);

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
}
