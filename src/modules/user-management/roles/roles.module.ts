import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { SysPermission } from '../../../database/models/system/sys_permission.model';
import { SysRolePermission } from '../../../database/models/system/sys_role_permission.model';
import { SysUserRole } from '../../../database/models/system/sys_user_role.model';
import { SysRole } from '../../../database/models/system/sys_role.model';
import { SysUserPermission } from 'src/database/models/system/sys_user_permission.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SysRole,
      SysUserRole,
      SysRolePermission,
      SysPermission,
      SysUserPermission,
    ]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
