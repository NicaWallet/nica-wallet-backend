import { Test, TestingModule } from '@nestjs/testing';
import { UserConnectionLogController } from './user-connection-log.controller';

describe('UserConnectionLogController', () => {
  let controller: UserConnectionLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserConnectionLogController],
    }).compile();

    controller = module.get<UserConnectionLogController>(UserConnectionLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
