/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ExpenseReport } from 'src/database/models/accounts/reports/acc_expense-report.model';
import { CreateExpenseReportDto } from './dto/create-expense_report.dto';
import { UpdateExpenseReportDto } from './dto/update-expense_report.dto';
import { QueryExpenseReportDto } from './dto/query-expense_report.dto';

@Injectable()
export class ExpenseReportService {
  constructor(
    @InjectModel(ExpenseReport)
    private readonly expenseModel: typeof ExpenseReport,
  ) {}

  async create(dto: CreateExpenseReportDto): Promise<ExpenseReport> {
    try {
      return await this.expenseModel.create({
        ...dto,
        date: new Date(dto.date),
      } as any);
    } catch (error) {
      console.error("❌ ExpenseReport Create Error:", error);
      throw new BadRequestException(
        error?.message || 'Failed to create expense entry.'
      );
    }
  }

  async findAll(query: QueryExpenseReportDto) {
    const { page = '1', limit = '10', search, ...filters } = query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    Object.keys(filters).forEach((k) => {
      if (filters[k] !== undefined && filters[k] !== null && filters[k] !== '') {
        where[k] = filters[k];
      }
    });

    if (search) {
      where[Op.or] = [
        { voucher: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.expenseModel.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
    });

    return {
      data: rows,
      meta: { total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) },
    };
  }

  async findOne(uuid: string): Promise<ExpenseReport> {
    const row = await this.expenseModel.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Expense entry ${uuid} not found`);
    return row;
  }

  async update(uuid: string, dto: UpdateExpenseReportDto): Promise<ExpenseReport> {
    const row = await this.findOne(uuid);
    const updateData: any = { ...dto };
    if (dto.date) updateData.date = new Date(dto.date);
    return row.update(updateData);
  }

  async remove(uuid: string): Promise<{ message: string }> {
    const row = await this.findOne(uuid);
    await row.destroy();
    return { message: 'Expense entry deleted successfully' };
  }

  async restore(uuid: string): Promise<ExpenseReport> {
    const row = await this.expenseModel.findOne({ where: { uuid }, paranoid: false });
    if (!row) throw new NotFoundException(`Expense entry ${uuid} not found`);
    if (!row.deletedAt) throw new BadRequestException('Entry is not deleted');
    await row.restore();
    return this.findOne(uuid);
  }
}