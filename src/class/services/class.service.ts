import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cache } from "cache-manager";
import { ProfileService } from "src/profile/services/profile.service";
import { generateID } from "src/utils/helpers";
import { Repository } from "typeorm";
import { CreateClassInput } from "../dtos/class.dto";
import { UpdateClassInput } from "../dtos/update-class.dto";
import { ClassRoom } from "../entities/class.entity";
import { SessionService } from "./session.service";

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(ClassRoom)
    private readonly classRepo: Repository<ClassRoom>,
    private readonly profileService: ProfileService,
    private readonly sessionService: SessionService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  // Create class
  async createClass(input: CreateClassInput): Promise<ClassRoom> {
    const id = generateID();
    try {
      const teacher = await this.profileService.getProfile(input.teacher);
      const session = await this.sessionService.getSession(input.session);

      const isDuplicate = session?.classes?.some(
        (c) => c.name.toLowerCase() === input.name.toLowerCase(),
      );

      if (isDuplicate) {
        throw new BadRequestException("Class already exist with the same name");
      }
      const Class = this.classRepo.create({ name: input.name, id });
      Class.teacher = teacher;
      Class.session = session;
      await this.classRepo.save(Class);
      return Class;
    } catch (error) {
      throw error;
    }
  }
  // Update Class
  async updateClass(input: UpdateClassInput): Promise<ClassRoom> {
    try {
      let Class = this.classRepo.findOneBy({ id: input.id });

      await this.classRepo.update(input.id, { name: input.name });
      Class = this.classRepo.findOneBy({ id: input.id });
      return Class;
    } catch (error) {
      throw error;
    }
  }
  // get Class
  async getClass(id: string): Promise<ClassRoom> {
    try {
      const Class = await this.classRepo.findOne({
        where: { id },
        relations: ["session", "teacher"],
      });
      if (!Class) throw new NotFoundException("No record found for class");

      return Class;
    } catch (error) {
      throw error;
    }
  }

  // get Classes By Session
  async getClassesBySession(session: string): Promise<ClassRoom[]> {
    try {
      const classes = await this.classRepo.find({
        where: { session: { id: session } },
        relations: ["session", "students", "teacher"],
        order: { name: "ASC" },
      });
      return classes;
    } catch (error) {
      throw error;
    }
  }

  // delete Class
  async deleteClass(id: string): Promise<ClassRoom> {
    try {
      const Class = await this.getClass(id);
      await this.classRepo.delete(id);

      return Class;
    } catch (error) {
      throw error;
    }
  }
  // Get classes
  async getClasses(): Promise<ClassRoom[]> {
    try {
      return await this.classRepo.find({ relations: ["session", "students"] });
    } catch (error) {
      throw error;
    }
  }
}
