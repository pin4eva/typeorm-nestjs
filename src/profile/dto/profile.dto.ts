import { Field, InputType, ObjectType, PartialType } from "@nestjs/graphql";
import { AccountTypeEnum } from "../interfaces/profile.interface";

@ObjectType()
@InputType()
export class CreateProfileInput {
  @Field()
  firstName: string;
  @Field()
  lastName: string;
  @Field()
  middleName: string;
  @Field({ nullable: true })
  otherName?: string;
  @Field({ nullable: true })
  familyCode: string;
  @Field({ nullable: true })
  familyRole: string;
  @Field({ nullable: true })
  class?: string;
  @Field({ nullable: true })
  email?: string;
  @Field({ nullable: true })
  address: string;
  @Field()
  state: string;
  @Field()
  lga: string;
  @Field({ nullable: true })
  dob: string;
  @Field({ nullable: true })
  phone: string;
  @Field()
  gender: "Male" | "Female";
  @Field(() => String)
  accountType: AccountTypeEnum;
  @Field({ nullable: true })
  image: string;
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
