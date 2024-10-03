import { Module } from '@nestjs/common';
import { UserConnectionLogService } from './user-connection-log.service';
import { UserConnectionLogController } from './user-connection-log.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
  ],
  providers: [UserConnectionLogService],
  controllers: [UserConnectionLogController]
})
export class UserConnectionLogModule { }
