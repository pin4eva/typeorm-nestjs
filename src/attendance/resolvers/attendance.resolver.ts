import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateAttendanceInput, FilterAttendanceInput, UpdateAttendanceInput } from '../dtos/attendance.dto';
import { Attendance } from '../entities/attendance.entity';
import { AttendanceService } from '../services/attendance.service';

@Resolver()
export class AttendanceResolver {
  constructor(private readonly attendanceService: AttendanceService) { }

  // createAttendance
  @Mutation(() => Attendance)
  createAttendance(@Args("input") input: CreateAttendanceInput) {
    return this.attendanceService.createAttendance(input)
  }

  // updateAttendance
  @Mutation(() => Attendance)
  updateAttendance(@Args("input") input: UpdateAttendanceInput) {
    return this.attendanceService.updateAttendance(input)
  }

  // deleteAttendance
  @Mutation(() => Attendance)
  deleteAttendance(@Args("id") id: string) {
    return this.attendanceService.deleteAttendance(id)
  }

  // getAttendanceById
  @Query(() => Attendance)
  getAttendanceById(@Args("id") id: string) {
    return this.attendanceService.getAttendanceById(id)
  }

  // getAttendanceByClass
  @Query(() => [Attendance])
  getAttendance(@Args("input") input: FilterAttendanceInput) {
    return this.attendanceService.getAttendance(input)
  }


  // getAttendanceByClass
  @Query(() => [Attendance])
  getAttendanceByStudentId(@Args("input") input: FilterAttendanceInput) {
    return this.attendanceService.getAttendanceByByStudent(input)
  }
}
