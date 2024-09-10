import { Module } from '@nestjs/common';
import { UserChangeHistoryService } from './user-change-history.service';
import { UserChangeHistoryController } from './user-change-history.controller';

@Module({
  providers: [UserChangeHistoryService],
  controllers: [UserChangeHistoryController]
})
export class UserChangeHistoryModule {}
