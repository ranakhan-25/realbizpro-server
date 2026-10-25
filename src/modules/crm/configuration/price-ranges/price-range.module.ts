import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LeadPriceRange } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { PriceRangeController } from './price-range.controller';
import { PriceRangeService } from './price-range.service';

@Module({
  imports: [SequelizeModule.forFeature([LeadPriceRange])],
  controllers: [PriceRangeController],
  providers: [PriceRangeService],
  exports: [PriceRangeService],
})
export class PriceRangeModule {}
