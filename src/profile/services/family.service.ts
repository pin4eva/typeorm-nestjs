import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { generateID } from "src/utils/helpers";
import { Repository } from "typeorm";
import {
  CreateFamilyInput,
  CreateFamilyMemberInput,
  UpdateFamilyInput,
  UpdateFamilyMemberInput,
} from "../dto/family.dto";
import { Family } from "../entities/Family.entity";
import { FamilyMember } from "../entities/FamilyMember.entity";
import { Profile } from "../entities/profile.entity";

@Injectable()
export class FamilyService {
  constructor(
    @InjectRepository(Family) private readonly familyRepo: Repository<Family>,
    @InjectRepository(FamilyMember)
    private readonly memberRepo: Repository<FamilyMember>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) {}

  // Create Family
  async createFamily(input: CreateFamilyInput): Promise<Family> {
    const id = generateID();
    try {
      let family = await this.familyRepo.findOne({
        where: { familyName: input.familyName },
      });
      if (family)
        throw new BadRequestException("Family name is already registered");
      const familyCode = await this.getFamilyCode();
      family = this.familyRepo.create({ ...input, id });
      family.familyCode = familyCode;
      await this.familyRepo.save(family);

      console.log(family);

      return family;
    } catch (error) {
      throw error;
    }
  }

  // Get Families
  async getFamilies(): Promise<Family[]> {
    try {
      const families = await this.familyRepo.find({ relations: ["members"] });

      return families;
    } catch (error) {
      throw error;
    }
  }

  // Get Family
  async getFamily(id: string): Promise<Family> {
    try {
      const family = await this.familyRepo.findOne({
        where: { id },
        relations: ["members"],
      });
      if (!family) throw new NotFoundException("Family id not correct");
      return family;
    } catch (error) {
      throw error;
    }
  }

  // Get Family By FamilyCode
  async getFamilyByFamilyCode(familyCode: string): Promise<Family> {
    try {
      const family = await this.familyRepo.findOneBy({ familyCode });
      return family;
    } catch (error) {
      throw error;
    }
  }

  // Update Family
  async updateFamily(input: UpdateFamilyInput): Promise<Family> {
    try {
      const family = await this.getFamily(input.id);
      Object.assign(family, input);

      await this.familyRepo.save(family);
      return family;
    } catch (error) {
      throw error;
    }
  }

  // Delete Family

  async deleteFamily(id: string): Promise<Family> {
    try {
      const family = await this.familyRepo.findOne({ where: { id } });
      if (!family) throw new NotFoundException("Family not found");
      await this.familyRepo.delete(id);
      return family;
    } catch (error) {
      throw error;
    }
  }
  /**
      Family Member
 */

  // Get Members
  async getFamilyMembers(): Promise<FamilyMember[]> {
    return await this.memberRepo.find();
  }

  // Get Members By Family

  async getFamilyMembersByFamily(familyId: string): Promise<FamilyMember[]> {
    return await this.memberRepo.find({
      where: { family: { id: familyId } },
    });
  }
  // Get Members
  async getFamilyMember(id: string): Promise<FamilyMember> {
    try {
      const member = await this.memberRepo.findOne({ where: { id } });

      return member;
    } catch (error) {
      throw error;
    }
  }

  // Create Member
  async createFamilyMember(
    input: CreateFamilyMemberInput,
  ): Promise<FamilyMember> {
    if (!input?.profile)
      throw new BadRequestException("No Profile ID was provided");
    const id = generateID();
    try {
      const isMember = await this.memberRepo.findOneBy({
        profile: { id: input.profile },
      });
      if (isMember) {
        console.log(isMember);
        throw new BadRequestException("User already belongs to a family");
      }

      const profile = await this.profileRepo.findOneBy({ id: input.profile });
      const family = await this.getFamily(input.family);

      const member = this.memberRepo.create({ role: input.role, id });
      member.family = family;
      member.profile = profile;
      profile.family = family;
      await this.memberRepo.save(member);
      await this.profileRepo.save(profile);
      return member;
    } catch (error) {
      throw error;
    }
  }
  // Update member
  async updateFamilyMember(
    input: UpdateFamilyMemberInput,
  ): Promise<FamilyMember> {
    try {
      const member = await this.getFamilyMember(input.id);
      Object.assign(member, input);
      await this.memberRepo.save(member);
      return member;
    } catch (error) {
      throw error;
    }
  }
  // Delete Member
  async deleteFamilyMember(id: string): Promise<FamilyMember> {
    try {
      const member = await this.memberRepo.findOne({ where: { id } });
      if (!member) throw new NotFoundException("Record not found");
      await this.memberRepo.delete(id);
      return member;
    } catch (error) {
      throw error;
    }
  }

  private async getFamilyCode() {
    const families = await this.familyRepo.find();

    // get the last item
    const lastItem = families[families.length - 1];

    // get only the number
    const lastItemNumber = lastItem?.familyCode?.split("-")?.[1];
    const count = families.length ? Number(lastItemNumber) + 1 : 1;

    const familycode = `fam-${count.toString().padStart(4, "0")}`;
    return familycode;
  }
}
