/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BankReconciliation, ReconciliationStatus } from '../../../../database/models/accounts/bank-reconciliation/acc_bank-reconciliation.model';
import { CreateBankReconciliationDto } from './dto/create-bank-reconciliation_statement.dto';
import { UpdateBankReconciliationDto } from './dto/update-bank-reconciliation_statement.dto';
import { QueryBankReconciliationDto } from './dto/query-bank-reconciliation_statement.dto';

@Injectable()
export class BankReconciliationService {
  constructor(
    @InjectModel(BankReconciliation)
    private readonly reconciliationModel: typeof BankReconciliation,
  ) {}

  async create(dto: CreateBankReconciliationDto): Promise<BankReconciliation> {
    try {
      return await this.reconciliationModel.create({
        ...dto,
        date: new Date(dto.date),
        ...(dto.chequeDate ? { chequeDate: new Date(dto.chequeDate) } : {}),
      } as any);
    } catch (error) {
      console.error("❌ BankReconciliation Create Error:", error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Voucher number already exists.');
      }
      throw new BadRequestException(error?.message || 'Failed to create reconciliation.');
    }
  }

  async findAll(query: QueryBankReconciliationDto) {
    const { page = '1', limit = '10', search, fromDate, toDate, ...filters } = query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    Object.keys(filters).forEach((k) => {
      if (filters[k] !== undefined && filters[k] !== null && filters[k] !== '') {
        where[k] = filters[k];
      }
    });

    if (fromDate || toDate) {
      where.date = {};
      if (fromDate) where.date[Op.gte] = new Date(fromDate);
      if (toDate) where.date[Op.lte] = new Date(toDate);
    }

    if (search) {
      where[Op.or] = [
        { voucherNo: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { bank: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.reconciliationModel.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [['date', 'DESC']],
    });

    return {
      data: rows,
      meta: { total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) },
    };
  }

  async findOne(uuid: string): Promise<BankReconciliation> {
    const reconciliation = await this.reconciliationModel.findOne({ where: { uuid } });
    if (!reconciliation) throw new NotFoundException(`Reconciliation ${uuid} not found`);
    return reconciliation;
  }

  async update(uuid: string, dto: UpdateBankReconciliationDto): Promise<BankReconciliation> {
    const reconciliation = await this.findOne(uuid);
    const updateData: any = { ...dto };
    if (dto.date) updateData.date = new Date(dto.date);
    if (dto.chequeDate) updateData.chequeDate = new Date(dto.chequeDate);
    return reconciliation.update(updateData);
  }

  async remove(uuid: string): Promise<{ message: string }> {
    const reconciliation = await this.findOne(uuid);
    await reconciliation.destroy();
    return { message: 'Reconciliation deleted successfully' };
  }

  async restore(uuid: string): Promise<BankReconciliation> {
    const reconciliation = await this.reconciliationModel.findOne({ where: { uuid }, paranoid: false });
    if (!reconciliation) throw new NotFoundException(`Reconciliation ${uuid} not found`);
    if (!reconciliation.deletedAt) throw new BadRequestException('Reconciliation is not deleted');
    await reconciliation.restore();
    return this.findOne(uuid);
  }
}