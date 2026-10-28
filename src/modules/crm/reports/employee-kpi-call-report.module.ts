import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CrmEmployeeKpi } from 'src/database/models/crm/kpi/crm-employee-kpi.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { LeadTeam } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { LeadTeamMember } from 'src/database/models/crm/lead/crm-lead-team-member.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { EmployeeKpiCallReportController } from './employee-kpi-call-report.controller';
import { EmployeeKpiCallReportService } from './employee-kpi-call-report.service';

@Module({
  imports: [SequelizeModule.forFeature([CrmEmployeeKpi, LeadActivity, LeadTeam, LeadTeamMember, SysUser])],
  controllers: [EmployeeKpiCallReportController],
  providers: [EmployeeKpiCallReportService],
})
export class EmployeeKpiCallReportModule {}
