import { Module } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { UserRoleController } from './user-role.controller';

@Module({
  providers: [UserRoleService],
  controllers: [UserRoleController]
})
export class UserRoleModule {}
