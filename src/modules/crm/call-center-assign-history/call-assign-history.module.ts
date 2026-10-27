import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommunicationStatus } from 'src/database/models/crm/configuration/crm-communication-status.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { LeadCallAssignment } from 'src/database/models/crm/lead/crm-lead-call-assignment.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { CallAssignHistoryController } from './call-assign-history.controller';
import { CallAssignHistoryService } from './call-assign-history.service';

@Module({
  imports: [SequelizeModule.forFeature([LeadCallAssignment, Lead, LeadActivity, SysUser, CommunicationStatus])],
  controllers: [CallAssignHistoryController],
  providers: [CallAssignHistoryService],
})
export class CallAssignHistoryModule {}
