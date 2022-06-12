import { Test, TestingModule } from "@nestjs/testing";
import { ClassResolver } from "./resolvers/class.resolver";
import { ClassService } from "./services/class.service";

describe("ClassResolver", () => {
  let resolver: ClassResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassResolver, ClassService],
    }).compile();

    resolver = module.get<ClassResolver>(ClassResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
