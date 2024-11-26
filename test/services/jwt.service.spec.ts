import { Test, TestingModule } from '@nestjs/testing';
import { JwtServiceImpl } from '../../src/infrastructure/services/impl/jwt.service.impl';

describe('JwtService', () => {
  let service: JwtServiceImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtServiceImpl],
    }).compile();

    service = module.get<JwtServiceImpl>(JwtServiceImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
