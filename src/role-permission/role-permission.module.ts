import { Module } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';

@Module({
  providers: [RolePermissionService],
  controllers: [RolePermissionController]
})
export class RolePermissionModule {}
