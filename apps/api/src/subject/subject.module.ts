import { Module } from "@nestjs/common";
import { SubjectService } from "./services/subject.service";
import { SubjectResolver } from "./resolvers/subject.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Subject } from "./entities/subject.entity";

@Module({
  providers: [SubjectResolver, SubjectService],
  imports: [TypeOrmModule.forFeature([Subject])],
})
export class SubjectsModule {}
