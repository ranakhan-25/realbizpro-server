import { Module } from '@nestjs/common';
import { CrmMasterModule } from './master-data/crm-master.module';
import { CrmLeadsModule } from './leads/crm-leads.module';
import { CrmNegotiationsModule } from './negotiations/crm-negotiations.module';
import { CrmTasksModule } from './tasks/crm-tasks.module';
import { CrmReportsModule } from './reports/crm-reports.module';

@Module({
  imports: [
    CrmMasterModule,
    CrmLeadsModule,
    CrmNegotiationsModule,
    CrmTasksModule,
    CrmReportsModule,
  ],
  exports: [
    CrmMasterModule,
    CrmLeadsModule,
    CrmNegotiationsModule,
    CrmTasksModule,
    CrmReportsModule,
  ],
})
export class CrmModule {}
