import { Test, TestingModule } from '@nestjs/testing';
import { UserConnectionLogService } from './user-connection-log.service';

describe('UserConnectionLogService', () => {
  let service: UserConnectionLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserConnectionLogService],
    }).compile();

    service = module.get<UserConnectionLogService>(UserConnectionLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
