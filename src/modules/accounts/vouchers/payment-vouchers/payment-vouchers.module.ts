import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaymentVouchersController } from './payment-vouchers.controller';
import { PaymentVouchersService } from './payment-vouchers.service';

import { PaymentVoucher } from 'src/database/models/accounts/vouchers/acc_payment-voucher.model';
import { PaymentVoucherEntry } from 'src/database/models/accounts/vouchers/acc_payment-voucher-entry.model';

@Module({
  imports: [
    SequelizeModule.forFeature([PaymentVoucher, PaymentVoucherEntry]),
  ],
  controllers: [PaymentVouchersController],
  providers: [PaymentVouchersService],
  exports: [PaymentVouchersService],
})
export class PaymentVouchersModule {}