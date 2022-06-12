import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClassRoom } from "src/class/entities/class.entity";
import { Session } from "src/class/entities/sessions.entity";
import { StudentContact } from './entities/students/student-contact.entity';
import { StudentMedical } from './entities/students/student-medical.entity';
import { ClassService } from "src/class/services/class.service";
import { StudentService } from "src/profile/services/student.service";
import { Student } from "./entities/students/student.entity";
import { Family } from "./entities/Family.entity";
import { FamilyMedical } from './entities/FamilyMedical.entity';
import { FamilyMember } from "./entities/FamilyMember.entity";
import { Profile } from "./entities/profile.entity";
import { FamilyResolver } from "./resolvers/family.resolver";
import { ProfileResolver } from "./resolvers/profile.resolver";
import { StudentResolver } from "./resolvers/student.resolver";
import { FamilyService } from "./services/family.service";
import { ProfileService } from "./services/profile.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Profile,
      Student,
      StudentContact,
      StudentMedical,
      Family,
      FamilyMember,
      FamilyMedical,
      ClassRoom,
      Session,
    ]),
  ],
  providers: [
    ProfileResolver,
    ProfileService,
    FamilyService,
    FamilyResolver,
    StudentService,
    StudentResolver,
  ],
  exports: [ProfileService],
})
export class ProfileModule { }
