import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysOrganization } from '@/database/models/system/sys_organization.model';
import { SysPlan } from '@/database/models/system/sys_plan.model';
import { SysUser } from '@/database/models/system/sys_user.model';
import { SysRole } from '@/database/models/system/sys_role.model';
import { SysUserRole } from '@/database/models/system/sys_user_role.model';
import { SysModules } from '@/database/models/system/sys_module.model';
import { SysFeatures } from '@/database/models/system/sys_features.model';
import { SysOrgEntitlement } from '@/database/models/system/sys_org_entitlement.model';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SysOrganization,
      SysPlan,
      SysUser,
      SysRole,
      SysUserRole,
      SysModules,
      SysFeatures,
      SysOrgEntitlement,
    ]),
  ],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService, SequelizeModule],
})
export class OrganizationsModule {}
