import { Module } from "@nestjs/common";
import { ProfileService } from "./services/profile.service";
import { ProfileResolver } from "./resolvers/profile.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Profile } from "./entities/profile.entity";
import { Student } from "./entities/student.entity";
import { Family } from "./entities/Family.entity";
import { FamilyService } from "./services/family.service";
import { FamilyResolver } from "./resolvers/family.resolver";
import { FamilyMember } from "./entities/FamilyMember.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Student, Family, FamilyMember])],
  providers: [ProfileResolver, ProfileService, FamilyService, FamilyResolver],
  exports: [ProfileService],
})
export class ProfileModule {}
