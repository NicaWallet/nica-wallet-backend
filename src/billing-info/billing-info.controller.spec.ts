import { Test, TestingModule } from '@nestjs/testing';
import { BillingInfoController } from './billing-info.controller';

describe('BillingInfoController', () => {
  let controller: BillingInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingInfoController],
    }).compile();

    controller = module.get<BillingInfoController>(BillingInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
