import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { UniqueConstraintError, ValidationError } from 'sequelize';
import { Expense } from 'src/database/models/accounts/vouchers/acc_expence_list_model';
import { ExpenseItem } from 'src/database/models/accounts/vouchers/acc_expense-item.model';
import { CreateExpenseDto } from './dto/create-expense_list.dto';
import { QueryExpenseDto } from './dto/query-expense_list.dto';
import { UpdateExpenseDto } from './dto/update-expense_list.dto';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectModel(Expense) private expenseModel: typeof Expense,
    @InjectModel(ExpenseItem) private expenseItemModel: typeof ExpenseItem,
    private sequelize: Sequelize,
  ) {}

  async create(createExpenseDto: CreateExpenseDto) {
    const t = await this.sequelize.transaction();

    try {
      const { items, ...expenseData } = createExpenseDto;
      const requestedVoucherNo = expenseData.voucherNo?.trim();
      const voucherNo =
        !requestedVoucherNo || requestedVoucherNo.toLowerCase() === 'string'
          ? `E${Date.now()}`
          : requestedVoucherNo;

      // 1. Save Master (Expense)
      const expense = await this.expenseModel.create(
        {
          ...expenseData,
          voucherNo,
          date: new Date(expenseData.date),
        } as any,
        { transaction: t },
      );

      // 2. Save Details (Expense Items)
      if (items && items.length > 0) {
        const itemsWithId = items.map((item) => ({
          ...item,
          expenseUuid: expense.uuid,
        }));

        await this.expenseItemModel.bulkCreate(itemsWithId, {
          transaction: t,
        });
      }

      await t.commit();
      return { success: true, message: 'Expense created successfully', data: expense };
    } catch (error) {
      await t.rollback();
      console.error("Expense Create Error: ", error);
      if (error instanceof UniqueConstraintError) {
        const field = error.errors?.[0]?.path;
        throw new BadRequestException({
          message: field === 'voucher_no'
            ? `Voucher number '${createExpenseDto.voucherNo}' already exists`
            : error.errors?.[0]?.message || 'Expense already exists',
          errors: error.errors?.map((item) => ({
            field: item.path,
            message: item.message,
            value: item.value,
          })),
        });
      }
      if (error instanceof ValidationError) {
        throw new BadRequestException({
          message: error.errors.map((item) => item.message).join('; '),
          errors: error.errors.map((item) => ({
            field: item.path,
            message: item.message,
            value: item.value,
          })),
        });
      }
      throw new BadRequestException(error?.message || 'Failed to create expense');
    }
  }

  async findAll(query: QueryExpenseDto) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);
    const where: any = {};

    if (query.search) {
      where[Op.or] = [
        { voucherNo: { [Op.iLike]: `%${query.search}%` } },
        { project: { [Op.iLike]: `%${query.search}%` } },
      ];
    }
    ['project', 'site', 'task', 'orgId', 'projectId'].forEach((field) => {
      if (query[field]) where[field] = query[field];
    });

    const { rows, count } = await this.expenseModel.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['date', 'DESC']],
      distinct: true,
    });

    const uuids = rows.map((expense) => expense.uuid);
    const items = uuids.length
      ? await this.expenseItemModel.findAll({
          where: { expenseUuid: { [Op.in]: uuids } },
        })
      : [];
    const itemsByExpense = new Map<string, ExpenseItem[]>();
    items.forEach((item) => {
      const expenseItems = itemsByExpense.get(item.expenseUuid) || [];
      expenseItems.push(item);
      itemsByExpense.set(item.expenseUuid, expenseItems);
    });
    rows.forEach((expense) => {
      (expense as any).dataValues.items =
        itemsByExpense.get(expense.uuid) || [];
    });

    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  }

  async findOne(uuid: string): Promise<Expense> {
    const expense = await this.expenseModel.findOne({
      where: { uuid },
    });
    if (!expense) throw new NotFoundException(`Expense ${uuid} not found`);
    const items = await this.expenseItemModel.findAll({
      where: { expenseUuid: uuid },
    });
    (expense as any).dataValues.items = items;
    return expense;
  }

  async update(uuid: string, dto: UpdateExpenseDto): Promise<Expense> {
    const transaction = await this.sequelize.transaction();
    try {
      const expense = await this.expenseModel.findOne({ where: { uuid }, transaction });
      if (!expense) throw new NotFoundException(`Expense ${uuid} not found`);

      const updateData: any = { ...dto };
      delete updateData.items;
      if (dto.date) updateData.date = new Date(dto.date);
      await expense.update(updateData, { transaction });

      if (dto.items !== undefined) {
        await this.expenseItemModel.destroy({ where: { expenseUuid: uuid }, transaction });
        if (dto.items.length > 0) {
          await this.expenseItemModel.bulkCreate(
            dto.items.map((item) => ({ ...item, expenseUuid: uuid })) as any,
            { transaction },
          );
        }
      }

      await transaction.commit();
      return this.findOne(uuid);
    } catch (error) {
      await transaction.rollback();
      throw error instanceof NotFoundException
        ? error
        : new BadRequestException(error.message || 'Failed to update expense');
    }
  }

  async remove(uuid: string): Promise<{ message: string }> {
    await this.findOne(uuid);
    await this.expenseModel.destroy({ where: { uuid } });
    return { message: `Expense ${uuid} deleted successfully` };
  }

  async restore(uuid: string): Promise<Expense> {
    const expense = await this.expenseModel.findOne({ where: { uuid }, paranoid: false });
    if (!expense) throw new NotFoundException(`Expense ${uuid} not found`);
    if (!expense.deletedAt) throw new BadRequestException('Expense is not deleted');
    await expense.restore();
    return this.findOne(uuid);
  }
}