/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import { MonthYear } from 'src/database/models/hrm/employee/hrm_monthyear_model';
import { CreateMonthYearDto } from './dto/create-month-year.dto';
import { UpdateMonthYearDto } from './dto/update-month-year.dto';
import { QueryMonthYearDto } from './dto/query-month-year.dto';

@Injectable()
export class MonthYearService {
  constructor(
    @InjectModel(MonthYear)
    private readonly monthYearModel: typeof MonthYear,
  ) {}

  // ---------- helpers ----------

  // month + year unique, tai soft-deleted gulo-o check kori
  private async ensureMonthYearAvailable(
    month: string,
    year: number,
    excludeUuid?: string,
  ): Promise<void> {
    const where: any = { month, year };

    if (excludeUuid) {
      where.uuid = { [Op.ne]: excludeUuid };
    }

    const existing =
      await this.monthYearModel.findOne({
        where,
        paranoid: false,
      });

    if (existing) {
      throw new BadRequestException(
        existing.deletedAt
          ? `Month year for ${month} ${year} already exists in deleted records, please restore it`
          : `Month year for ${month} ${year} already exists`,
      );
    }
  }

  private validateDates(
    startDate: string,
    endDate: string,
  ): void {
    if (
      new Date(endDate).getTime() <
      new Date(startDate).getTime()
    ) {
      throw new BadRequestException(
        'End date cannot be before start date',
      );
    }
  }

  // ---------- CRUD ----------

  async create(
    dto: CreateMonthYearDto,
  ): Promise<MonthYear> {
    await this.ensureMonthYearAvailable(
      dto.month,
      dto.year,
    );
    this.validateDates(dto.startDate, dto.endDate);

    const record =
      await this.monthYearModel.create(dto as any);

    return this.findOne(record.uuid);
  }

  async findAll(query: QueryMonthYearDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      month,
      year,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;

    const offset =
      skip !== undefined && skip !== null
        ? skip
        : (page - 1) * limit;

    const where: any = {};
    if (query.orgId) {
      where.orgId = query.orgId;
    }
    if ((query as any).projectId) {
      where.projectId = (query as any).projectId;
    }

    if (search) {
      where.month = { [Op.like]: `%${search}%` };
    }

    if (month) {
      where.month = month;
    }

    if (year) {
      where.year = year;
    }

    const { rows, count } =
      await this.monthYearModel.findAndCountAll(
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
  ): Promise<MonthYear> {
    const record =
      await this.monthYearModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Month year #${uuid} not found`,
      );
    }

    return record;
  }

  async update(
    uuid: string,
    dto: UpdateMonthYearDto,
  ): Promise<MonthYear> {
    const record =
      await this.monthYearModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Month year #${uuid} not found`,
      );
    }

    const newMonth = dto.month ?? record.month;
    const newYear = dto.year ?? record.year;

    if (
      newMonth !== record.month ||
      newYear !== record.year
    ) {
      await this.ensureMonthYearAvailable(
        newMonth,
        newYear,
        uuid,
      );
    }

    this.validateDates(
      dto.startDate ?? record.startDate,
      dto.endDate ?? record.endDate,
    );

    await record.update(dto as any);

    return this.findOne(uuid);
  }

  async remove(
    uuid: string,
  ): Promise<{ message: string }> {
    const record =
      await this.monthYearModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Month year #${uuid} not found`,
      );
    }

    // soft delete
    await record.destroy();

    return {
      message: `Month year #${uuid} deleted successfully`,
    };
  }

  async restore(
    uuid: string,
  ): Promise<MonthYear> {
    const record =
      await this.monthYearModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!record) {
      throw new NotFoundException(
        `Month year #${uuid} not found`,
      );
    }

    if (!record.deletedAt) {
      throw new BadRequestException(
        `Month year #${uuid} is not deleted`,
      );
    }

    await record.restore();

    return this.findOne(uuid);
  }
}
