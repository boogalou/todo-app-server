import { Test, TestingModule } from '@nestjs/testing';
import { TaskServiceImpl } from '../../src/application/services/impl/task.service.impl';

describe('TaskService', () => {
  let service: TaskServiceImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskServiceImpl],
    }).compile();

    service = module.get<TaskServiceImpl>(TaskServiceImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
