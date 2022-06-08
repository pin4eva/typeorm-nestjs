import { Module } from "@nestjs/common";
import { ClassService } from "./services/class.service";
import { ClassResolver } from "./resolvers/class.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Session } from "./entities/sessions.entity";
import { Class } from "./entities/class.entity";
import { SessionService } from "./services/session.service";
import { SessionResolver } from "./resolvers/session.resolver";

@Module({
  providers: [ClassResolver, ClassService, SessionService, SessionResolver],
  imports: [TypeOrmModule.forFeature([Session, Class])],
})
export class ClassModule {}
