import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommunicationStatus } from 'src/database/models/crm/configuration/crm-communication-status.model';
import { LeadStage } from 'src/database/models/crm/configuration/crm-lead-stage.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadPropertyInterest } from 'src/database/models/crm/lead/crm-lead-property-interest.model';
import { CrmLeadNegotiation } from 'src/database/models/crm/call-center/crm-lead-negotiation.model';
import { LeadRequirement } from 'src/database/models/crm/lead/crm-lead-requirement.model';
import { LeadRequirementType, LeadVisitPlace, LeadVisitStatus } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { FlatLand } from 'src/database/models/projects/flatland/pr_flatland.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { CallCenterFollowUpController } from './call-center-follow-up.controller';
import { CallCenterFollowUpService } from './call-center-follow-up.service';

@Module({
  imports: [SequelizeModule.forFeature([Lead, LeadActivity, LeadRequirement, LeadPropertyInterest, CrmLeadNegotiation, Project, FlatLand, SysUser, LeadStage, CommunicationStatus, LeadRequirementType, LeadVisitPlace, LeadVisitStatus])],
  controllers: [CallCenterFollowUpController],
  providers: [CallCenterFollowUpService],
})
export class CallCenterFollowUpModule {}
