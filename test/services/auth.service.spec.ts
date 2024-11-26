import { Test, TestingModule } from '@nestjs/testing';
import { AuthServiceImpl } from '../../src/application/services/impl/auth.service.impl';

describe('AuthService', () => {
  let service: AuthServiceImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthServiceImpl],
    }).compile();

    service = module.get<AuthServiceImpl>(AuthServiceImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
