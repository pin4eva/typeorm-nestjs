import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Student } from "../../student/entities/student.entity";
import { AddStudentToClassInput, CreateClassInput } from "../dtos/class.dto";
import { UpdateClassInput } from "../dtos/update-class.dto";
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
  @Query(() => [ClassRoom])
  async getClassesBySession(@Args("session") session: string) {
    const classRooms = await this.classService.getClassesBySession(session);
    return classRooms;
  }

  @Mutation(() => ClassRoom)
  addStudentToClass(@Args("input") input: AddStudentToClassInput) {
    return this.classService.addStudentToClass(input);
  }

  @Query(() => [Student])
  getStudentsBySession(@Args("session") session: string) {
    return this.classService.getStudentsBySession(session);
  }

  @Query(() => [Student])
  getStudentsByClass(@Args("classId") classId: string) {
    return this.classService.getStudentsByClass(classId);
  }
}
