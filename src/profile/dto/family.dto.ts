import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@ObjectType()
@InputType()
export class CreateFamilyInput {
  @IsString()
  @Field()
  familyName: string;
}

@ObjectType()
@InputType()
export class UpdateFamilyInput extends CreateFamilyInput {
  @Field()
  id: string;
}

// Family Member
@ObjectType()
@InputType()
export class CreateFamilyMemberInput {
  @IsString()
  @Field(() => ID)
  family: string;
  @IsString()
  @Field(() => ID)
  profile: string;
  @IsString()
  @Field()
  role: string;
}

@InputType()
export class UpdateFamilyMemberInput {
  @Field(() => ID)
  id: string;
  @Field()
  role: string;
}
