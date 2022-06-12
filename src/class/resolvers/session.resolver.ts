import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateSessionInput, UpdateSessionInput } from "../dtos/session.dto";
import { Session } from "../entities/sessions.entity";
import { SessionService } from "../services/session.service";

@Resolver()
export class SessionResolver {
  constructor(private readonly sessionService: SessionService) {}

  @Query(() => Session)
  async getSession(@Args("id") id: string) {
    return this.sessionService.getSession(id);
  }
  @Query(() => [Session])
  async getSessions() {
    return this.sessionService.getSessions();
  }

  @Mutation(() => Session)
  createSession(@Args("input") input: CreateSessionInput) {
    return this.sessionService.createSession(input);
  }
  @Mutation(() => Session)
  updateSession(@Args("input") input: UpdateSessionInput) {
    return this.sessionService.updateSession(input);
  }
  @Mutation(() => Session)
  deleteSession(@Args("id") id: string) {
    return this.sessionService.deleteSession(id);
  }
  @Mutation(() => Boolean)
  setCurrentSession(@Args("id") id: string) {
    return this.sessionService.setCurrentSession(id);
  }
}
