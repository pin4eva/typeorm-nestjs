import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClassRoom } from "src/class/entities/class.entity";
import { Session } from "src/class/entities/sessions.entity";
import { ClassService } from "src/class/services/class.service";
import { StudentService } from "src/profile/services/student.service";
import { Student } from "../class/entities/student.entity";
import { Family } from "./entities/Family.entity";
import { FamilyMember } from "./entities/FamilyMember.entity";
import { Profile } from "./entities/profile.entity";
import { FamilyResolver } from "./resolvers/family.resolver";
import { ProfileResolver } from "./resolvers/profile.resolver";
import { FamilyService } from "./services/family.service";
import { ProfileService } from "./services/profile.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Profile,
      Student,
      Family,
      FamilyMember,
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
  ],
  exports: [ProfileService],
})
export class ProfileModule {}
