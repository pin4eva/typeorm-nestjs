import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentContact } from './entities/student-contact.entity';
import { StudentMedical } from './entities/student-medical.entity';
import { Student } from './entities/student.entity';
import { StudentResolver } from './resolvers/student.resolver';
import { StudentService } from './services/student.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student, StudentContact, StudentMedical])],
  providers: [StudentService, StudentResolver],
  exports: [StudentService]
})

export class StudentModule { }