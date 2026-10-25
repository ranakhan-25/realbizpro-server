import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LeadCampaign, LeadSource } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';

@Module({
  imports: [SequelizeModule.forFeature([LeadCampaign, LeadSource])],
  controllers: [CampaignController],
  providers: [CampaignService],
  exports: [CampaignService],
})
export class CampaignModule {}
