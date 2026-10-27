import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommunicationStatus } from 'src/database/models/crm/configuration/crm-communication-status.model';
import { LeadStage } from 'src/database/models/crm/configuration/crm-lead-stage.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { LeadVisitStatus } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { FlatLandBooking } from 'src/database/models/projects/flat-land-booking/pr_flat_land_booking.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { UserActivityReportController } from './user-activity-report.controller';
import { UserActivityReportService } from './user-activity-report.service';

@Module({
  imports: [SequelizeModule.forFeature([Lead, LeadActivity, LeadStage, LeadVisitStatus, CommunicationStatus, FlatLandBooking, SysUser])],
  controllers: [UserActivityReportController],
  providers: [UserActivityReportService],
})
export class UserActivityReportModule {}
