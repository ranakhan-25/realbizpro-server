import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysCustomPermission } from '../../../database/models/system/sys_custom_permission.model';
import { SysUserCustomPermission } from '../../../database/models/system/sys_user_custom_permission.model';
import { SysUser } from '../../../database/models/system/sys_user.model';
import { CustomPermissionsController } from './custom-permissions.controller';
import { CustomPermissionsService } from './custom-permissions.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SysCustomPermission,
      SysUserCustomPermission,
      SysUser,
    ]),
  ],
  controllers: [CustomPermissionsController],
  providers: [CustomPermissionsService],
  exports: [CustomPermissionsService],
})
export class CustomPermissionsModule {}
