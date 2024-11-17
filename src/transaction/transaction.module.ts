import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService]
})
export class TransactionModule {}
