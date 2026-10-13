import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { QueryAttendanceDto } from './dto/query-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

import {
  Attendance,
  AttendanceType,
} from 'src/database/models/hrm/employee/hrm_attendance_model';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance)
    private readonly model: typeof Attendance,
  ) {}

  // Create attendance
  async create(
    dto: CreateAttendanceDto,
  ): Promise<Attendance> {
    const item = await this.model.create({
      ...dto,
      type: dto.type ?? AttendanceType.WORKDAY,
    });

    return this.findOne(item.uuid);
  }

  // Get all attendance with search, filters and pagination
  async findAll(query: QueryAttendanceDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const offset =
      query.skip ?? (page - 1) * limit;

    const where: any = {};

    // Search by day or note
    if (query.search?.trim()) {
      const searchTerm = query.search.trim();

      where[Op.or] = [
        {
          day: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        {
          note: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
      ];
    }

    // Filter by employee
    if (query.employeeId) {
      where.employeeId = query.employeeId;
    }

    // Filter by month-year
    if (query.monthYearId) {
      where.monthYearId = query.monthYearId;
    }

    // Filter by date
    if (query.date) {
      where.date = query.date;
    }

    // Filter by attendance type
    if (query.type) {
      where.type = query.type;
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

  // Get attendance by UUID
  async findOne(
    uuid: string,
    withDeleted = false,
  ): Promise<Attendance> {
    const item = await this.model.findOne({
      where: { uuid } as any,
      paranoid: !withDeleted,
    });

    if (!item) {
      throw new NotFoundException(
        `Attendance #${uuid} not found`,
      );
    }

    return item;
  }

  // Update attendance
  async update(
    uuid: string,
    dto: UpdateAttendanceDto,
  ): Promise<Attendance> {
    const item = await this.findOne(uuid);

    await item.update(dto);

    return this.findOne(uuid);
  }

  // Soft delete attendance
  async remove(
    uuid: string,
  ): Promise<{ message: string }> {
    const item = await this.findOne(uuid);

    await item.destroy();

    return {
      message: `Attendance #${uuid} deleted successfully`,
    };
  }

  // Restore deleted attendance
  async restore(
    uuid: string,
  ): Promise<Attendance> {
    const item = await this.model.findOne({
      where: { uuid } as any,
      paranoid: false,
    });

    if (!item) {
      throw new NotFoundException(
        `Attendance #${uuid} not found`,
      );
    }

    if (!(item as any).deletedAt) {
      throw new BadRequestException(
        `Attendance #${uuid} is not deleted`,
      );
    }

    await item.restore();

    return this.findOne(uuid);
  }
}
