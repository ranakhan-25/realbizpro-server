import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { QuotationService } from './quotation.service';
import { QuotationController } from './quotation.controller';
import { Quotation } from 'src/database/models/projects/quatation/pr_quotation.model';
import { BillingCategory } from 'src/database/models/projects/billing/pr_category.model';
import { BillingSubCategory } from 'src/database/models/projects/billing/pr_sub_category.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Quotation,
      BillingCategory,
      BillingSubCategory,
    ]),
  ],
  controllers: [QuotationController],
  providers: [QuotationService],
  exports: [QuotationService],
})
export class QuotationModule {}