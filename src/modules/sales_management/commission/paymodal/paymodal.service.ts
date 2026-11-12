/* eslint-disable prettier/prettier */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { PayCommission } from '../../../../database/models/sales_management/sm_pay_commission.model'; // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â¦Ãƒâ€šÃ‚Â®ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â§ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â¦Ãƒâ€šÃ‚Â² ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â¦Ãƒâ€šÃ‚Â®ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â¦Ãƒâ€šÃ‚ÂªÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â§ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¹ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â¦Ãƒâ€šÃ‚Â°ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚ÂÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â¦Ãƒâ€¦Ã‚Â¸
import { CreatePayCommissionDto } from './dto/create-paymodal.dto';
import { UpdatePayCommissionDto } from './dto/update-paymodal.dto'; // ÃƒÆ’Ã‚Â¢Ãƒâ€¦Ã¢â‚¬Å“ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â¦Ãƒâ€šÃ‚ÂªÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â§ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â¦Ãƒâ€¦Ã‚Â¸ DTO ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â¦Ãƒâ€šÃ‚Â®ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â¦Ãƒâ€šÃ‚ÂªÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â§ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¹ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â¦Ãƒâ€šÃ‚Â°ÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â§Ãƒâ€šÃ‚ÂÃƒÆ’Ã‚Â Ãƒâ€šÃ‚Â¦Ãƒâ€¦Ã‚Â¸
import { QueryPayCommissionDto } from './dto/query-paymodal.dto';

@Injectable()
export class PayCommissionService {
  constructor(
    @InjectModel(PayCommission)
    private readonly payCommissionModel: typeof PayCommission,
  ) {}

  async create(dto: CreatePayCommissionDto): Promise<PayCommission> {
    try {
      return await this.payCommissionModel.create({
        ...dto,
        acknowledged: dto.acknowledged ?? true,
        status: dto.status ?? 'paid',
      } as any);
    } catch (error) {
      console.error('ÃƒÆ’Ã‚Â¢Ãƒâ€šÃ‚ÂÃƒâ€¦Ã¢â‚¬â„¢ PayCommission Create Error:', error);
      throw new BadRequestException(
        error?.message || 'Failed to create pay commission.',
      );
    }
  }

  async findAll(query: QueryPayCommissionDto) {
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
        { agentName: { [Op.iLike]: `%${search}%` } },
        { agentId: { [Op.iLike]: `%${search}%` } },
        { bankName: { [Op.iLike]: `%${search}%` } },
        { notes: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.payCommissionModel.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [['created_at', 'DESC']],
    });

    return {
      data: rows,
      meta: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    };
  }

  async findOne(uuid: string): Promise<PayCommission> {
    const record = await this.payCommissionModel.findOne({ where: { uuid } });
    if (!record) throw new NotFoundException(`PayCommission ${uuid} not found`);
    return record;
  }

  async update(uuid: string, dto: UpdatePayCommissionDto): Promise<PayCommission> {
    const record = await this.findOne(uuid);
    return record.update({ ...dto } as any);
  }

  async remove(uuid: string): Promise<{ message: string }> {
    const record = await this.findOne(uuid);
    await record.destroy();
    return { message: 'Pay commission deleted successfully' };
  }

  async restore(uuid: string): Promise<PayCommission> {
    const record = await this.payCommissionModel.findOne({
      where: { uuid },
      paranoid: false,
    });
    if (!record) throw new NotFoundException(`PayCommission ${uuid} not found`);
    if (!record.deletedAt)
      throw new BadRequestException('Pay commission is not deleted');
    await record.restore();
    return this.findOne(uuid);
  }
}