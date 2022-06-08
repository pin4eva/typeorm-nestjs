import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateClassInput, UpdateClassInput } from "../dtos/class.dto";
import { ClassRoom } from "../entities/class.entity";
import { ClassService } from "../services/class.service";

@Resolver()
export class ClassResolver {
  constructor(private readonly classService: ClassService) {}

  @Mutation(() => ClassRoom)
  createClass(@Args("input") input: CreateClassInput) {
    return this.classService.createClass(input);
  }

  @Mutation(() => ClassRoom)
  updateClass(@Args("input") input: UpdateClassInput) {
    return this.classService.updateClass(input);
  }
  @Query(() => ClassRoom)
  getClass(@Args("id") id: string) {
    return this.classService.getClass(id);
  }
  @Mutation(() => ClassRoom)
  deleteClass(@Args("id") id: string) {
    return this.classService.deleteClass(id);
  }
  @Query(() => [ClassRoom])
  async getClasses() {
    const classRooms = await this.classService.getClasses();
    return classRooms;
  }
}
