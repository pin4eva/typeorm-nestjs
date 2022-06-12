import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { ClassRoom } from "src/class/entities/class.entity";
import { Profile } from "../entities/profile.entity";

@ObjectType()
@InputType()
export class CreateStudentInput {
  @Field()
  profile: Profile;
  @Field()
  class: ClassRoom;
}
