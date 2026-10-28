import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadSource } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { SourceWiseLeadReportController } from './source-wise-lead-report.controller';
import { SourceWiseLeadReportService } from './source-wise-lead-report.service';

@Module({
  imports: [SequelizeModule.forFeature([Lead, LeadSource, SysUser])],
  controllers: [SourceWiseLeadReportController],
  providers: [SourceWiseLeadReportService],
})
export class SourceWiseLeadReportModule {}
