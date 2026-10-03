/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';

import { CreateLabourWorkBankDto } from './dto/create-labour-work-bank.dto';
import { QueryLabourWorkBankDto } from './dto/query-labour-work-bank.dto';
import { UpdateLabourWorkBankDto } from './dto/update-labour-work-bank.dto';
import { LabourWorkBank } from 'src/database/models/labour work bank/lb_labour_work_bank_model';

@Injectable()
export class LabourWorkBankService {
  constructor(
    @InjectModel(LabourWorkBank)
    private readonly labourWorkBankModel: typeof LabourWorkBank,
  ) {}

  // CREATE
  async create(
    dto: CreateLabourWorkBankDto,
  ): Promise<LabourWorkBank> {
    const existing =
      await this.labourWorkBankModel.findOne({
        where: {
          code: dto.code,
        },
      });

    if (existing) {
      throw new BadRequestException(
        `Labour work bank code "${dto.code}" already exists`,
      );
    }

    const { dueDate, ...labourData } = dto;

    const labourWorkBank =
      await this.labourWorkBankModel.create({
        ...labourData,
        ...(dueDate
          ? { dueDate: new Date(dueDate) }
          : {}),
      });

    return this.findOne(labourWorkBank.id);
  }

  // FIND ALL
  async findAll(query: QueryLabourWorkBankDto) {
    const {
      page = 1,
      limit = 10,
      search,
      underGroup,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;

    const where: any = {};

    if (search) {
      where[Op.or] = [
        {
          code: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          businessName: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          email: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          phone: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          address: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          underGroup: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    if (underGroup) {
      where.underGroup = underGroup;
    }

    const { rows, count } =
      await this.labourWorkBankModel.findAndCountAll(
        {
          where,
          limit,
          offset: (page - 1) * limit,
          order: [[sortBy, sortOrder]],
          paranoid: !withDeleted,
        },
      );

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  // FIND ONE
  async findOne(
    id: string | number,
  ): Promise<LabourWorkBank> {
    const labourWorkBank =
      await this.labourWorkBankModel.findByPk(id);

    if (!labourWorkBank) {
      throw new NotFoundException(
        `Labour work bank #${id} not found`,
      );
    }

    return labourWorkBank;
  }

  // UPDATE
  async update(
    id: string | number,
    dto: UpdateLabourWorkBankDto,
  ): Promise<LabourWorkBank> {
    const labourWorkBank =
      await this.labourWorkBankModel.findByPk(id);

    if (!labourWorkBank) {
      throw new NotFoundException(
        `Labour work bank #${id} not found`,
      );
    }

    if (
      dto.code &&
      dto.code !== labourWorkBank.code
    ) {
      const exists =
        await this.labourWorkBankModel.findOne({
          where: {
            code: dto.code,
          },
        });

      if (exists) {
        throw new BadRequestException(
          `Labour work bank code "${dto.code}" already exists`,
        );
      }
    }

    const { dueDate, ...labourData } = dto;

    await labourWorkBank.update({
      ...labourData,
      ...(dueDate
        ? { dueDate: new Date(dueDate) }
        : {}),
    });

    return this.findOne(id);
  }

  // REMOVE
  async remove(
    id: string | number,
  ): Promise<{ message: string }> {
    const labourWorkBank =
      await this.labourWorkBankModel.findByPk(id);

    if (!labourWorkBank) {
      throw new NotFoundException(
        `Labour work bank #${id} not found`,
      );
    }

    await labourWorkBank.destroy();

    return {
      message: `Labour work bank #${id} deleted successfully`,
    };
  }

  // RESTORE
  async restore(
    id: string | number,
  ): Promise<LabourWorkBank> {
    const labourWorkBank =
      await this.labourWorkBankModel.findByPk(
        id,
        {
          paranoid: false,
        },
      );

    if (!labourWorkBank) {
      throw new NotFoundException(
        `Labour work bank #${id} not found`,
      );
    }

    if (!labourWorkBank.deletedAt) {
      throw new BadRequestException(
        `Labour work bank #${id} is not deleted`,
      );
    }

    await labourWorkBank.restore();

    return this.findOne(id);
  }
}
