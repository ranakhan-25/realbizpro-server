import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { CallReportsController } from './call-reports.controller';
import { CallReportsService } from './call-reports.service';

@Module({
  imports: [SequelizeModule.forFeature([LeadActivity, Lead, SysUser])],
  controllers: [CallReportsController],
  providers: [CallReportsService],
})
export class CallReportsModule {}
