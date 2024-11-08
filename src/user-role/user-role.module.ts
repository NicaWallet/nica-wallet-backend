import { Module } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { UserRoleController } from './user-role.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
  ],
  providers: [UserRoleService],
  controllers: [UserRoleController],
  exports: [UserRoleService],
})
export class UserRoleModule {}
