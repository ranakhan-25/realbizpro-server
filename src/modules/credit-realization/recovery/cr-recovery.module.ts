import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CrRecoveryLog } from '../../../database/models/credit-realization/cr_recovery_log.model';
import { CrSaleAgreement } from '../../../database/models/credit-realization/cr_sale_agreement.model';
import { CrRecoveryService } from './cr-recovery.service';
import { CrRecoveryController } from './cr-recovery.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      CrRecoveryLog,
      CrSaleAgreement,
    ]),
  ],
  controllers: [CrRecoveryController],
  providers: [CrRecoveryService],
  exports: [CrRecoveryService],
})
export class CrRecoveryModule {}
