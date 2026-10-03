import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysCompany } from './models/system/sys_company.model';
import { SysCountries } from './models/system/sys_countries.model';
import { SysDelegationStatus } from './models/deligation/sys_delegation_statuses.model';
import { SysUom } from './models/system/sys_uom.model';
import { SysUserPermission } from './models/system/sys_user_permission.model';
import { Project } from './models/projects/pr_project_model';
import { projectType } from './models/projects/pr_project_types_model';
import { Site } from './models/projects/pr_site.model';
import { SequelizeConfigService } from './sequelize-config.service';
import { DatabaseSyncService } from './sync.service';

@Global()
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SequelizeModule.forFeature([
      SysCountries,
      SysDelegationStatus,
      SysCompany,
      SysUom,
      SysUserPermission,
      Project,   // ← যোগ করো
      projectType, // ← যোগ করো
      Site,      // ← যোগ করো
    ]),
  ],
  providers: [
    SequelizeConfigService,
    DatabaseSyncService,
  ],
  exports: [
    SequelizeConfigService,
    SequelizeModule,
  ],
})
export class DatabaseModule {}