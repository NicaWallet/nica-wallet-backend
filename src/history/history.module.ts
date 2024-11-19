import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule
  ],
  providers: [HistoryService],
  controllers: [HistoryController],
  exports: [HistoryService]
})
export class HistoryModule { }
