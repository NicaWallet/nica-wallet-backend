import { Test, TestingModule } from '@nestjs/testing';
import { UserChangeHistoryController } from './user-change-history.controller';

describe('UserChangeHistoryController', () => {
  let controller: UserChangeHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserChangeHistoryController],
    }).compile();

    controller = module.get<UserChangeHistoryController>(UserChangeHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
