import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClassRoom } from "src/class/entities/class.entity";
import { Session } from "src/class/entities/sessions.entity";

import { Profile } from "./entities/profile.entity";
import { StudentContact } from '../student/entities/student-contact.entity';
import { StudentMedical } from '../student/entities/student-medical.entity';
import { Student } from "../student/entities/student.entity";
import { FamilyResolver } from "../family/resolvers/family.resolver";
import { ProfileResolver } from "./resolvers/profile.resolver";
import { StudentResolver } from "../student/resolvers/student.resolver";
import { FamilyService } from "../family/services/family.service";
import { ProfileService } from "./services/profile.service";
import { Family } from 'src/family/entities/Family.entity';
import { FamilyHospital } from 'src/family/entities/FamilyMedical.entity';
import { FamilyMember } from 'src/family/entities/FamilyMember.entity';
import { FamilyModule } from 'src/family/family.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Profile,
      Student,
      StudentContact,
      StudentMedical,
      Family,
      FamilyMember,
      FamilyHospital,
      ClassRoom,
      Session,
    ]),

  ],
  providers: [
    ProfileResolver,
    ProfileService,
    FamilyService

  ],
  exports: [ProfileService],
})
export class ProfileModule { }
