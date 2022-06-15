import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateID } from 'src/utils/helpers';
import { Repository } from 'typeorm';
import { CreateSubjectInput, UpdateSubjectInput } from '../dtos/subject.dto';
import { Subject } from '../entities/subject.entity';

@Injectable()
export class SubjectService {
  constructor(@InjectRepository(Subject) private readonly subjectRepo: Repository<Subject>) { }
  logger = new Logger(Subject.name)

  // create subject
  async createSubject(input: CreateSubjectInput): Promise<Subject> {
    const subject = this.subjectRepo.create(input);
    try {
      subject.id = generateID();

      await this.subjectRepo.save(subject)

      return subject
    } catch (error) {
      this.logger.error(error)
    }
  }

  // update
  async updateSubject(input: UpdateSubjectInput): Promise<Subject> {
    const subject = await this.subjectRepo.findOneBy({ id: input.id });
    if (!subject) throw new NotFoundException("Invalid Subject ID")
    try {
      Object.assign(subject, input)

      await this.subjectRepo.save(subject)

      return subject
    } catch (error) {
      this.logger.error(error)
    }
  }

  // delete
  async deleteSubject(id: string): Promise<Subject> {
    const subject = await this.getSubject(id);

    try {
      await this.subjectRepo.delete(id)
      return subject
    } catch (error) {
      this.logger.error(error)
    }
  }
  // get Subjects
  async getSubjects(): Promise<Subject[]> {

    try {

      return await this.subjectRepo.find()
    } catch (error) {
      this.logger.error(error)
    }
  }

  // get Subject
  async getSubject(id: string): Promise<Subject> {
    const subject = await this.subjectRepo.findOneBy({ id });
    if (!subject) throw new NotFoundException("Invalid Subject ID")
    try {

      return subject
    } catch (error) {
      this.logger.error(error)
    }
  }
}
