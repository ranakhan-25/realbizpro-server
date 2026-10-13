import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CrInstallmentSetup } from '../../../database/models/credit-realization/cr_installment_setup.model';
import { CrSetupService } from './cr-setup.service';
import { CrSetupController } from './cr-setup.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      CrInstallmentSetup,
    ]),
  ],
  controllers: [CrSetupController],
  providers: [CrSetupService],
  exports: [CrSetupService],
})
export class CrSetupModule {}
