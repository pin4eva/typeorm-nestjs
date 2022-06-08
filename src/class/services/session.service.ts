import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Raw, Repository } from "typeorm";
import { CreateSessionInput, UpdateSessionInput } from "../dtos/session.dto";
import { Session } from "../entities/sessions.entity";

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session) private sessionRepo: Repository<Session>,
  ) {}

  // Create Session
  async createSession(input: CreateSessionInput): Promise<Session> {
    try {
      let session = await this.sessionRepo.findOne({
        where: [
          {
            name: Raw(
              (alias) =>
                `LOWER(${alias}) LIKE '%${input.name.toLowerCase()}%' `,
            ),
          },
          {
            year: input.year,
          },
        ],
      });

      if (session)
        throw new BadRequestException(
          "Session already exist. Duplicate name or year",
        );

      session = this.sessionRepo.create(input);

      await this.sessionRepo.save(session);

      return session;
    } catch (error) {
      throw error;
    }
  }

  // Update Session
  async updateSession(input: UpdateSessionInput): Promise<Session> {
    try {
      const session = await this.sessionRepo.findOneBy({ id: input.id });
      if (!session) throw new NotFoundException("Incorrect session id");

      Object.assign(session, input);

      await this.sessionRepo.save(session);

      await this.sessionRepo.save(session);

      return session;
    } catch (error) {
      throw error;
    }
  }

  // Mark current Session

  async setCurrentSession(id: string): Promise<boolean> {
    try {
      const session = await this.sessionRepo.findOneBy({ id });
      if (!session) throw new NotFoundException("Incorrect Session ID");
      await this.sessionRepo.update(id, { isCurrent: true });
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Get All sessions

  async getSessions(): Promise<Session[]> {
    try {
      const sessions = await this.sessionRepo.find();
      return sessions;
    } catch (error) {
      throw error;
    }
  }

  // Get Session
  async getSession(id: string): Promise<Session> {
    try {
      const session = await this.sessionRepo.findOne({
        where: { id },
        relations: ["classes"],
      });
      if (!session) throw new NotFoundException("Session not found");
      return session;
    } catch (error) {
      throw error;
    }
  }

  // Delete Sessions
  async deleteSession(id: string): Promise<Session> {
    try {
      const session = await this.getSession(id);
      await this.sessionRepo.delete(id);
      return session;
    } catch (error) {
      throw error;
    }
  }
}
