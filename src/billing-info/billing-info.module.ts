import { Module } from '@nestjs/common';
import { BillingInfoService } from './billing-info.service';
import { BillingInfoController } from './billing-info.controller';

@Module({
  providers: [BillingInfoService],
  controllers: [BillingInfoController]
})
export class BillingInfoModule {}
