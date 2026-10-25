import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CrmOffer } from 'src/database/models/crm/configuration/crm-offer.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';

@Module({
  imports: [SequelizeModule.forFeature([CrmOffer, Lead])],
  controllers: [OfferController],
  providers: [OfferService],
  exports: [OfferService],
})
export class OfferModule {}
