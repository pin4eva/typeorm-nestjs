import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  CreateFamilyHospitalInput,
  CreateFamilyInput,
  CreateFamilyMemberInput,
  UpdateFamilyHospitalInput,
  UpdateFamilyInput,
  UpdateFamilyMemberInput,
} from "../../profile/dto/family.dto";
import { Family } from "../entities/Family.entity";
import { FamilyHospital } from '../entities/FamilyMedical.entity';
import { FamilyMember } from "../entities/FamilyMember.entity";
import { FamilyService } from "../services/family.service";

@Resolver()
export class FamilyResolver {
  constructor(private readonly familyService: FamilyService) { }

  @Query(() => [Family])
  getFamilies() {
    return this.familyService.getFamilies();
  }
  @Query(() => Family)
  getFamily(@Args("id") id: string) {
    return this.familyService.getFamily(id);
  }
  @Query(() => Family)
  getFamilyByFamilyCode(@Args("familyCode") familyCode: string) {
    return this.familyService.getFamilyByFamilyCode(familyCode);
  }
  @Mutation(() => Family)
  async createFamily(@Args("input") input: CreateFamilyInput) {
    return this.familyService.createFamily(input);
  }
  @Mutation(() => Family)
  async updateFamily(@Args("input") input: UpdateFamilyInput) {
    return this.familyService.updateFamily(input);
  }
  @Mutation(() => Family)
  deleteFamily(@Args("id") id: string) {
    return this.familyService.deleteFamily(id);
  }

  // Family Member

  @Query(() => [FamilyMember])
  getFamilyMembers() {
    return this.familyService.getFamilyMembers();
  }

  @Mutation(() => FamilyMember)
  async createFamilyMember(@Args("input") input: CreateFamilyMemberInput) {
    return this.familyService.createFamilyMember(input);
  }

  @Mutation(() => FamilyMember)
  updateFamilyMember(@Args("input") input: UpdateFamilyMemberInput) {
    return this.familyService.updateFamilyMember(input);
  }

  @Mutation(() => FamilyMember)
  deleteFamilyMember(@Args("id") id: string) {
    return this.familyService.deleteFamilyMember(id);
  }

  // createFamilyHospital
  @Mutation(() => FamilyHospital)
  createFamilyHospital(@Args("input") input: CreateFamilyHospitalInput) {
    return this.familyService.createFamilyHospital(input)
  }

  // updateFamilyHospital
  @Mutation(() => FamilyHospital)
  updateFamilyHospital(@Args("input") input: UpdateFamilyHospitalInput) {
    return this.familyService.updateFamilyHospital(input)
  }

  // deleteFamilyHospital
  @Mutation(() => FamilyHospital)
  deleteFamilyHospital(@Args("id") id: string) {
    return this.familyService.deleteFamilyHospital(id)
  }

  // getFamilyHospitalByFamilyId
  @Query(() => [FamilyHospital])
  getFamilyHospitalByFamilyId(@Args("familyId") familyId: string) {
    return this.familyService.getHospitalsByFamilyId(familyId)
  }


  @Mutation(() => Boolean)
  clearFamily() {
    return this.familyService.clearFamily();
  }
}
