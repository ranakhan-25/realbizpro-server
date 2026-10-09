import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { QuotationService } from './quotation.service';
import { QuotationController } from './quotation.controller';
import { Quotation } from 'src/database/models/projects/quatation/pr_quotation.model';

@Module({
  imports: [SequelizeModule.forFeature([Quotation])],
  controllers: [QuotationController],
  providers: [QuotationService],
  exports: [QuotationService],
})
export class QuotationModule {}