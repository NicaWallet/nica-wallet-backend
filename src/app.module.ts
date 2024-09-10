import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AddressModule } from './address/address.module';
import { BankDetailsModule } from './bank-details/bank-details.module';
import { BillingInfoModule } from './billing-info/billing-info.module';
import { BudgetModule } from './budget/budget.module';
import { CategoryModule } from './category/category.module';
import { GoalModule } from './goal/goal.module';
import { IncomeModule } from './income/income.module';
import { NotificationModule } from './notification/notification.module';
import { RecurringTransactionsModule } from './recurring-transactions/recurring-transactions.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { UserChangeHistoryModule } from './user-change-history/user-change-history.module';
import { UserConnectionLogModule } from './user-connection-log/user-connection-log.module';
import { UserRoleModule } from './user-role/user-role.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AddressModule,
    BankDetailsModule,
    BillingInfoModule,
    BudgetModule,
    CategoryModule,
    GoalModule,
    IncomeModule,
    NotificationModule,
    RecurringTransactionsModule,
    TransactionModule,
    UserModule,
    RoleModule,
    PermissionModule,
    RolePermissionModule,
    SubcategoryModule,
    UserChangeHistoryModule,
    UserConnectionLogModule,
    UserRoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
