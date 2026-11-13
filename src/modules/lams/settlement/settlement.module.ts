import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LamsSettlement } from '../../../database/models/lams/settlement.model';
import { LamsSettlementPayment } from '../../../database/models/lams/settlement-payment.model';
import { SettlementController } from './settlement.controller';
import { SettlementService } from './settlement.service';

@Module({
  imports: [SequelizeModule.forFeature([LamsSettlement, LamsSettlementPayment])],
  controllers: [SettlementController],
  providers: [SettlementService],
  exports: [SettlementService],
})
export class SettlementModule {}
