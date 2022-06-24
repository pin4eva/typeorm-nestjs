import { Field, ID, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsString } from "class-validator";

@ObjectType()
@InputType()
export class CreateAttendanceInput {
  @IsString()
  @Field()
  studentId: string;

  @IsString()
  @Field()
  classId: string;

  @IsString()
  @Field()
  term: string;

  @IsNumber()
  @Field(() => Int)
  week: number;

  @IsString()
  @Field()
  date: string;
}

ObjectType();
@InputType()
export class UpdateAttendanceInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  week: number;
  @Field({ nullable: true })
  date: string;
  @Field({ nullable: true })
  term: string;
}

@ObjectType()
@InputType()
export class FilterAttendanceInput {
  @Field({ nullable: true })
  class: string;
  @Field({ nullable: true })
  term: string;
  @Field({ nullable: true })
  student: string;
  @Field({ nullable: true })
  week: number;
  @Field({ nullable: true })
  date: string;
}

@ObjectType()
@InputType()
export class BulkAttendanceInput {
  @IsString()
  @Field()
  classId: string;

  @Field(() => [String])
  studentIds: string[];

  @IsString()
  @Field()
  term: string;

  @IsNumber()
  @Field(() => Int)
  week: number;

  @IsString()
  @Field()
  date: string;
}
