import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import {
  CreateStudentContactInput,
  CreateStudentMedicalRecordInput,
  UpdateStudentContactInput,
  UpdateStudentMedicalRecordInput,
} from "../../profile/dto/student.dto";
import { StudentContact } from "../entities/student-contact.entity";
import { StudentMedical } from "../entities/student-medical.entity";
import { Student } from "../entities/student.entity";
import { StudentService } from "../services/student.service";

@Resolver()
export class StudentResolver {
  constructor(private studentService: StudentService) {}

  // get all students
  @Query(() => [Student])
  getStudents() {
    return this.studentService.getStudents();
  }
  // get students by session
  // @Query(() => [Student])
  // getStudentsBySession(@Args("session") session: string) {
  //   return this.studentService.getStudentsBySession(session);
  // }
  // get students by session
  // @Query(() => [Student])
  // getStudentsByClass(@Args("classId") classId: string) {
  //   return this.studentService.getStudentsByClass(classId);
  // }
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

  // Delete Student
  @Mutation(() => Student)
  deleteStudent(@Args("id") id: string) {
    return this.studentService.deleteStudent(id);
  }

  /** STUDENT MEDICALS */

  // createStudentMedical
  @Mutation(() => StudentMedical)
  async createStudentMedical(
    @Args("input") input: CreateStudentMedicalRecordInput,
  ) {
    return this.studentService.createMedicalRecord(input);
  }

  // updateStudentMedical
  @Mutation(() => StudentMedical)
  async updateStudentMedical(
    @Args("input") input: UpdateStudentMedicalRecordInput,
  ) {
    return this.studentService.updateMedicalRecord(input);
  }

  // deleteStudentMedical
  @Mutation(() => StudentMedical)
  async deleteStudentMedical(@Args("id") id: string) {
    return this.studentService.deleteMedicalRecord(id);
  }

  // getStudentMedicalByStudentId
  @Query(() => StudentMedical)
  getStudentMedicalByStudentId(@Args("studentId") studentId: string) {
    return this.studentService.getMedicalRecordByStudentId(studentId);
  }

  /** STUDENT CONTACTS */

  // createStudentContact
  @Mutation(() => StudentContact)
  createStudentContact(@Args("input") input: CreateStudentContactInput) {
    return this.studentService.createContact(input);
  }

  // updateStudentContact
  @Mutation(() => StudentContact)
  updateStudentContact(@Args("input") input: UpdateStudentContactInput) {
    return this.studentService.updateContact(input);
  }

  // deleteStudentContact
  @Mutation(() => StudentContact)
  deleteStudentContact(@Args("id") id: string) {
    return this.studentService.deleteContact(id);
  }

  // getStudentContactByStudentId
  @Query(() => [StudentContact])
  getStudentContactByStudentId(@Args("studentId") studentId: string) {
    return this.studentService.getContactsByStudentId(studentId);
  }
}
