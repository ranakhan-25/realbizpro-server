import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadCampaign, LeadSource } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { LeadSourceController } from './lead-source.controller';
import { LeadSourceService } from './lead-source.service';

@Module({
  imports: [SequelizeModule.forFeature([LeadSource, Lead, LeadCampaign])],
  controllers: [LeadSourceController],
  providers: [LeadSourceService],
  exports: [LeadSourceService],
})
export class LeadSourceModule {}
