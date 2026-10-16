import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CrmDealNegotiation } from '../../../database/models/crm/crm_deal_negotiation.model';
import { CrmLead } from '../../../database/models/crm/crm_lead.model';
import { CrmNegotiationsService } from './crm-negotiations.service';
import { CrmNegotiationsController } from './crm-negotiations.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      CrmDealNegotiation,
      CrmLead,
    ]),
  ],
  controllers: [CrmNegotiationsController],
  providers: [CrmNegotiationsService],
  exports: [CrmNegotiationsService],
})
export class CrmNegotiationsModule {}
