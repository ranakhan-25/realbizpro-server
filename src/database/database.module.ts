import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysCompany } from './models/system/sys_company.model';
import { SysCountries } from './models/system/sys_countries.model';
import { SysDelegationStatus } from './models/deligation/sys_delegation_statuses.model';
import { SysUom } from './models/system/sys_uom.model';
import { SysUserPermission } from './models/system/sys_user_permission.model';
import { Project } from './models/projects/project/pr_project_model';
import { projectType } from './models/projects/project/pr_project_types_model';
import { Investor } from './models/projects/investor/investor_model';
import { InvestorNominee } from './models/projects/investor/investor_nominee_model';
import { ShareConfiguration } from './models/projects/investor/configuration_model';
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
      Project,
      projectType,
      // Site,
      Investor,
      InvestorNominee,
      ShareConfiguration,
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
