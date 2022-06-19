import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClassRoom } from "src/class/entities/class.entity";
import { StudentContact } from "./entities/student-contact.entity";
import { StudentMedical } from "./entities/student-medical.entity";
import { Student } from "./entities/student.entity";
import { StudentResolver } from "./resolvers/student.resolver";
import { StudentService } from "./services/student.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      StudentContact,
      StudentMedical,
      ClassRoom,
    ]),
  ],
  providers: [StudentService, StudentResolver],
  exports: [StudentService],
})
export class StudentModule {}
