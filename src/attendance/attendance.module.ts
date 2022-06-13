import { Module } from '@nestjs/common';
import { AttendanceService } from './services/attendance.service';
import { AttendanceResolver } from './resolvers/attendance.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';

@Module({
  providers: [AttendanceResolver, AttendanceService],
  imports: [TypeOrmModule.forFeature([Attendance])]
})
export class AttendanceModule { }
