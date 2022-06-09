import { ObjectType, InputType, Field, ID } from "@nestjs/graphql";
import { IsString, IsNotEmpty } from "class-validator";

@ObjectType()
@InputType()
export class UpdateClassInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => ID)
  id: string;

  @IsString()
  @Field()
  name: string;
}
