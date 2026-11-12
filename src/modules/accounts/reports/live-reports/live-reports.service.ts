import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
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

type Plain = Record<string, unknown>;
type Line = {
  accountId: string;
  account: string;
  debit: number;
  credit: number;
  date: string;
  voucher: string;
  type: string;
  description: string;
  project: string;
};
const reportTitles: Record<string, string> = {
  balance_sheet_summary: 'Balance Sheet Summary',
  'budget-vs-actual-expenses-vs-collection-report':
    'Budget vs Actual Expenses vs Collection',
  'cash-bank-books': 'Cash & Bank Books',
  'cash-flow-statement': 'Cash Flow Statement',
  'day-book': 'Day Book',
  'expense-report': 'Expense Report',
  'fund-flow-summary': 'Fund Flow Summary',
  'general-ledger': 'General Ledger',
  income_statement: 'Income Statement',
  'payable-report': 'Payable Report',
  'profit-loss-comprehensive-income':
    'Profit & Loss / Comprehensive Income',
  'property-plant-equipment':
    'Property, Plant & Equipment',
  'receipt-report': 'Receipt Report',
  'receivable-report': 'Receivable Report',
  'receive-and-payment-summary':
    'Receive & Payment Summary',
  'receive-payment-statement':
    'Receive Payment Statement',
  'statement-of-changes-equity':
    'Statement of Changes in Equity',
  'statement-of-financial-position':
    'Statement of Financial Position',
  trial_balance_summary: 'Trial Balance Summary',
};
const num = (value: unknown) =>
  Number(value ?? 0) || 0;
const str = (value: unknown) =>
  String(value ?? '');
const plain = (row: { toJSON: () => unknown }) =>
  row.toJSON() as Plain;
const monthKey = (value: string) =>
  value ? value.slice(0, 7) : 'Undated';

@Injectable()
export class LiveReportsService {
  constructor(
    @InjectModel(Voucher)
    private readonly receiptModel: typeof Voucher,
    @InjectModel(VoucherEntry)
    private readonly receiptEntryModel: typeof VoucherEntry,
    @InjectModel(PaymentVoucher)
    private readonly paymentModel: typeof PaymentVoucher,
    @InjectModel(PaymentVoucherEntry)
    private readonly paymentEntryModel: typeof PaymentVoucherEntry,
    @InjectModel(JournalVoucher)
    private readonly journalModel: typeof JournalVoucher,
    @InjectModel(JournalVoucherItem)
    private readonly journalItemModel: typeof JournalVoucherItem,
    @InjectModel(ContraVoucher)
    private readonly contraModel: typeof ContraVoucher,
    @InjectModel(ContraVoucherItem)
    private readonly contraItemModel: typeof ContraVoucherItem,
    @InjectModel(Expense)
    private readonly expenseModel: typeof Expense,
    @InjectModel(ExpenseItem)
    private readonly expenseItemModel: typeof ExpenseItem,
    @InjectModel(ChartOfAccount)
    private readonly accountModel: typeof ChartOfAccount,
    @InjectModel(ChartOfGroup)
    private readonly groupModel: typeof ChartOfGroup,
    @InjectModel(ProjectBudget)
    private readonly projectBudgetModel: typeof ProjectBudget,
  ) {}

  async generate(
    reportKey: string,
    query: Record<string, string | undefined>,
    user: Plain,
  ) {
    const title = reportTitles[reportKey];
    if (!title)
      throw new BadRequestException(
        `Unknown Accounts report: ${reportKey}`,
      );
    const orgId = user.orgId;
    if (!orgId && !user.isSuperUser)
      throw new ForbiddenException(
        'An organization is required to view Accounts reports.',
      );
    for (const date of [
      query.fromDate,
      query.toDate,
    ]) {
      if (date && Number.isNaN(Date.parse(date)))
        throw new BadRequestException(
          'Report dates must be valid ISO dates.',
        );
    }
    if (query.search && query.search.length > 200)
      throw new BadRequestException(
        'Search text must be 200 characters or fewer.',
      );
    const projectId =
      query.projectId ?? user.projectId;
    const where: Record<PropertyKey, unknown> =
      {};
    if (orgId) where.orgId = orgId;
    if (projectId) where.projectId = projectId;
    if (query.fromDate || query.toDate) {
      const date: Record<PropertyKey, unknown> =
        {};
      if (query.fromDate)
        date[Op.gte] = new Date(query.fromDate);
      if (query.toDate)
        date[Op.lte] = new Date(query.toDate);
      where.date = date;
    }
    const [
      receipts,
      payments,
      journals,
      contras,
      expenses,
      accounts,
      groups,
      projectBudgets,
    ] = await Promise.all([
      this.receiptModel.findAll({
        where,
        order: [['date', 'ASC']],
      }),
      this.paymentModel.findAll({
        where,
        order: [['date', 'ASC']],
      }),
      this.journalModel.findAll({
        where,
        order: [['date', 'ASC']],
      }),
      this.contraModel.findAll({
        where,
        order: [['date', 'ASC']],
      }),
      this.expenseModel.findAll({
        where,
        order: [['date', 'ASC']],
      }),
      this.accountModel.findAll({
        where: orgId ? ({ orgId } as never) : {},
        order: [['code', 'ASC']],
      }),
      this.groupModel.findAll({
        where: orgId ? ({ orgId } as never) : {},
      }),
      this.projectBudgetModel.findAll({
        where: orgId
          ? ({
              orgId,
              ...(projectId ? { projectId } : {}),
            } as never)
          : {},
        order: [['createdAt', 'ASC']],
      }),
    ]);
    const [
      receiptEntries,
      paymentEntries,
      journalItems,
      contraItems,
      expenseItems,
    ] = await Promise.all([
      this.receiptEntryModel.findAll({
        where: {
          voucherId: {
            [Op.in]: receipts.map(
              (row) => row.uuid,
            ),
          },
        },
      }),
      this.paymentEntryModel.findAll({
        where: {
          paymentVoucherId: {
            [Op.in]: payments.map(
              (row) => row.uuid,
            ),
          },
        },
      }),
      this.journalItemModel.findAll({
        where: {
          journalVoucherUuid: {
            [Op.in]: journals.map(
              (row) => row.uuid,
            ),
          },
        },
      }),
      this.contraItemModel.findAll({
        where: {
          contraVoucherUuid: {
            [Op.in]: contras.map(
              (row) => row.uuid,
            ),
          },
        },
      }),
      this.expenseItemModel.findAll({
        where: {
          expenseUuid: {
            [Op.in]: expenses.map(
              (row) => row.uuid,
            ),
          },
        },
      }),
    ]);
    const accountNames = new Map(
      accounts.map((row) => {
        const item = plain(row);
        return [str(item.uuid), str(item.name)];
      }),
    );
    const receiptMap = new Map(
      receipts.map((row) => {
        const item = plain(row);
        return [str(item.uuid), item];
      }),
    );
    const paymentMap = new Map(
      payments.map((row) => {
        const item = plain(row);
        return [str(item.uuid), item];
      }),
    );
    const journalMap = new Map(
      journals.map((row) => {
        const item = plain(row);
        return [str(item.uuid), item];
      }),
    );
    const contraMap = new Map(
      contras.map((row) => {
        const item = plain(row);
        return [str(item.uuid), item];
      }),
    );
    const expenseMap = new Map(
      expenses.map((row) => {
        const item = plain(row);
        return [str(item.uuid), item];
      }),
    );
    const lines: Line[] = [];
    const pushLine = (
      entry: Plain,
      head: Plain,
      type: string,
      accountId: unknown,
      debit: unknown,
      credit: unknown,
      description?: unknown,
    ) => {
      const id = str(accountId);
      lines.push({
        accountId: id,
        account:
          accountNames.get(id) ||
          str(entry.accountName) ||
          str(entry.account) ||
          id ||
          'Unassigned',
        debit: num(debit),
        credit: num(credit),
        date: str(head.date),
        voucher: str(head.voucherNo),
        type,
        description: str(
          description ??
            entry.note ??
            entry.comment ??
            head.comment,
        ),
        project: str(head.project),
      });
    };
    receiptEntries.forEach((model) => {
      const e = plain(model);
      const h = receiptMap.get(str(e.voucherId));
      if (h)
        pushLine(
          e,
          h,
          str(h.voucherType || 'Receipt'),
          e.accountName || e.accountId,
          e.debit,
          e.credit,
          e.comment,
        );
    });
    paymentEntries.forEach((model) => {
      const e = plain(model);
      const h = paymentMap.get(
        str(e.paymentVoucherId),
      );
      if (h) {
        const amount = num(e.total);
        pushLine(
          e,
          h,
          'Payment',
          e.debitAccount,
          amount,
          0,
          e.comment || h.comment,
        );
        if (e.creditAccount)
          pushLine(
            e,
            h,
            'Payment',
            e.creditAccount,
            0,
            amount,
            e.comment || h.comment,
          );
      }
    });
    journalItems.forEach((model) => {
      const e = plain(model);
      const h = journalMap.get(
        str(e.journalVoucherUuid),
      );
      if (h)
        pushLine(
          e,
          h,
          'Journal',
          e.accountId,
          e.debit,
          e.credit,
          e.note,
        );
    });
    contraItems.forEach((model) => {
      const e = plain(model);
      const h = contraMap.get(
        str(e.contraVoucherUuid),
      );
      if (h)
        pushLine(
          e,
          h,
          'Contra',
          e.accountId,
          e.debit,
          e.credit,
          e.note,
        );
    });
    expenseItems.forEach((model) => {
      const e = plain(model);
      const h = expenseMap.get(
        str(e.expenseUuid),
      );
      if (h)
        pushLine(
          e,
          h,
          'Expense',
          e.accountId,
          e.amount,
          0,
          e.note || h.comment,
        );
    });
    expenses.forEach((model) => {
      const h = plain(model);
      if (
        !expenseItems.some(
          (item) =>
            str(plain(item).expenseUuid) ===
            str(h.uuid),
        )
      )
        pushLine(
          {},
          h,
          'Expense',
          h.cashOrBank,
          h.totalAmount,
          0,
          h.comment,
        );
    });
    receipts.forEach((model) => {
      const h = plain(model);
      if (
        !receiptEntries.some(
          (item) =>
            str(plain(item).voucherId) ===
            str(h.uuid),
        )
      )
        pushLine(
          {},
          h,
          str(h.voucherType || 'Receipt'),
          h.accountId,
          h.amount,
          0,
          h.comment,
        );
    });
    payments.forEach((model) => {
      const h = plain(model);
      if (
        !paymentEntries.some(
          (item) =>
            str(plain(item).paymentVoucherId) ===
            str(h.uuid),
        )
      )
        pushLine(
          {},
          h,
          'Payment',
          h.accountId,
          0,
          h.amount,
          h.comment,
        );
    });
    const filteredLines = query.search
      ? lines.filter((row) =>
          `${row.account} ${row.voucher} ${row.description} ${row.project}`
            .toLowerCase()
            .includes(query.search.toLowerCase()),
        )
      : lines;
    const transactionRows: Plain[] = [
      ...receipts.map((model) => {
        const row = plain(model);
        return {
          date: row.date,
          voucher: row.voucherNo,
          type: row.voucherType || 'Receipt',
          account:
            accountNames.get(
              str(row.accountId),
            ) || row.accountId,
          description: row.comment,
          amount: num(row.amount),
          status: row.status,
          project: row.projectId,
        };
      }),
      ...payments.map((model) => {
        const row = plain(model);
        return {
          date: row.date,
          voucher: row.voucherNo,
          type: 'Payment',
          account:
            accountNames.get(
              str(row.accountId),
            ) || row.accountId,
          description: row.comment,
          amount: num(row.amount),
          status: row.status,
          project: row.projectId,
        };
      }),
      ...expenses.map((model) => {
        const row = plain(model);
        return {
          date: row.date,
          voucher: row.voucherNo,
          type: 'Expense',
          account: row.cashOrBank,
          description: row.comment,
          amount: num(row.totalAmount),
          status: row.status,
          project: row.project,
        };
      }),
      ...journals.map((model) => {
        const row = plain(model);
        return {
          date: row.date,
          voucher: row.voucherNo,
          type: 'Journal',
          account: '',
          description: row.comment,
          amount: num(row.totalDebit),
          debit: num(row.totalDebit),
          credit: num(row.totalCredit),
          project: row.project,
        };
      }),
      ...contras.map((model) => {
        const row = plain(model);
        return {
          date: row.date,
          voucher: row.voucherNo,
          type: 'Contra',
          account: '',
          description: row.comment,
          amount: num(row.totalDebit),
          debit: num(row.totalDebit),
          credit: num(row.totalCredit),
          project: row.project,
        };
      }),
    ].filter(
      (row) =>
        !query.search ||
        `${row.account} ${row.voucher} ${row.description} ${row.project} ${row.type}`
          .toLowerCase()
          .includes(query.search.toLowerCase()),
    );
    const byAccount = new Map<
      string,
      {
        accountId: string;
        account: string;
        openingBalance: number;
        debit: number;
        credit: number;
        balance: number;
        section: string;
        group: string;
      }
    >();
    const groupMap = new Map(
      groups.map((row) => {
        const item = plain(row);
        return [str(item.uuid), item];
      }),
    );
    accounts.forEach((model) => {
      const a = plain(model);
      const group =
        groupMap.get(str(a.chartOfGroupUuid)) ||
        {};
      const section = str(
        group.reportSection ||
          group.chartOfSection ||
          group.name ||
          a.under,
      );
      const groupName = str(
        group.name || a.under,
      );
      const creditNature =
        /liabilit|equity|capital|income|revenue|payable|creditor/i.test(
          `${section} ${groupName} ${a.name}`,
        );
      const opening = num(a.openingBalance);
      byAccount.set(str(a.uuid), {
        accountId: str(a.uuid),
        account: str(a.name),
        openingBalance: creditNature
          ? -opening
          : opening,
        debit: 0,
        credit: 0,
        balance: creditNature
          ? -opening
          : opening,
        section,
        group: groupName,
      });
    });
    filteredLines.forEach((line) => {
      const key = line.accountId || line.account;
      const row = byAccount.get(key) || {
        accountId: key,
        account: line.account,
        openingBalance: 0,
        debit: 0,
        credit: 0,
        balance: 0,
        section: '',
        group: '',
      };
      row.debit += line.debit;
      row.credit += line.credit;
      row.balance += line.debit - line.credit;
      byAccount.set(key, row);
    });
    const ledgerRows = [
      ...byAccount.values(),
    ].map((row) => ({
      ...row,
      closingDebit: Math.max(0, row.balance),
      closingCredit: Math.max(0, -row.balance),
    }));
    const searchedLedgerRows = query.search
      ? ledgerRows.filter((row) =>
          `${row.account} ${row.section} ${row.group}`
            .toLowerCase()
            .includes(query.search.toLowerCase()),
        )
      : ledgerRows;
    const lowerKey = reportKey.toLowerCase();
    let rows: Plain[];
    if (lowerKey.includes('trial_balance'))
      rows = searchedLedgerRows;
    else if (
      lowerKey.includes('general-ledger')
    ) {
      const running = new Map<string, number>();
      rows = [...filteredLines]
        .sort((a, b) =>
          a.date.localeCompare(b.date),
        )
        .map((row) => {
          const balance =
            (running.get(row.accountId) || 0) +
            row.debit -
            row.credit;
          running.set(row.accountId, balance);
          return {
            ...row,
            runningBalance: balance,
          };
        });
    } else if (
      lowerKey.includes('balance_sheet') ||
      lowerKey.includes('financial-position') ||
      lowerKey.includes(
        'statement-of-changes-equity',
      ) ||
      lowerKey.includes(
        'property-plant-equipment',
      ) ||
      lowerKey.includes('receivable-report') ||
      lowerKey.includes('income_statement') ||
      lowerKey.includes('profit-loss')
    ) {
      const section = lowerKey.includes(
        'property',
      )
        ? /fixed asset|property|plant|equipment/i
        : lowerKey.includes('receivable')
          ? /receivable|debtor/i
          : lowerKey.includes('income') ||
              lowerKey.includes('profit-loss')
            ? /income|revenue|expense/i
            : lowerKey.includes('equity')
              ? /equity|capital/i
              : /asset|liabilit|equity|capital/i;
      rows = searchedLedgerRows.filter((row) =>
        section.test(
          `${row.section} ${row.group} ${row.account}`,
        ),
      );
    } else if (
      lowerKey.includes('payable-report')
    )
      rows = searchedLedgerRows.filter((row) =>
        /payable|creditor|liabilit/i.test(
          `${row.section} ${row.group} ${row.account}`,
        ),
      );
    else if (
      lowerKey.includes('budget-vs-actual')
    ) {
      const projects = new Map<
        string,
        {
          project: string;
          plannedAmount: number;
          revisedAmount: number;
          actualExpense: number;
          collection: number;
          variance: number;
        }
      >();
      projectBudgets.forEach((model) => {
        const row = plain(model);
        const project = str(
          row.projectUuid ||
            row.projectId ||
            'Unassigned',
        );
        const total = projects.get(project) || {
          project,
          plannedAmount: 0,
          revisedAmount: 0,
          actualExpense: 0,
          collection: 0,
          variance: 0,
        };
        total.plannedAmount += num(
          row.plannedAmount,
        );
        total.revisedAmount += num(
          row.revisedAmount ?? row.plannedAmount,
        );
        projects.set(project, total);
      });
      expenses.forEach((model) => {
        const row = plain(model);
        const project = str(
          row.projectId ||
            row.project ||
            'Unassigned',
        );
        const total = projects.get(project) || {
          project,
          plannedAmount: 0,
          revisedAmount: 0,
          actualExpense: 0,
          collection: 0,
          variance: 0,
        };
        total.actualExpense += num(
          row.totalAmount,
        );
        projects.set(project, total);
      });
      receipts.forEach((model) => {
        const row = plain(model);
        const project = str(
          row.projectId || 'Unassigned',
        );
        const total = projects.get(project) || {
          project,
          plannedAmount: 0,
          revisedAmount: 0,
          actualExpense: 0,
          collection: 0,
          variance: 0,
        };
        total.collection += num(row.amount);
        projects.set(project, total);
      });
      rows = [...projects.values()].map(
        (row) => ({
          ...row,
          variance:
            row.revisedAmount - row.actualExpense,
        }),
      );
    } else if (
      lowerKey.includes('expense-report')
    )
      rows = transactionRows.filter(
        (row) => row.type === 'Expense',
      );
    else if (
      lowerKey.includes('receipt-report') ||
      lowerKey.includes('receiv')
    )
      rows = transactionRows.filter((row) =>
        /receipt|receive|sales/i.test(
          str(row.type),
        ),
      );
    else if (lowerKey.includes('cash-bank'))
      rows = transactionRows.filter((row) =>
        /cash|bank/i.test(
          `${row.account} ${row.type}`,
        ),
      );
    else if (
      lowerKey.includes('cash-flow') ||
      lowerKey.includes('fund-flow') ||
      lowerKey.includes('receive-and-payment') ||
      lowerKey.includes('receive-payment')
    ) {
      const monthly = new Map<
        string,
        {
          month: string;
          receipts: number;
          payments: number;
          net: number;
        }
      >();
      transactionRows.forEach((line) => {
        const key = monthKey(str(line.date));
        const value = monthly.get(key) || {
          month: key,
          receipts: 0,
          payments: 0,
          net: 0,
        };
        if (
          /receipt|receive/i.test(str(line.type))
        )
          value.receipts += num(line.amount);
        if (
          /payment|expense/i.test(str(line.type))
        )
          value.payments += num(line.amount);
        value.net =
          value.receipts - value.payments;
        monthly.set(key, value);
      });
      rows = [...monthly.values()];
    } else rows = transactionRows;
    if (
      lowerKey.includes('day-book') ||
      lowerKey.includes('statement')
    )
      rows.sort((a, b) =>
        str(a.date).localeCompare(str(b.date)),
      );
    const debitTotal = rows.reduce(
      (sum, row) =>
        sum + num(row.debit ?? row.closingDebit),
      0,
    );
    const creditTotal = rows.reduce(
      (sum, row) =>
        sum +
        num(row.credit ?? row.closingCredit),
      0,
    );
    const amountTotal = rows.reduce(
      (sum, row) =>
        sum +
        num(
          row.amount ??
            row.totalAmount ??
            row.debit ??
            row.receipts,
        ),
      0,
    );
    return {
      reportKey,
      title,
      generatedAt: new Date().toISOString(),
      filters: {
        fromDate: query.fromDate || null,
        toDate: query.toDate || null,
        projectId: projectId || null,
      },
      summary: {
        records: rows.length,
        debit: debitTotal,
        credit: creditTotal,
        net: debitTotal - creditTotal,
        amount: amountTotal,
      },
      data: rows,
      meta: {
        total: rows.length,
        page: 1,
        limit: rows.length,
      },
    };
  }
}
