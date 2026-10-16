import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CrmLead } from '../../../database/models/crm/crm_lead.model';
import { CrmLeadStage } from '../../../database/models/crm/crm_lead_stage.model';
import { CrmLeadSource } from '../../../database/models/crm/crm_lead_source.model';
import { CrmLeadActivity } from '../../../database/models/crm/crm_lead_activity.model';
import { CrmDealNegotiation } from '../../../database/models/crm/crm_deal_negotiation.model';
import { CrmReportsService } from './crm-reports.service';
import { CrmReportsController } from './crm-reports.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      CrmLead,
      CrmLeadStage,
      CrmLeadSource,
      CrmLeadActivity,
      CrmDealNegotiation,
    ]),
  ],
  controllers: [CrmReportsController],
  providers: [CrmReportsService],
  exports: [CrmReportsService],
})
export class CrmReportsModule {}
