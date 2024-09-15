import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AddressModule } from './address/address.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BankDetailsModule } from './bank-details/bank-details.module';
import { BillingInfoModule } from './billing-info/billing-info.module';
import { BudgetModule } from './budget/budget.module';
import { CategoryModule } from './category/category.module';
import { GoalModule } from './goal/goal.module';
import { HistoryModule } from './history/history.module';
import { IncomeModule } from './income/income.module';
import { LoggingModule } from './logging/logging.module';
import { MailModule } from './mail/mail.module';
import { NotificationModule } from './notification/notification.module';
import { PermissionModule } from './permission/permission.module';
import { PreferenceModule } from './preference/preference.module';
import { PrismaModule } from './prisma/prisma.module';
import { RecurringTransactionsModule } from './recurring-transactions/recurring-transactions.module';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { RoleModule } from './role/role.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserChangeHistoryModule } from './user-change-history/user-change-history.module';
import { UserConnectionLogModule } from './user-connection-log/user-connection-log.module';
import { UserRoleModule } from './user-role/user-role.module';
import { UserModule } from './user/user.module';


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
    AuthModule,
    MailModule,
    PreferenceModule,
    HistoryModule,
    LoggingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
