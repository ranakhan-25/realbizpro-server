import { Module } from '@nestjs/common';
import { EmployeeKpiModule } from 'src/modules/crm/kpi/employee-kpi/employee-kpi.module';
import { EmployeeKpiCallReportModule } from 'src/modules/crm/reports/employee-kpi-call-report.module';
import { TeamKpiReportModule } from 'src/modules/crm/reports/team-kpi-report.module';
import { HrmKpiController } from './hrm-kpi.controller';

@Module({
  imports: [EmployeeKpiModule, EmployeeKpiCallReportModule, TeamKpiReportModule],
  controllers: [HrmKpiController],
})
export class HrmKpiModule {}
