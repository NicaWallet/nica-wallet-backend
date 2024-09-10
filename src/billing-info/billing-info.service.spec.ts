import { Test, TestingModule } from '@nestjs/testing';
import { BillingInfoService } from './billing-info.service';

describe('BillingInfoService', () => {
  let service: BillingInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillingInfoService],
    }).compile();

    service = module.get<BillingInfoService>(BillingInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
