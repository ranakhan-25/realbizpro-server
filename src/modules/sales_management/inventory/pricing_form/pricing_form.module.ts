/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PropertyPricing } from '../../../../database/models/sales_management/sm_pricing_form_model';
import { PropertyPricingService } from './pricing_form.service';
import { PropertyPricingController } from './pricing_form.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([PropertyPricing]),
  ],
  controllers: [PropertyPricingController],
  providers: [PropertyPricingService],
  exports: [PropertyPricingService],
})
export class PricingFormModule {}