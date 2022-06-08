import {
  Field,
  InputType,
  ObjectType,
  OmitType,
  PartialType,
} from "@nestjs/graphql";
import { Profile } from "../entities/profile.entity";

@ObjectType()
@InputType()
export class CreateProfileInput extends PartialType(
  OmitType(
    Profile,
    [
      "accountTypes",
      "isActive",
      "emailToken",
      "isEmailVerified",
      "isPhoneVerified",
      "otp",
      "role",
      "lastSeen",
      "id",
      "student",
      "family",
      "classes",
    ],
    InputType,
  ),
) {
  @Field()
  firstName: string;
  @Field()
  lastName: string;
  @Field()
  middleName: string;
  @Field({ nullable: true })
  familyId: string;
  @Field({ nullable: true })
  familyRole: string;
}

@ObjectType()
@InputType()
export class UpdateProfileInput extends PartialType(
  CreateProfileInput,
  InputType,
) {
  @Field()
  id: string;
}

@InputType()
export class UploadImageInput {
  @Field()
  id: string;
  @Field()
  image: string;
}
