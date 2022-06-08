/* eslint-disable prettier/prettier */
import {
  BadGatewayException,
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cache } from "cache-manager";
import { verify } from "jsonwebtoken";
import { config } from "src/utils";
import { cloudinaryUpload } from "src/utils/cloudinary";
import { Raw, Repository } from "typeorm";
import {
  CreateProfileInput,
  UpdateProfileInput,
  UploadImageInput,
} from "../dto/profile.dto";
import { Profile } from "../entities/profile.entity";
import { AccountTypeEnum } from "../interfaces/profile.interface";
import { FamilyService } from "./family.service";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    private readonly familyService: FamilyService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async createProfile(input: CreateProfileInput): Promise<Profile> {
    const { email, accountType } = input;
    try {
      if (input.firstName === (await this.cache.get("firstName"))) {
        throw new BadRequestException("Possible duplicate entiry");
      }
      let user: Profile;
      let image: string;

      if (accountType !== AccountTypeEnum.Student) {
        if (!email) throw new BadRequestException("Email is required");
        user = await this.profileRepo.findOneBy({ email });
      } else {
        if (!input?.image) throw new BadRequestException("Image is required");
      }
      if (user) throw new BadRequestException("Email is already registered");

      if (input.image) {
        image = await cloudinaryUpload(input.image).catch((err) => {
          console.log(err);
          throw new BadGatewayException("Unable to upload image to server");
        });
      }

      const { familyId, familyRole, ...rest } = input;

      user = this.profileRepo.create({
        ...rest,
        image,
        accountTypes: [input.accountType],
      });

      if (familyId) {
        const family = await this.familyService.getFamily(familyId);
        await this.familyService.createFamilyMember({
          profile: user.id,
          family: familyId,
          role: familyRole,
        });
        user.family = family;
      }
      await this.cache.set("firstName", user.firstName);

      await this.profileRepo.save(user);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getProfiles(): Promise<Profile[]> {
    try {
      const profiles = await this.profileRepo.find();

      return profiles;
    } catch (error) {
      throw error;
    }
  }

  async getProfile(id: string): Promise<Profile> {
    if (!id) throw new BadRequestException("Empty ID");
    try {
      const profile = await this.profileRepo.findOne({ where: { id } });

      if (!profile) throw new NotFoundException("Profile not found");
      return profile;
    } catch (error) {
      throw error;
    }
  }

  async getMe(id: string): Promise<Profile> {
    try {
      const user = await this.profileRepo.findOne({ where: { id } });
      await this.profileRepo.update({ id }, { lastSeen: new Date() });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(input: UpdateProfileInput): Promise<Profile> {
    try {
      const profile = await this.getProfile(input.id);
      Object.assign(profile, input);
      await this.profileRepo.save(profile);
      return profile;
    } catch (error) {
      throw error;
    }
  }

  // Get Profile By email

  async getProfileByEmail(email: string): Promise<Profile> {
    try {
      const profile = await this.profileRepo.findOneBy({ email });
      if (!profile) throw new NotFoundException("Profile not found");
      return profile;
    } catch (error) {
      throw error;
    }
  }

  // Get Profile By Phone
  async getProfileByPhone(phone: string): Promise<Profile> {
    try {
      const profile = await this.profileRepo.findOneBy({ phone });
      if (!profile) throw new NotFoundException("Profile not found");
      return profile;
    } catch (error) {
      throw error;
    }
  }
  // Search profile by name
  async searchProfileByName(name: string): Promise<Profile[]> {
    try {
      const profiles = await this.profileRepo.find({
        where: [
          {
            lastName: Raw(
              (alias) => `LOWER(${alias}) LIKE '%${name.toLowerCase()}%' `,
            ),
          },
          {
            name: Raw(
              (alias) => `LOWER(${alias}) LIKE '%${name.toLowerCase()}%' `,
            ),
          },
        ],
        order: {
          firstName: "ASC",
        },
      });
      // const profiles = await this.profileRepo
      //   .createQueryBuilder("profile")

      //   .where(`LOWER(name) LIKE LOWER('%${name}%')`)
      //   .getMany();

      return profiles;
    } catch (error) {
      throw error;
    }
  }
  // Upload Profile Image
  async uploadProfilePic(input: UploadImageInput): Promise<Profile> {
    const { id, image: file } = input;
    try {
      const profile = await this.profileRepo.findOneBy({ id });
      if (!profile) throw new NotFoundException("Profile not valid");
      const image = await cloudinaryUpload(file).catch((err) => {
        console.log(err);
        throw new Error("Problem with uploading image");
      });

      profile.image = image;

      await this.profileRepo.save(profile);

      return profile;
    } catch (error) {
      throw error;
    }
  }

  // Delete All Profiles
  async deleteAllProfile(): Promise<Profile[]> {
    try {
      const profiles = await this.profileRepo.find();
      for (const profile of profiles) {
        await this.profileRepo.delete(profile.id);
      }
      return profiles;
    } catch (error) {
      throw error;
    }
  }

  async deleteProfile(id: string): Promise<Profile> {
    try {
      const profile = await this.getProfile(id);

      await this.profileRepo.delete(id);
      return profile;
    } catch (error) {
      throw error;
    }
  }
  async decodeJWT(jwt: string): Promise<Profile> {
    if (!jwt) return null;
    const token = jwt.split(" ")[1];

    if (!token) return null;

    try {
      const { id } = verify(token, config.SECRET) as { id: string };
      const user = await this.profileRepo.findOne({ where: { id } });
      return user;
    } catch (error) {
      console.log("Invalid signature");
      return null;
    }
  }
}
