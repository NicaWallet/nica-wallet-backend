import { Test, TestingModule } from '@nestjs/testing';
import { UserChangeHistoryService } from './user-change-history.service';

describe('UserChangeHistoryService', () => {
  let service: UserChangeHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserChangeHistoryService],
    }).compile();

    service = module.get<UserChangeHistoryService>(UserChangeHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
