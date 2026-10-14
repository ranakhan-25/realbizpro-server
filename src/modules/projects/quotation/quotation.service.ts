import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { CreateQuotationDto } from './dto/create-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { Op } from 'sequelize';
import { Quotation } from 'src/database/models/projects/quatation/pr_quotation.model';

@Injectable()
export class QuotationService {
  constructor(
    @InjectModel(Quotation)
    private readonly quotationModel: typeof Quotation,
  ) {}

  async create(createQuotationDto: CreateQuotationDto, userId?: string) {
    try {
      const data = {
        ...createQuotationDto,
        createdBy: userId,
        addedById: userId,
      };

      const quotation = await this.quotationModel.create(data as any);
      return quotation;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(query?: any) {
    const {
      page = 1,
      limit = 10,
      search,
      projectType,
      approveStatus,
      startDate,
      endDate,
    } = query || {};

    const where: any = {};

    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { customer: { [Op.iLike]: `%${search}%` } },
        { project: { [Op.iLike]: `%${search}%` } },
        { employeeName: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (projectType) where.projectType = projectType;
    if (approveStatus) where.approveStatus = approveStatus;

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await this.quotationModel.findAndCountAll({
      where,
      limit: Number(limit),
      offset: Number(offset),
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows,
      meta: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findOne(uuid: string) {
    const quotation = await this.quotationModel.findByPk(uuid);

    if (!quotation) {
      throw new NotFoundException(`Quotation with UUID ${uuid} not found`);
    }

    return quotation;
  }

  async update(uuid: string, updateQuotationDto: UpdateQuotationDto, userId?: string) {
    const quotation = await this.findOne(uuid);
    const { date, ...quotationFields } = updateQuotationDto;

    await quotation.update({
      ...quotationFields,
      ...(date !== undefined ? { date: new Date(date) } : {}),
      updatedBy: userId,
    });

    return quotation;
  }

  async remove(uuid: string, userId?: string) {
    const quotation = await this.findOne(uuid);

    await quotation.update({ deletedBy: userId });
    await quotation.destroy(); // soft delete (paranoid: true)

    return { message: 'Quotation soft deleted successfully' };
  }

  async restore(uuid: string) {
    const quotation = await this.quotationModel.findByPk(uuid, {
      paranoid: false,
    });

    if (!quotation) {
      throw new NotFoundException(`Quotation with UUID ${uuid} not found`);
    }

    if (!quotation.deletedAt) {
      throw new BadRequestException('Quotation is not deleted');
    }

    await quotation.restore();
    return { message: 'Quotation restored successfully', data: quotation };
  }
}