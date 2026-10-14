/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { CreateMonthYearDto } from './dto/create-month-year.dto';
import { QueryMonthYearDto } from './dto/query-month-year.dto';
import { UpdateMonthYearDto } from './dto/update-month-year.dto';
import { MonthYear } from 'src/database/models/hrm/employee/hrm_monthyear_model';

@Injectable()
export class MonthYearService {
  constructor(
    @InjectModel(MonthYear)
    private readonly model: typeof MonthYear,
  ) {}

  // Create month-year
  async create(
    dto: CreateMonthYearDto,
  ): Promise<MonthYear> {
    const duplicate = await this.model.findOne({
      where: {
        month: dto.month,
        year: dto.year,
      },
      paranoid: false,
    });

    if (duplicate) {
      throw new BadRequestException(
        `Month '${dto.month}' for ${dto.year} already exists`,
      );
    }

    const item = await this.model.create(dto);

    return this.findOne(item.uuid);
  }

  // Get all month-years with search, filter and pagination
  async findAll(query: QueryMonthYearDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const offset =
      query.skip ?? (page - 1) * limit;

    const where: any = {};

    // Search by month
    if (query.search?.trim()) {
      const searchTerm = query.search.trim();

      where[Op.or] = [
        {
          month: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
      ];
    }

    // Filter by year
    if (query.year !== undefined) {
      where.year = query.year;
    }

    const { rows, count } =
      await this.model.findAndCountAll({
        where,
        limit,
        offset,
        paranoid: !(query.withDeleted ?? false),
        order: [
          [
            query.sortBy ?? 'createdAt',
            query.sortOrder ?? 'DESC',
          ],
        ],
      });

    const currentPage =
      query.skip !== undefined
        ? Math.floor(offset / limit) + 1
        : page;

    const totalPages =
      Math.ceil(count / limit) || 1;

    return {
      data: rows,
      meta: {
        page: currentPage,
        pageNo: currentPage,
        nextPage:
          currentPage < totalPages
            ? currentPage + 1
            : null,
        previousPage:
          currentPage > 1
            ? currentPage - 1
            : null,
        limit,
        skip: offset,
        total: count,
        totalPages,
      },
    };
  }

  // Get month-year by UUID
  async findOne(
    uuid: string,
    withDeleted = false,
  ): Promise<MonthYear> {
    const item = await this.model.findOne({
      where: { uuid } as any,
      paranoid: !withDeleted,
    });

    if (!item) {
      throw new NotFoundException(
        `MonthYear #${uuid} not found`,
      );
    }

    return item;
  }

  // Update month-year
  async update(
    uuid: string,
    dto: UpdateMonthYearDto,
  ): Promise<MonthYear> {
    const item = await this.findOne(uuid);

    const nextMonth = dto.month ?? item.month;
    const nextYear = dto.year ?? item.year;

    // Check duplicate month-year combination
    if (
      dto.month !== undefined ||
      dto.year !== undefined
    ) {
      const duplicate = await this.model.findOne({
        where: {
          month: nextMonth,
          year: nextYear,
          uuid: {
            [Op.ne]: uuid,
          },
        } as any,
        paranoid: false,
      });

      if (duplicate) {
        throw new BadRequestException(
          `Month '${nextMonth}' for ${nextYear} already exists`,
        );
      }
    }

    await item.update(dto);

    return this.findOne(uuid);
  }

  // Soft delete month-year
  async remove(
    uuid: string,
  ): Promise<{ message: string }> {
    const item = await this.findOne(uuid);

    await item.destroy();

    return {
      message: `MonthYear #${uuid} deleted successfully`,
    };
  }

  // Restore deleted month-year
  async restore(
    uuid: string,
  ): Promise<MonthYear> {
    const item = await this.model.findOne({
      where: { uuid } as any,
      paranoid: false,
    });

    if (!item) {
      throw new NotFoundException(
        `MonthYear #${uuid} not found`,
      );
    }

    if (!(item as any).deletedAt) {
      throw new BadRequestException(
        `MonthYear #${uuid} is not deleted`,
      );
    }

    // Prevent restoring a duplicate month-year
    const duplicate = await this.model.findOne({
      where: {
        month: item.month,
        year: item.year,
        uuid: {
          [Op.ne]: uuid,
        },
      } as any,
      paranoid: false,
    });

    if (duplicate) {
      throw new BadRequestException(
        `Month '${item.month}' for ${item.year} already exists`,
      );
    }

    await item.restore();

    return this.findOne(uuid);
  }
}
