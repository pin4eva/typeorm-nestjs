import { Resolver } from "@nestjs/graphql";
import { ProfileService } from "src/profile/services/profile.service";
import { StudentService } from "../services/student.service";

@Resolver()
export class StudentResolver {
  constructor(
    private studentService: StudentService,
    private profileService: ProfileService,
  ) {}

  // create Student
  // @Mutation(() => Student)
  // async createStudent(@Args("input") input: CreateProfileInput) {
  //   const { accountType, classId, ...rest } = input;
  //   if (accountType !== AccountTypeEnum.Student)
  //     throw new BadRequestException("Please Add a student account type");
  //   const profile = await this.profileService.createProfile(rest);

  //   const student = await this.studentService.createStudent()
  // }
}
