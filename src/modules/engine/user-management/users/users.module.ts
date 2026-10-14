import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysFeatures } from '../../../../database/models/system/sys_features.model';
import { SysMenu } from '../../../../database/models/system/sys_menu.model';
import { SysMenuPermission } from '../../../../database/models/system/sys_menu_permission.model';
import { SysModules } from '../../../../database/models/system/sys_module.model';
import { SysModuleToUser } from '../../../../database/models/system/sys_module_to_user.model';
import { SysPermission } from '../../../../database/models/system/sys_permission.model';
import { SysRole } from '../../../../database/models/system/sys_role.model';
import { SysRolePermission } from '../../../../database/models/system/sys_role_permission.model';
import { SysUser } from '../../../../database/models/system/sys_user.model';
import { SysUserPermission } from '../../../../database/models/system/sys_user_permission.model';
import { SysUserRole } from '../../../../database/models/system/sys_user_role.model';
import { UsersService } from './users.service';
import { SysUserSection } from '@/database/models/system/sys_user_section.model';

@Global()
@Module({
  imports: [
    SequelizeModule.forFeature([
      SysUser,
      SysUserRole,
      SysRole,
      SysPermission,
      SysRolePermission,
      SysModules,
      SysMenuPermission,
      SysMenu,
      SysModuleToUser,
      SysFeatures,
      SysUserPermission,
      SysUserSection,
    ]),
  ],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
