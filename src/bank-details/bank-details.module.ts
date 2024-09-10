import { Module } from '@nestjs/common';
import { BankDetailsService } from './bank-details.service';
import { BankDetailsController } from './bank-details.controller';

@Module({
  providers: [BankDetailsService],
  controllers: [BankDetailsController]
})
export class BankDetailsModule {}
