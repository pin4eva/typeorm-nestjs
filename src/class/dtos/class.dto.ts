import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

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
export class PromoteStudentsInput {
  @IsNotEmpty()
  @Field(() => ID)
  class: string;

  @IsNotEmpty()
  @Field(() => [String])
  students: string[];
}

@ObjectType()
@InputType()
export class AddStudentToClassInput {
  @IsNotEmpty()
  @Field(() => ID)
  classId: string;

  @IsNotEmpty()
  @Field(() => ID)
  studentId: string;
}
