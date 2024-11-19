import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AddressModule } from './address/address.module';
import { AuthModule } from './auth/auth.module';
import { BudgetModule } from './budget/budget.module';
import { CategoryModule } from './category/category.module';
import { HistoryModule } from './history/history.module';
import { IncomeModule } from './income/income.module';
import { MailModule } from './mail/mail.module';
import { NotificationModule } from './notification/notification.module';
import { PermissionModule } from './permission/permission.module';
import { PrismaModule } from './prisma/prisma.module';
import { RoleModule } from './role/role.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserConnectionLogModule } from './user-connection-log/user-connection-log.module';
import { UserRoleModule } from './user-role/user-role.module';
import { UserModule } from './user/user.module';
import { ActivityMiddleware } from './auth/activity.middleware';
import { ClassificationModule } from './classification/classification.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    AddressModule,
    BudgetModule,
    CategoryModule,
    IncomeModule,
    NotificationModule,
    TransactionModule,
    UserModule,
    RoleModule,
    PermissionModule,
    SubcategoryModule,
    UserConnectionLogModule,
    UserRoleModule,
    AuthModule,
    MailModule,
    HistoryModule,
    ClassificationModule,
  ],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ActivityMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/forgot-password', method: RequestMethod.POST },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}