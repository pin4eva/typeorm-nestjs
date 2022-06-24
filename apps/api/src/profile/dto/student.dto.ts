import {
  Field,
  ID,
  InputType,
  ObjectType,
  OmitType,
  PartialType,
} from "@nestjs/graphql";
import { ClassRoom } from "../../class/entities/class.entity";

import { Profile } from "../entities/profile.entity";

@ObjectType()
@InputType()
export class CreateStudentInput {
  @Field()
  profile: Profile;
  @Field()
  class: ClassRoom;
}

// create medical
@ObjectType()
@InputType()
export class CreateStudentMedicalRecordInput {
  @Field(() => [String], { nullable: true })
  allergies?: string[];

  @Field(() => [String], { nullable: true })
  routineDrugs?: string[];

  @Field(() => [String], { nullable: true })
  drugReactions?: string[];

  @Field(() => ID)
  studentId: string;
}

// updateMedical
@ObjectType()
@InputType()
export class UpdateStudentMedicalRecordInput extends PartialType(
  OmitType(CreateStudentMedicalRecordInput, ["studentId"], InputType),
) {
  @Field(() => ID)
  id: string;
}

// Create contact
@ObjectType()
@InputType()
export class CreateStudentContactInput {
  @Field()
  name: string;

  @Field()
  phone: string;

  @Field({ nullable: true })
  image?: string;

  @Field()
  contactType: string;

  @Field()
  studentId: string;
}

// update contact

@ObjectType()
@InputType()
export class UpdateStudentContactInput extends PartialType(
  OmitType(CreateStudentContactInput, ["studentId"], InputType),
) {
  @Field(() => ID)
  id: string;
}
