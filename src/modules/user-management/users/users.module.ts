import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { SysMenu } from '../../../database/models/system/sys_menu.model';
import { SysMenuPermission } from '../../../database/models/system/sys_menu_permission.model';
import { SysModules } from '../../../database/models/system/sys_module.model';
import { SysModuleToUser } from '../../../database/models/system/sys_module_to_user.model';
import { SysPermission } from '../../../database/models/system/sys_permission.model';
import { SysRole } from '../../../database/models/system/sys_role.model';
import { SysRolePermission } from '../../../database/models/system/sys_role_permission.model';
import { SysUser } from '../../../database/models/system/sys_user.model';
import { SysUserPermission } from '../../../database/models/system/sys_user_permission.model';
import { SysUserRole } from '../../../database/models/system/sys_user_role.model';
import { SysUserSection } from '../../../database/models/system/sys_user_section.model';
import { SysCompany } from '../../../database/models/system/sys_company.model';
import { SysUserCompany } from '@/database/models/system/sys_user_company.model';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([
      SysUser,
      SysUserRole,
      SysUserSection,
      SysRole,
      SysPermission,
      SysRolePermission,
      SysModules,
      SysMenuPermission,
      SysMenu,
      SysModuleToUser,
      SysUserPermission,
      SysCompany,
      SysUserCompany,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
