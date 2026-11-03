/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ChequeRange } from '../../../../database/models/accounts/bank-reconciliation/acc_cheque-range.model';
import { CreateChequeRangeDto } from './dto/create-list_of_cheque_range.dto';
import { UpdateChequeRangeDto } from './dto/update-list_of_cheque_range.dto';
import { QueryChequeRangeDto } from './dto/query-list_of_cheque_range.dto';

@Injectable()
export class ChequeRangeService {
  constructor(
    @InjectModel(ChequeRange)
    private readonly chequeRangeModel: typeof ChequeRange,
  ) {}

  async create(dto: CreateChequeRangeDto): Promise<ChequeRange> {
    try {
      return await this.chequeRangeModel.create(dto as any);
    } catch (error) {
      console.error("❌ ChequeRange Create Error:", error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Cheque range already exists.');
      }
      throw new BadRequestException(error?.message || 'Failed to create cheque range.');
    }
  }

  async findAll(query: QueryChequeRangeDto) {
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
        { name: { [Op.iLike]: `%${search}%` } },
        { cashBank: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.chequeRangeModel.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [['created_at', 'DESC']],
   
    });

    return {
      data: rows,
      meta: { total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) },
    };
  }

  async findOne(uuid: string): Promise<ChequeRange> {
    const chequeRange = await this.chequeRangeModel.findOne({
      where: { uuid },
    
    });
    if (!chequeRange) throw new NotFoundException(`Cheque Range ${uuid} not found`);
    return chequeRange;
  }

  async update(uuid: string, dto: UpdateChequeRangeDto): Promise<ChequeRange> {
    const chequeRange = await this.findOne(uuid);
    await chequeRange.update(dto);
    return chequeRange;
  }

  async remove(uuid: string): Promise<{ message: string }> {
    const chequeRange = await this.findOne(uuid);
    await chequeRange.destroy();
    return { message: 'Cheque range deleted successfully.' };
  }

  async restore(uuid: string): Promise<ChequeRange> {
    const chequeRange = await this.chequeRangeModel.findOne({
      where: { uuid },
      paranoid: false,
    });
    if (!chequeRange) throw new NotFoundException(`Cheque Range ${uuid} not found`);
    await chequeRange.restore();
    return chequeRange;
  }

}