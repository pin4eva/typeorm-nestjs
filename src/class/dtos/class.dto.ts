import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@ObjectType()
@InputType()
export class CreateClassInput {
  @IsString({ message: "Name is required" })
  @Field()
  name: string;
  @IsString({ message: "Teacher is required" })
  @Field()
  teacher: string;
  @IsString({ message: "Session is required" })
  @Field()
  session: string;
}

@ObjectType()
@InputType()
export class UpdateClassInput {
  @Field()
  id: string;
  @Field()
  name: string;
}
