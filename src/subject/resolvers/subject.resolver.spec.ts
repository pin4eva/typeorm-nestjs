import { Test, TestingModule } from '@nestjs/testing';
import { SubjectsResolver } from './subject.resolver';
import { SubjectsService } from '../services/subject.service';

describe('SubjectsResolver', () => {
  let resolver: SubjectsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubjectsResolver, SubjectsService],
    }).compile();

    resolver = module.get<SubjectsResolver>(SubjectsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
