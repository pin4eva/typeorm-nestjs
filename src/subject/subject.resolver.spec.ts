import { Test, TestingModule } from '@nestjs/testing';
import { SubjectResolver } from './resolvers/subject.resolver';
import { SubjectService } from './services/subject.service';

describe('SubjectsResolver', () => {
  let resolver: SubjectResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubjectResolver, SubjectService],
    }).compile();

    resolver = module.get<SubjectResolver>(SubjectResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
