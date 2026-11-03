/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JournalVoucherController } from './journal_vouchers.controller';
import { JournalVoucherService } from './journal_vouchers.service';
import { JournalVoucherItem } from 'src/database/models/accounts/vouchers/acc_journal-voucher-item.model';
import { JournalVoucher } from 'src/database/models/accounts/vouchers/acc_journal-voucher.model';


@Module({
  imports: [
    SequelizeModule.forFeature([JournalVoucher, JournalVoucherItem]),
  ],
  controllers: [JournalVoucherController],
  providers: [JournalVoucherService],
  exports: [JournalVoucherService],
})
export class JournalVoucherModule {}