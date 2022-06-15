import { Field, ID, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType()
@InputType()
export class CreateSubjectInput {
  @IsString()
  @Field()
  name: string

  @IsString()
  @Field()
  code: string
}

@ObjectType()
@InputType()
export class UpdateSubjectInput extends PartialType(CreateSubjectInput, InputType) {
  @IsString()
  @Field(() => ID)
  id: string

}