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
import {
  LabourWorkBank,
  LabourWorkBankStatus,
} from 'src/database/models/labour work bank/lb_labour_work_bank_model';

@Injectable()
export class LabourWorkBankService {
  constructor(
    @InjectModel(LabourWorkBank)
    private readonly labourWorkBankModel: typeof LabourWorkBank,
  ) {}

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
        status:
          dto.status ??
          LabourWorkBankStatus.ACTIVE,
        ...(dueDate
          ? { dueDate: new Date(dueDate) }
          : {}),
      });

    return this.findOne(labourWorkBank.uuid);
  }

  async findAll(query: QueryLabourWorkBankDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      underGroup,
      status,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;

    const offset =
      skip !== undefined && skip !== null
        ? skip
        : (page - 1) * limit;

    const where: any = {};

    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
        {
          businessName: {
            [Op.iLike]: `%${search}%`,
          },
        },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
        {
          address: { [Op.iLike]: `%${search}%` },
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

    if (status) {
      where.status = status;
    }

    const { rows, count } =
      await this.labourWorkBankModel.findAndCountAll(
        {
          where,
          limit,
          offset,
          order: [[sortBy, sortOrder]],
          paranoid: !withDeleted,
        },
      );

    const totalPages =
      Math.ceil(count / limit) || 1;
    const currentPage =
      skip !== undefined && skip !== null
        ? Math.floor(skip / limit) + 1
        : page;

    const nextPage =
      currentPage < totalPages
        ? currentPage + 1
        : null;

    const previousPage =
      currentPage > 1 ? currentPage - 1 : null;

    return {
      data: rows,
      meta: {
        page: currentPage,
        pageNo: currentPage,
        nextPage,
        previousPage,
        limit,
        skip: offset,
        total: count,
        totalPages,
      },
    };
  }

  async findOne(
    uuid: string,
  ): Promise<LabourWorkBank> {
    const labourWorkBank =
      await this.labourWorkBankModel.findOne({
        where: { uuid } as any,
      });

    if (!labourWorkBank) {
      throw new NotFoundException(
        `Labour work bank #${uuid} not found`,
      );
    }

    return labourWorkBank;
  }

  async update(
    uuid: string,
    dto: UpdateLabourWorkBankDto,
  ): Promise<LabourWorkBank> {
    const labourWorkBank =
      await this.labourWorkBankModel.findOne({
        where: { uuid } as any,
      });

    if (!labourWorkBank) {
      throw new NotFoundException(
        `Labour work bank #${uuid} not found`,
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

    return this.findOne(uuid);
  }

  async remove(
    uuid: string,
  ): Promise<{ message: string }> {
    const labourWorkBank =
      await this.labourWorkBankModel.findOne({
        where: { uuid } as any,
      });

    if (!labourWorkBank) {
      throw new NotFoundException(
        `Labour work bank #${uuid} not found`,
      );
    }

    // status → inactive + soft delete
    await labourWorkBank.update({
      status: LabourWorkBankStatus.INACTIVE,
    });

    await labourWorkBank.destroy();

    return {
      message: `Labour work bank #${uuid} deleted successfully`,
    };
  }

  async restore(
    uuid: string,
  ): Promise<LabourWorkBank> {
    const labourWorkBank =
      await this.labourWorkBankModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!labourWorkBank) {
      throw new NotFoundException(
        `Labour work bank #${uuid} not found`,
      );
    }

    if (!labourWorkBank.deletedAt) {
      throw new BadRequestException(
        `Labour work bank #${uuid} is not deleted`,
      );
    }

    // status → active + restore
    await labourWorkBank.restore();
    await labourWorkBank.update({
      status: LabourWorkBankStatus.ACTIVE,
    });

    return this.findOne(uuid);
  }
}
