import { Module } from '@nestjs/common';
import { UserConnectionLogService } from './user-connection-log.service';
import { UserConnectionLogController } from './user-connection-log.controller';

@Module({
  providers: [UserConnectionLogService],
  controllers: [UserConnectionLogController]
})
export class UserConnectionLogModule {}
