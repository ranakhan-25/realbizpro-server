import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VouchersController } from './received-vouchers.controller';
import { VouchersService } from './received-vouchers.service';
import { Voucher } from 'src/database/models/accounts/vouchers/acc_voucher.model';
import { VoucherEntry } from 'src/database/models/accounts/vouchers/acc_voucher-entry.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Voucher, VoucherEntry]),
  ],
  controllers: [VouchersController],
  providers: [VouchersService],
  exports: [VouchersService],
})
export class ReceivedVouchersModule {}