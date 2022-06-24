import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProfileModule } from "../profile/profile.module";
import { Student } from "../student/entities/student.entity";
import { ClassRoom } from "./entities/class.entity";
import { Session } from "./entities/sessions.entity";
import { ClassResolver } from "./resolvers/class.resolver";
import { SessionResolver } from "./resolvers/session.resolver";
import { ClassService } from "./services/class.service";
import { SessionService } from "./services/session.service";

@Module({
  providers: [ClassResolver, ClassService, SessionService, SessionResolver],
  imports: [
    TypeOrmModule.forFeature([Session, ClassRoom, Student]),
    ProfileModule,
  ],
  exports: [ClassService],
})
export class ClassModule {}
