/* eslint-disable prettier/prettier */
import {
  BadGatewayException,
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cache } from "cache-manager";
import { verify } from "jsonwebtoken";
import { ClassRoom } from "src/class/entities/class.entity";
import { Student } from "src/class/entities/student.entity";
import { config } from "src/utils";
import { cloudinaryUpload } from "src/utils/cloudinary";
import { generateFullName, generateID } from "src/utils/helpers";
import { Raw, Repository } from "typeorm";
import {
  CreateProfileInput,
  UpdateProfileInput,
  UploadImageInput,
} from "../dto/profile.dto";
import { Family } from "../entities/Family.entity";
import { FamilyMember } from "../entities/FamilyMember.entity";
import { Profile } from "../entities/profile.entity";
import { FamilyRoleEnum } from "../interfaces/famiy.interface";
import { AccountTypeEnum } from "../interfaces/profile.interface";
import { FamilyService } from "./family.service";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    private readonly familyService: FamilyService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(ClassRoom)
    private readonly classRepo: Repository<ClassRoom>,
    @InjectRepository(FamilyMember)
    private readonly memberRepo: Repository<FamilyMember>,
  ) {}
  private readonly logger = new Logger(ProfileService.name);

  async createProfile(input: CreateProfileInput): Promise<Profile> {
    const { email, accountType } = input;
  
    // create a temporal copy of name for caching and limiting duplicate inserts
    const name = generateFullName({
      firstName: input?.firstName,
      middleName: input.middleName,
      otherName: input.otherName,
      lastName: input.lastName,
    });

    try {
      // If name from input is same as cached name, throw error
      if (name === (await this.cache.get("name"))) {
        throw new BadRequestException("Possible duplicate entiry");
      }

      // initialize user and image to be filled later
      let user: Profile;
      let image: string;

      // initialize member in case
      let isMember: FamilyMember;
      let family: Family;

      // Require email for non student accounts
      if (accountType !== AccountTypeEnum.Student) {
        if (!email) throw new BadRequestException("Email is required");
        user = await this.profileRepo.findOneBy({ email });
      } else {
        if (!input?.image) throw new BadRequestException("Image is required");
      }

      // Avoid duplicate emails
      if (user) throw new BadRequestException("Email is already registered");

      // remove familyCode and familyRole from payload
      const { familyCode, familyRole, ...rest } = input;

      // Create an instance of the Profile
      user = this.profileRepo.create({
        ...rest,
        accountTypes: [input.accountType],
        id: generateID(),
      });

      let createdStudent: Student;

      // If the account is a Student account, create a student profile also
      if (accountType === AccountTypeEnum.Student) {
        const classRoom = await this.classRepo.findOneByOrFail({
          id: input.class,
        });

        const student = this.studentRepo.create({
          regNo: await this.createRegNo(),
          id: generateID(),
        });

        student.class = classRoom;
        student.profile = user;

        createdStudent = student;
      }

      // Image is optional
      if (input.image) {
        image = await cloudinaryUpload(input.image).catch((err) => {
          console.log(err);
          throw new BadGatewayException("Unable to upload image to server");
        });
        user.image = image;
      }

      // If a familyCode was added to payload, create a member
      if (familyCode) {
        family = await this.familyService
          .getFamilyByFamilyCode(familyCode)
          .catch((err) => {
            throw err;
          });

        const member = this.memberRepo.create({
          id: generateID(),
          role:
            accountType === AccountTypeEnum.Student
              ? FamilyRoleEnum.Student
              : familyRole,
        });

        member.family = family;
        member.profile = user;
        user.family = family;
        isMember = member;
      }

      user.lastSeen = new Date(Date.now());

      await this.profileRepo.save(user);
      await this.cache.set("name", name);
      if (createdStudent) {
      await this.studentRepo.save(createdStudent);
      }
      if (Boolean(isMember)) {
        await this.memberRepo.save(isMember);
      }

      // user = await this.profileRepo.findOne({
      //   where: { id: user.id },
      //   relations: ["student", "teacher", "family"],
      // });
      const mappedResult: Profile = {
        ...user,
        dob: new Date(user?.dob),
        student: createdStudent,
        family,
      } as Profile;
      return mappedResult;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  // get All Profiles
  async getProfiles(): Promise<Profile[]> {
    try {
      const profiles = await this.profileRepo.find({ relations: ["family"] });

      return profiles;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getProfile(id: string): Promise<Profile> {
    if (!id) throw new BadRequestException("Empty ID");
    try {
      const profile = await this.profileRepo.findOne({
        where: { id },
        relations: ["family"],
      });

      if (!profile) throw new NotFoundException("Profile not found");
      return profile;
    } catch (error) {
      throw error;
    }
  }

  async getMe(id: string): Promise<Profile> {
    try {
      const user = await this.profileRepo.findOne({
        where: { id },
        relations: ["family"],
      });
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
        relations: ["family"],
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
      await this.profileRepo.clear();
      // for (const profile of profiles) {
      //   await this.profileRepo.delete(profile.id);
      // }
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

  private async createRegNo() {
    const students = await this.studentRepo.find();

    const lastItem = students[students.length - 1];

    const lastItemNumber = lastItem?.regNo?.split("-")?.[1];

    const count = students.length ? Number(lastItemNumber) + 1 : 1;

    const regNo = `reg-${count.toString().padStart(4, "0")}`;

    return regNo;
  }
}
