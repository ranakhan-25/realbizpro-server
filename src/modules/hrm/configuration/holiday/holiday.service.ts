/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';

import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { QueryHolidayDto } from './dto/query-holiday.dto';
import {
  Holiday,
  HolidayStatus,
} from 'src/database/models/hrm/configuration/holiday_model';

@Injectable()
export class HolidayService {
  constructor(
    @InjectModel(Holiday)
    private readonly holidayModel: typeof Holiday,
  ) {}

  private ensureDateRange(
    fromDate?: string,
    toDate?: string,
  ) {
    if (fromDate && toDate && fromDate > toDate) {
      throw new BadRequestException(
        'From date cannot be after to date',
      );
    }
  }

  async create(
    dto: CreateHolidayDto,
  ): Promise<Holiday> {
    this.ensureDateRange(
      dto.fromDate,
      dto.toDate,
    );

    const record = await this.holidayModel.create(
      {
        ...dto,
        createdBy: dto.addedById,
        status:
          dto.status ?? HolidayStatus.ACTIVE,
      },
    );

    return this.findOne(record.uuid);
  }

  async findAll(query: QueryHolidayDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      status,
      dateFrom,
      dateTo,
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
        { reason: { [Op.iLike]: `%${search}%` } },
        {
          description: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (dateFrom) {
      where.toDate = { [Op.gte]: dateFrom };
    }

    if (dateTo) {
      where.fromDate = { [Op.lte]: dateTo };
    }

    const { rows, count } =
      await this.holidayModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
        paranoid: !withDeleted,
      });

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

  async findOne(uuid: string): Promise<Holiday> {
    const record =
      await this.holidayModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Holiday #${uuid} not found`,
      );
    }

    return record;
  }

  async update(
    uuid: string,
    dto: UpdateHolidayDto,
  ): Promise<Holiday> {
    const record =
      await this.holidayModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Holiday #${uuid} not found`,
      );
    }

    this.ensureDateRange(
      dto.fromDate ?? record.fromDate,
      dto.toDate ?? record.toDate,
    );

    await record.update({
      ...dto,
      updatedBy:
        dto.addedById ?? record.updatedBy,
    });

    return this.findOne(uuid);
  }

  async remove(
    uuid: string,
  ): Promise<{ message: string }> {
    const record =
      await this.holidayModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Holiday #${uuid} not found`,
      );
    }

    // status → inactive + soft delete
    await record.update({
      status: HolidayStatus.INACTIVE,
    });

    await record.destroy();

    return {
      message: `Holiday #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string): Promise<Holiday> {
    const record =
      await this.holidayModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!record) {
      throw new NotFoundException(
        `Holiday #${uuid} not found`,
      );
    }

    if (!record.deletedAt) {
      throw new BadRequestException(
        `Holiday #${uuid} is not deleted`,
      );
    }

    // status → active + restore
    await record.restore();
    await record.update({
      status: HolidayStatus.ACTIVE,
    });

    return this.findOne(uuid);
  }
}
