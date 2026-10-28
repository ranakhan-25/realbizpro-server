import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { CallLogReportController } from './call-log-report.controller';
import { CallLogReportService } from './call-log-report.service';

@Module({
  imports: [SequelizeModule.forFeature([LeadActivity, Lead, SysUser])],
  controllers: [CallLogReportController],
  providers: [CallLogReportService],
})
export class CallLogReportModule {}
