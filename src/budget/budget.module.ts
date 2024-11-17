import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
  ],
  providers: [BudgetService],
  controllers: [BudgetController],
  exports : [BudgetService]
})
export class BudgetModule {}
