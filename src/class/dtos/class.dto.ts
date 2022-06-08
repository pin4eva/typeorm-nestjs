import { Field, InputType, ObjectType } from "@nestjs/graphql";

@ObjectType()
@InputType()
export class CreateClassInput {
  @Field()
  name: string;
  @Field()
  teacher: string;
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
