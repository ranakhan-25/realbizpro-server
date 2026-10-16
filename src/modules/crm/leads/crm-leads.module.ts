import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CrmLead } from '../../../database/models/crm/crm_lead.model';
import { CrmLeadCategory } from '../../../database/models/crm/crm_lead_category.model';
import { CrmLeadStage } from '../../../database/models/crm/crm_lead_stage.model';
import { CrmLeadSource } from '../../../database/models/crm/crm_lead_source.model';
import { CrmCampaign } from '../../../database/models/crm/crm_campaign.model';
import { CrmProfession } from '../../../database/models/crm/crm_profession.model';
import { CrmLeadRequirement } from '../../../database/models/crm/crm_lead_requirement.model';
import { CrmLeadPropertyInterest } from '../../../database/models/crm/crm_lead_property_interest.model';
import { CrmLeadActivity } from '../../../database/models/crm/crm_lead_activity.model';
import { CrmLeadAttachment } from '../../../database/models/crm/crm_lead_attachment.model';
import { CrmLeadCallAssign } from '../../../database/models/crm/crm_lead_call_assign.model';
import { CrmLeadTransferLog } from '../../../database/models/crm/crm_lead_transfer_log.model';
import { CrmDealNegotiation } from '../../../database/models/crm/crm_deal_negotiation.model';
import { CrmLeadsService } from './crm-leads.service';
import { CrmLeadsController } from './crm-leads.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      CrmLead,
      CrmLeadCategory,
      CrmLeadStage,
      CrmLeadSource,
      CrmCampaign,
      CrmProfession,
      CrmLeadRequirement,
      CrmLeadPropertyInterest,
      CrmLeadActivity,
      CrmLeadAttachment,
      CrmLeadCallAssign,
      CrmLeadTransferLog,
      CrmDealNegotiation,
    ]),
  ],
  controllers: [CrmLeadsController],
  providers: [CrmLeadsService],
  exports: [CrmLeadsService],
})
export class CrmLeadsModule {}
