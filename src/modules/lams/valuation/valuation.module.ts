import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LamsValuation } from '../../../database/models/lams/valuation.model';
import { ValuationController } from './valuation.controller';
import { ValuationService } from './valuation.service';

@Module({
  imports: [SequelizeModule.forFeature([LamsValuation])],
  controllers: [ValuationController],
  providers: [ValuationService],
  exports: [ValuationService],
})
export class ValuationModule {}
