/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ContraVoucherItem } from 'src/database/models/accounts/vouchers/acc_contra-voucher-item.model';
import { ContraVoucher } from 'src/database/models/accounts/vouchers/acc_contra-voucher.model';
import { ContraVoucherController } from './contra_vouchers.controller';
import { ContraVoucherService } from './contra_vouchers.service';

@Module({
  imports: [
    SequelizeModule.forFeature([ContraVoucher, ContraVoucherItem]),
  ],
  controllers: [ContraVoucherController],
  providers: [ContraVoucherService],
  exports: [ContraVoucherService],
})
export class ContraVoucherModule {}