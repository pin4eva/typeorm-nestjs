import { Args, Query, Resolver } from "@nestjs/graphql";
import { Student } from "src/class/entities/student.entity";
import { ProfileService } from "src/profile/services/profile.service";
import { StudentService } from "../services/student.service";

@Resolver()
export class StudentResolver {
  constructor(
    private studentService: StudentService,
    private profileService: ProfileService,
  ) {}

  // get all students
  @Query(() => [Student])
  getStudents() {
    return this.studentService.getStudents();
  }
  // get students by session
  @Query(() => [Student])
  getStudentsBySession(@Args("session") session: string) {
    return this.studentService.getStudentsBySession(session);
  }
  // get students by session
  @Query(() => [Student])
  getStudentsByClass(@Args("classId") classId: string) {
    return this.studentService.getStudentsByClass(classId);
  }
  // get student by id
  @Query(() => Student)
  getStudent(@Args("id") id: string) {
    return this.studentService.getStudent(id);
  }

  // get student by regNo
  @Query(() => Student)
  getStudentByRegNo(@Args("regNo") regNo: string) {
    return this.studentService.getStudentByRegNo(regNo);
  }
}
