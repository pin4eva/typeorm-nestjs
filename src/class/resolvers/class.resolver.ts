import { Resolver } from "@nestjs/graphql";
import { ClassService } from "../services/class.service";

@Resolver()
export class ClassResolver {
  constructor(private readonly classService: ClassService) {}
}
