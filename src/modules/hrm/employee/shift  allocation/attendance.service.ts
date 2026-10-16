/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import {
  Attendance,
  AttendanceType,
} from 'src/database/models/hrm/employee/hrm_attendance_model';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { QueryAttendanceDto } from './dto/query-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance)
    private readonly attendanceModel: typeof Attendance,
    @InjectModel(EmployeeList)
    private readonly employeeListModel: typeof EmployeeList,
  ) {}

  // ---------- helpers ----------

  private async ensureEmployeeExists(
    employeeId: string,
  ): Promise<void> {
    const employee =
      await this.employeeListModel.findOne({
        where: { uuid: employeeId } as any,
      });

    if (!employee) {
      throw new NotFoundException(
        `Employee #${employeeId} not found`,
      );
    }
  }

  // MonthYear class registered na thakle skip kore (DB FK ta check korbe)
  private async ensureMonthYearExists(
    monthYearId: string,
  ): Promise<void> {
    const assoc: any = (
      this.attendanceModel as any
    ).associations?.monthYear;
    const target: any = assoc?.target;

    if (!target || !target.sequelize) {
      return;
    }

    const monthYear = await target.findOne({
      where: { uuid: monthYearId },
    });

    if (!monthYear) {
      throw new NotFoundException(
        `Month year #${monthYearId} not found`,
      );
    }
  }

  // ---------- CRUD ----------

  async create(
    dto: CreateAttendanceDto,
  ): Promise<Attendance> {
    await this.ensureEmployeeExists(
      dto.employeeId,
    );

    if (dto.monthYearId) {
      await this.ensureMonthYearExists(
        dto.monthYearId,
      );
    }

    const record =
      await this.attendanceModel.create({
        ...dto,
        type: dto.type ?? AttendanceType.WORKDAY,
      } as any);

    return this.findOne(record.uuid);
  }

  async findAll(query: QueryAttendanceDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      employeeId,
      monthYearId,
      date,
      type,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;

    const offset =
      skip !== undefined && skip !== null
        ? skip
        : (page - 1) * limit;

    const where: any = {};

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (monthYearId) {
      where.monthYearId = monthYearId;
    }

    if (date) {
      where.date = date;
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      where[Op.or] = [
        { day: { [Op.iLike]: `%${search}%` } },
        { note: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } =
      await this.attendanceModel.findAndCountAll({
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

  async findOne(
    uuid: string,
  ): Promise<Attendance> {
    const record =
      await this.attendanceModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Attendance #${uuid} not found`,
      );
    }

    return record;
  }

  async update(
    uuid: string,
    dto: UpdateAttendanceDto,
  ): Promise<Attendance> {
    const record =
      await this.attendanceModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Attendance #${uuid} not found`,
      );
    }

    if (
      dto.employeeId &&
      dto.employeeId !== record.employeeId
    ) {
      await this.ensureEmployeeExists(
        dto.employeeId,
      );
    }

    if (
      dto.monthYearId &&
      dto.monthYearId !== record.monthYearId
    ) {
      await this.ensureMonthYearExists(
        dto.monthYearId,
      );
    }

    await record.update(dto as any);

    return this.findOne(uuid);
  }

  async remove(
    uuid: string,
  ): Promise<{ message: string }> {
    const record =
      await this.attendanceModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Attendance #${uuid} not found`,
      );
    }

    // soft delete
    await record.destroy();

    return {
      message: `Attendance #${uuid} deleted successfully`,
    };
  }

  async restore(
    uuid: string,
  ): Promise<Attendance> {
    const record =
      await this.attendanceModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!record) {
      throw new NotFoundException(
        `Attendance #${uuid} not found`,
      );
    }

    if (!record.deletedAt) {
      throw new BadRequestException(
        `Attendance #${uuid} is not deleted`,
      );
    }

    await record.restore();

    return this.findOne(uuid);
  }
}
