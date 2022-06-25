import { MAIL_CLIENT, MAIL_PORT } from "@app/common";
import { Module, Session } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClassRoom } from "../class/entities/class.entity";
import { Family } from "../family/entities/Family.entity";
import { FamilyHospital } from "../family/entities/FamilyMedical.entity";
import { FamilyMember } from "../family/entities/FamilyMember.entity";
import { FamilyService } from "../family/services/family.service";
import { StudentContact } from "../student/entities/student-contact.entity";
import { StudentMedical } from "../student/entities/student-medical.entity";
import { Student } from "../student/entities/student.entity";
import { Profile } from "./entities/profile.entity";
import { ProfileResolver } from "./resolvers/profile.resolver";
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
      FamilyHospital,
      ClassRoom,
      Session,
    ]),
    ClientsModule.register([
      {
        name: MAIL_CLIENT,
        transport: Transport.TCP,
        options: { port: +MAIL_PORT },
      },
    ]),
  ],
  providers: [ProfileResolver, ProfileService, FamilyService],
  exports: [ProfileService],
})
export class ProfileModule {}
