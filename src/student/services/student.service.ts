import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClassRoom } from "src/class/entities/class.entity";
import { Student } from "src/student/entities/student.entity";
import { generateID } from "src/utils/helpers";
import { Repository } from "typeorm";
import {
  CreateStudentContactInput,
  CreateStudentMedicalRecordInput,
  UpdateStudentContactInput,
  UpdateStudentMedicalRecordInput,
} from "../../profile/dto/student.dto";
import { StudentContact } from "../entities/student-contact.entity";
import { StudentMedical } from "../entities/student-medical.entity";

// import { ProfileService } from "./profile.service";

@Injectable()
export class StudentService {
  constructor(
    // private readonly profileService: ProfileService,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,

    @InjectRepository(StudentMedical)
    private readonly medicalRepo: Repository<StudentMedical>,

    @InjectRepository(StudentContact)
    private readonly contactRepo: Repository<StudentContact>,
    @InjectRepository(ClassRoom)
    private readonly classRepo: Repository<ClassRoom>,
  ) {}

  logger = new Logger(StudentService.name);
  /**
@see: profile.service.ts for createStudent
 */

  // Assign a student to another class

  // Get students
  async getStudents(): Promise<Student[]> {
    return await this.studentRepo.find({
      relations: ["profile", "profile.family"],
    });
  }

  // Get Student
  async getStudent(id: string): Promise<Student> {
    try {
      const student = await this.studentRepo.findOne({
        where: { id },
        relations: [
          "profile",
          "profile.family",
          "profile.student",
          "medicalRecord",
        ],
      });
      if (!student) throw new NotFoundException("Student not found");

      const classRoom = await this.classRepo.findOne({
        where: { session: { isCurrent: true }, students: { id } },
      });

      student.class = classRoom;

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
        relations: ["class", "profile", "profile.family"],
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

  /** Student Medicals */

  // getMedicalByStudentId
  async getMedicalRecordByStudentId(
    studentId: string,
  ): Promise<StudentMedical> {
    try {
      const medical = await this.medicalRepo.findOne({
        where: { student: { id: studentId } },
        relations: ["student"],
      });
      if (!medical) throw new NotFoundException("Invalid Student ID");

      return medical;
    } catch (error) {
      this.logger.error(error);
    }
  }

  // createMedicalRecord
  async createMedicalRecord(
    input: CreateStudentMedicalRecordInput,
  ): Promise<StudentMedical> {
    const { studentId, ...rest } = input;
    if (!input.studentId)
      throw new BadRequestException("Please include a student ID");

    const isMedical = await this.medicalRepo.findOne({
      where: { student: { id: studentId } },
    });

    if (isMedical) {
      throw new BadRequestException("Student Medical already exist");
    }

    const student = await this.getStudent(input.studentId);
    if (!student) throw new BadRequestException("Student not found");

    try {
      const medical = this.medicalRepo.create(rest);
      medical.id = generateID();
      medical.student = student;

      await this.medicalRepo.save(medical);
      return medical;
    } catch (error) {
      this.logger.error(error);
    }
  }

  // updateMedicalRecord
  async updateMedicalRecord(
    input: UpdateStudentMedicalRecordInput,
  ): Promise<StudentMedical> {
    const { id } = input;
    const medical = await this.medicalRepo.findOneByOrFail({ id });
    if (!medical) throw new NotFoundException("Invalid medical id");

    try {
      Object.assign(medical, input);

      await this.medicalRepo.save(medical);

      return medical;
    } catch (error) {
      this.logger.error(error);
    }
  }

  // deleteMedicalRecord
  async deleteMedicalRecord(id: string): Promise<StudentMedical> {
    const medical = await this.medicalRepo.findOneByOrFail({ id });
    if (!medical) throw new NotFoundException("Invalid Medical ID");
    try {
      await this.medicalRepo.delete(id);
      return medical;
    } catch (error) {
      this.logger.error(error);
    }
  }

  /**  Student Contact*/

  // Get Contacts by Student ID
  async getContactsByStudentId(id: string): Promise<StudentContact[]> {
    try {
      const contacts = await this.contactRepo.find({
        where: { student: { id } },
      });
      return contacts;
    } catch (error) {
      this.logger.error(error);
    }
  }

  // createContact
  async createContact(
    input: CreateStudentContactInput,
  ): Promise<StudentContact> {
    const { studentId, ...rest } = input;
    const student = await this.getStudent(studentId);
    if (!student) throw new BadRequestException("Student ID is invalid");

    try {
      const contact = this.contactRepo.create(rest);
      contact.id = generateID();
      contact.student = student;

      await this.contactRepo.save(contact);

      return contact;
    } catch (error) {
      this.logger.error(error);
    }
  }

  // UpdateContact
  async updateContact(
    input: UpdateStudentContactInput,
  ): Promise<StudentContact> {
    const { id } = input;
    const contact = await this.contactRepo.findOneBy({ id });
    if (!contact) throw new BadRequestException("Contact ID is invalid");
    try {
      Object.assign(contact, input);

      await this.contactRepo.save(contact);

      return contact;
    } catch (error) {
      this.logger.error(error);
    }
  }

  // deleteContact
  async deleteContact(id: string): Promise<StudentContact> {
    const contact = await this.contactRepo.findOneBy({ id });
    if (!contact) throw new NotFoundException("Invalid contact ID");
    try {
      await this.contactRepo.delete(id);
      return contact;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
