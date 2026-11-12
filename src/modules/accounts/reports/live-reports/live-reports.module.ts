import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChartOfAccount } from 'src/database/models/accounts/configuration/acc_chats_of_accounts_model';
import { ChartOfGroup } from 'src/database/models/accounts/configuration/acc_chats_of_group_model';
import { ProjectBudget } from 'src/database/models/projects/project_budget/pr_project_budget_model';
import { ContraVoucher } from 'src/database/models/accounts/vouchers/acc_contra-voucher.model';
import { ContraVoucherItem } from 'src/database/models/accounts/vouchers/acc_contra-voucher-item.model';
import { Expense } from 'src/database/models/accounts/vouchers/acc_expence_list_model';
import { ExpenseItem } from 'src/database/models/accounts/vouchers/acc_expense-item.model';
import { JournalVoucher } from 'src/database/models/accounts/vouchers/acc_journal-voucher.model';
import { JournalVoucherItem } from 'src/database/models/accounts/vouchers/acc_journal-voucher-item.model';
import { PaymentVoucher } from 'src/database/models/accounts/vouchers/acc_payment-voucher.model';
import { PaymentVoucherEntry } from 'src/database/models/accounts/vouchers/acc_payment-voucher-entry.model';
import { Voucher } from 'src/database/models/accounts/vouchers/acc_voucher.model';
import { VoucherEntry } from 'src/database/models/accounts/vouchers/acc_voucher-entry.model';
import { LiveReportsController } from './live-reports.controller';
import { LiveReportsService } from './live-reports.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ChartOfAccount,
      ChartOfGroup,
      ProjectBudget,
      Voucher,
      VoucherEntry,
      PaymentVoucher,
      PaymentVoucherEntry,
      JournalVoucher,
      JournalVoucherItem,
      ContraVoucher,
      ContraVoucherItem,
      Expense,
      ExpenseItem,
    ]),
  ],
  controllers: [LiveReportsController],
  providers: [LiveReportsService],
})
export class LiveReportsModule {}
