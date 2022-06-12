import { Field, ID, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

@ObjectType()
@InputType()
export class CreateSessionInput {
  @IsNotEmpty()
  @Field()
  name: string;
  @IsNumber()
  @Field(() => Int)
  year: number;
}

@ObjectType()
@InputType()
export class UpdateSessionInput extends CreateSessionInput {
  @IsString()
  @Field(() => ID)
  id: string;
}
