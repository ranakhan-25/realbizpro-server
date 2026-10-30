import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommunicationStatus } from 'src/database/models/crm/configuration/crm-communication-status.model';
import { LeadStage } from 'src/database/models/crm/configuration/crm-lead-stage.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { LeadAttachment } from 'src/database/models/crm/lead/crm-lead-attachment.model';
import { LeadCallAssignment } from 'src/database/models/crm/lead/crm-lead-call-assignment.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { CrmOffer } from 'src/database/models/crm/configuration/crm-offer.model';
// import { LeadPropertyInterest } from 'src/database/models/crm/lead/crm-lead-property-interest.model';
import { LeadRequirement } from 'src/database/models/crm/lead/crm-lead-requirement.model';
import { LeadTeamMember } from 'src/database/models/crm/lead/crm-lead-team-member.model';
import { LeadTransferLog } from 'src/database/models/crm/lead/crm-lead-transfer-log.model';
import {
  LeadArea,
  LeadCampaign,
  LeadCategory,
  LeadPriceRange,
  LeadProfession,
  LeadRequirementType,
  LeadSource,
  LeadTeam,
  LeadVisitPlace,
  LeadVisitStatus,
} from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { LeadPropertyInterest } from 'src/database/models/crm/lead/crm-lead-property-interest.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Lead,
      CrmOffer,
      LeadStage,
      CommunicationStatus,
      LeadCategory,
      LeadSource,
      LeadCampaign,
      LeadProfession,
      LeadArea,
      LeadPriceRange,
      LeadTeam,
      LeadTeamMember,
      LeadVisitPlace,
      LeadVisitStatus,
      LeadRequirementType,
      LeadActivity,
      LeadAttachment,
      LeadPropertyInterest,
      LeadRequirement,
      LeadCallAssignment,
      LeadTransferLog,
      SysUser,
      Project,
    ]),
  ],
  controllers: [LeadController],
  providers: [LeadService],
  exports: [LeadService],
})
export class LeadModule {}
