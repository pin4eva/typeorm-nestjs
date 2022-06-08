import { Field, ID, InputType, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
@InputType()
export class CreateSessionInput {
  @Field()
  name: string;
  @Field(() => Int)
  year: number;
}

@ObjectType()
@InputType()
export class UpdateSessionInput extends CreateSessionInput {
  @Field(() => ID)
  id: string;
}
