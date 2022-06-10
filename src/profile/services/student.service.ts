import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Student } from "../../class/entities/student.entity";
// import { ProfileService } from "./profile.service";

@Injectable()
export class StudentService {
  constructor(
    // private readonly profileService: ProfileService,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  /**
@see: profile.service.ts for createStudent
 */

  // Assign a student to another class

  // Get students
  async getStudents(): Promise<Student[]> {
    return await this.studentRepo.find({ relations: ["profile", "class"] });
  }

  // Get students by session
  async getStudentsBySession(session: string): Promise<Student[]> {
    try {
      const students = await this.studentRepo.find({
        where: { class: { session: { id: session } } },
        relations: ["profile", "class"],
      });
      return students;
    } catch (error) {
      throw error;
    }
  }

  // Get students by class
  async getStudentsByClass(classId: string): Promise<Student[]> {
    try {
      const students = await this.studentRepo.find({
        where: { class: { id: classId } },
        relations: ["profile", "class"],
      });

      return students;
    } catch (error) {
      throw error;
    }
  }

  // Get Student
  async getStudent(id: string): Promise<Student> {
    try {
      const student = await this.studentRepo.findOne({
        where: { id },
        relations: ["class", "profile"],
      });
      if (!student) throw new NotFoundException("Student not found");

      return student;
    } catch (error) {
      throw error;
    }
  }

  // Get Student By RegNo

  async getStudentByRegNo(regNo: string): Promise<Student> {
    try {
      const student = await this.studentRepo.findOne({
        where: { regNo },
        relations: ["class", "profile"],
      });
      if (!student) throw new NotFoundException("Student not found");

      return student;
    } catch (error) {
      throw error;
    }
  }

  async deleteStudent(id: string): Promise<Student> {
    try {
      const student = await this.getStudent(id);
      await this.studentRepo.delete(id);
      return student;
    } catch (error) {
      throw error;
    }
  }
}
