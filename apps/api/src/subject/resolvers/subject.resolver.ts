import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateSubjectInput, UpdateSubjectInput } from "../dtos/subject.dto";
import { Subject } from "../entities/subject.entity";
import { SubjectService } from "../services/subject.service";

@Resolver()
export class SubjectResolver {
  constructor(private readonly subjectService: SubjectService) {}

  // create subject
  @Mutation(() => Subject)
  createSubject(@Args("input") input: CreateSubjectInput) {
    return this.subjectService.createSubject(input);
  }

  // update subject
  @Mutation(() => Subject)
  updateSubject(@Args("input") input: UpdateSubjectInput) {
    return this.subjectService.updateSubject(input);
  }

  // delete subject
  @Mutation(() => Subject)
  deleteSubject(@Args("id") id: string) {
    return this.subjectService.deleteSubject(id);
  }

  // get subject
  @Query(() => Subject)
  getSubject(@Args("id") id: string) {
    return this.subjectService.getSubject(id);
  }
  // get subjects
  @Query(() => [Subject])
  getSubjects() {
    return this.subjectService.getSubjects();
  }
}
