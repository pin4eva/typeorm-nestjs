import { Module } from "@nestjs/common";
import { ClassService } from "./services/class.service";
import { ClassResolver } from "./resolvers/class.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Session } from "./entities/sessions.entity";
import { ClassRoom } from "./entities/class.entity";
import { SessionService } from "./services/session.service";
import { SessionResolver } from "./resolvers/session.resolver";
import { ProfileModule } from "src/profile/profile.module";

@Module({
  providers: [ClassResolver, ClassService, SessionService, SessionResolver],
  imports: [TypeOrmModule.forFeature([Session, ClassRoom]), ProfileModule],
})
export class ClassModule {}
