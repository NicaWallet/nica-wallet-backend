import { Module } from '@nestjs/common';
import { RecurringTransactionsService } from './recurring-transactions.service';
import { RecurringTransactionsController } from './recurring-transactions.controller';

@Module({
  providers: [RecurringTransactionsService],
  controllers: [RecurringTransactionsController]
})
export class RecurringTransactionsModule {}
