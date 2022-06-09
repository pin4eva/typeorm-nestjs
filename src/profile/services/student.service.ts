import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Student } from "../../class/entities/student.entity";
import { CreateStudentInput } from "../dto/student.dto";
// import { ProfileService } from "./profile.service";

@Injectable()
export class StudentService {
  constructor(
    // private readonly profileService: ProfileService,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  // Create Student and assign to class
  // async createStudent(input: CreateStudentInput): Promise<Student> {
  //   try {
  //     // const profile = await this.profileService.getProfile(input.profile);
  //     // const classRoom = await this.classRepo.findOneBy({ id: input.class });
  //     if (!input.class) throw new NotFoundException("Invalid class room id");
  //     const regNo = await this.createRegNo();
  //     const student = this.studentRepo.create({ regNo });

  //     student.profileId = input.profile;
  //     student.classId = input.class;

  //     await this.studentRepo.save(student);

  //     return student;
  //   } catch (error) {
  //     throw new BadGatewayException(error);
  //   }
  // }
  // Assign a student to another class

  // Get students

  // Get Student

  // Get Student By RegNo

  // create RegNo.
  private async createRegNo() {
    const students = await this.studentRepo.find();

    const lastItem = students[students.length - 1];

    const lastItemNumber = lastItem?.regNo?.split("-")?.[1];

    const count = students.length ? Number(lastItemNumber) + 1 : 1;

    const regNo = `reg-${count.toString().padStart(4, "0")}`;

    return regNo;
  }
}
