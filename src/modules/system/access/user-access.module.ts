import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysModules } from '../../../database/models/system/sys_module.model';
import { SysOrgEntitlement } from '../../../database/models/system/sys_org_entitlement.model';
import { SysFeatures } from '../../../database/models/system/sys_features.model';
import { SysUserRole } from '../../../database/models/system/sys_user_role.model';
import { SysRole } from '../../../database/models/system/sys_role.model';
import { SysRoleFeature } from '../../../database/models/system/sys_role_feature.model';
import { SysRolePermission } from '../../../database/models/system/sys_role_permission.model';
import { SysPermission } from '../../../database/models/system/sys_permission.model';
import { SysUser } from '../../../database/models/system/sys_user.model';
import { SysOrganization } from '../../../database/models/system/sys_organization.model';
import { UserAccessService } from './user-access.service';
import { UserAccessController } from './user-access.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SysModules,
      SysOrgEntitlement,
      SysFeatures,
      SysUserRole,
      SysRole,
      SysRoleFeature,
      SysRolePermission,
      SysPermission,
      SysUser,
      SysOrganization,
    ]),
  ],
  controllers: [UserAccessController],
  providers: [UserAccessService],
  exports: [UserAccessService],
})
export class UserAccessModule {}
