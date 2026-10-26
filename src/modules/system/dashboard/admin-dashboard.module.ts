import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysOrganization } from '../../../database/models/system/sys_organization.model';
import { SysUser } from '../../../database/models/system/sys_user.model';
import { SysRole } from '../../../database/models/system/sys_role.model';
import { SysPlan } from '../../../database/models/system/sys_plan.model';
import { SysModules } from '../../../database/models/system/sys_module.model';
import { SysOrgEntitlement } from '../../../database/models/system/sys_org_entitlement.model';
import { SysTenantSite } from '../../../database/models/cms/sys_tenant_site.model';
import { AdminDashboardService } from './admin-dashboard.service';
import { AdminDashboardController } from './admin-dashboard.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SysOrganization,
      SysUser,
      SysRole,
      SysPlan,
      SysModules,
      SysOrgEntitlement,
      SysTenantSite,
    ]),
  ],
  controllers: [AdminDashboardController],
  providers: [AdminDashboardService],
  exports: [AdminDashboardService],
})
export class AdminDashboardModule {}
