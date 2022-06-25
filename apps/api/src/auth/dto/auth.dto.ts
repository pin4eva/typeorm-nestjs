import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsEmail, IsString } from "class-validator";

@ObjectType()
@InputType()
export class SignupInput {
  @IsString()
  @Field()
  profileId: string;

  @IsString()
  @Field()
  password: string;
}

@ObjectType()
export class LoginResponse {
  @Field()
  token: string;
  @Field()
  id: string;
}

@ObjectType()
@InputType()
export class LoginInput {
  @IsEmail()
  @Field()
  email: string;
  @IsString()
  @Field()
  password: string;
}

@InputType()
export class CreateNewPasswordInput {
  @Field()
  emailToken: string;
  @Field()
  password: string;
}

@InputType()
export class ChangeAuthPasswordInput {
  id: string;
  @Field()
  password: string;
  @Field()
  oldPassword: string;
}

@ObjectType()
@InputType()
export class ResetAuthInput {
  @Field()
  email: string;

  @Field()
  profileId: string;

  @Field()
  password: string;
}
