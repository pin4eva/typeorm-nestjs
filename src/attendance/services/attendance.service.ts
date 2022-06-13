import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassRoom } from 'src/class/entities/class.entity';
import { Student } from 'src/student/entities/student.entity';
import { generateID } from 'src/utils/helpers';
import { Repository } from 'typeorm';
import { CreateAttendanceInput, FilterAttendanceInput, UpdateAttendanceInput } from '../dtos/attendance.dto';
import { Attendance } from '../entities/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(@InjectRepository(Attendance) private readonly attendanceRepo: Repository<Attendance>) { }

  logger = new Logger(Attendance.name)


  // Create attendance
  async createAttendance(payload: CreateAttendanceInput): Promise<Attendance> {
    const { studentId, classId, term, week, date } = payload;

    const student = new Student();
    student.id = studentId;
    const classRoom = new ClassRoom()
    classRoom.id = classId;
    try {
      const attendance = this.attendanceRepo.create({ term, date: new Date(date), week });
      attendance.class = classRoom;
      attendance.student = student
      attendance.id = generateID();

      await this.attendanceRepo.save(attendance)

      return attendance;
    } catch (error) {
      this.logger.error(error)
    }
  }

  // Update attendance
  async updateAttendance(input: UpdateAttendanceInput): Promise<Attendance> {
    const attendance = await this.getAttendanceById(input.id);
    try {
      Object.assign(attendance, input);
      await this.attendanceRepo.save(attendance);

      return attendance;
    } catch (error) {
      this.logger.error(error)
    }
  }

  // delete Attendance
  async deleteAttendance(id: string): Promise<Attendance> {
    const attendance = await this.getAttendanceById(id);
    try {
      await this.attendanceRepo.delete(id);

      return attendance;
    } catch (error) {
      this.logger.error(error)
    }
  }

  async getAttendance(input: FilterAttendanceInput): Promise<Attendance[]> {
    try {
      let attendance: any = this.attendanceRepo.createQueryBuilder("attendance")
        .andWhere("attendance.classId = :classId", { classId: input.class })
        .andWhere("attendance.term = :term", { term: input?.term })

      attendance = input.week ? attendance.andWhere("attendance.week = :week", { week: Number(input.week) }).getMany() : attendance.getMany()

      return attendance;
    } catch (error) {
      this.logger.error(error)
    }
  }


  // Get attendance by Student, week
  async getAttendanceByByStudent(input: FilterAttendanceInput): Promise<Attendance[]> {

    try {
      let attendance: any = this.attendanceRepo.createQueryBuilder("attendance")
        .where("attendance.studentId = :student", { student: input.student })
        .andWhere("attendance.classId = :class", { class: input.class })
        .andWhere("attendance.term = :term", { term: input.term });

      attendance = input.week ? attendance.andWhere("attendance.week = :week", { week: Number(input.week) }).getMany() : attendance.getMany()

      return attendance;
    } catch (error) {
      this.logger.error(error)
    }
  }

  // get attendance
  async getAttendanceById(id: string): Promise<Attendance> {
    const attendance = await this.attendanceRepo.findOneBy({ id });

    if (!attendance) throw new NotFoundException("Attendance not found")
    try {
      return attendance;
    } catch (error) {
      this.logger.error(error)
    }
  }
}
