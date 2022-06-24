import { TestingModule, Test } from "@nestjs/testing";
import { AttendanceService } from "../services/attendance.service";
import { AttendanceResolver } from "./attendance.resolver";

describe("AttendanceResolver", () => {
  let resolver: AttendanceResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendanceResolver, AttendanceService],
    }).compile();

    resolver = module.get<AttendanceResolver>(AttendanceResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });
});
