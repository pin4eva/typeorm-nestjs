import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/profile/entities/profile.entity';
import { ProfileModule } from 'src/profile/profile.module';
import { Family } from './entities/Family.entity';
import { FamilyHospital } from './entities/FamilyMedical.entity';
import { FamilyMember } from './entities/FamilyMember.entity';
import { FamilyResolver } from './resolvers/family.resolver';
import { FamilyService } from './services/family.service';

@Module({
  imports: [TypeOrmModule.forFeature([Family, FamilyMember, FamilyHospital, Profile])],
  providers: [FamilyService, FamilyResolver]
})

export class FamilyModule { }