import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CrmEmployeeKpi } from 'src/database/models/crm/kpi/crm-employee-kpi.model';
import { LeadTeam } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { EmployeeKpiController } from './employee-kpi.controller';
import { EmployeeKpiService } from './employee-kpi.service';

@Module({
  imports: [SequelizeModule.forFeature([CrmEmployeeKpi, LeadTeam, SysUser])],
  controllers: [EmployeeKpiController],
  providers: [EmployeeKpiService],
  exports: [EmployeeKpiService],
})
export class EmployeeKpiModule {}
