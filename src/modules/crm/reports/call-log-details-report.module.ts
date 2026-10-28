import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { CallLogDetailsReportController } from './call-log-details-report.controller';
import { CallLogDetailsReportService } from './call-log-details-report.service';

@Module({
  imports: [SequelizeModule.forFeature([LeadActivity, Lead, SysUser])],
  controllers: [CallLogDetailsReportController],
  providers: [CallLogDetailsReportService],
})
export class CallLogDetailsReportModule {}
