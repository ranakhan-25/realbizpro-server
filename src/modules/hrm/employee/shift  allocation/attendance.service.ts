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

  // Relation class registered na thakle skip kore (DB FK ta check korbe)
  private async ensureRelationExists(
    alias: 'monthYear' | 'department' | 'shift',
    label: string,
    id: string,
  ): Promise<void> {
    const assoc: any = (
      this.attendanceModel as any
    ).associations?.[alias];
    const target: any = assoc?.target;

    if (!target || !target.sequelize) {
      return;
    }

    const found = await target.findOne({
      where: { uuid: id },
    });

    if (!found) {
      throw new NotFoundException(
        `${label} #${id} not found`,
      );
    }
  }

  private async validateRelations(dto: {
    monthYearId?: string | null;
    departmentId?: string | null;
    shiftId?: string | null;
  }): Promise<void> {
    if (dto.monthYearId) {
      await this.ensureRelationExists(
        'monthYear',
        'Month year',
        dto.monthYearId,
      );
    }

    if (dto.departmentId) {
      await this.ensureRelationExists(
        'department',
        'Department',
        dto.departmentId,
      );
    }

    if (dto.shiftId) {
      await this.ensureRelationExists(
        'shift',
        'Shift',
        dto.shiftId,
      );
    }
  }

  // employeeId + date unique (soft-deleted gulo-o count hoy)
  private async ensureUniqueEmployeeDate(
    employeeId: string,
    date: string,
    excludeUuid?: string,
  ): Promise<void> {
    const where: any = { employeeId, date };

    if (excludeUuid) {
      where.uuid = { [Op.ne]: excludeUuid };
    }

    const exists =
      await this.attendanceModel.findOne({
        where,
        paranoid: false,
      });

    if (exists) {
      throw new BadRequestException(
        exists.deletedAt
          ? `Attendance for ${date} already exists in deleted records, please restore it`
          : `Attendance for this employee on ${date} already exists`,
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

    await this.validateRelations(dto);

    await this.ensureUniqueEmployeeDate(
      dto.employeeId,
      dto.date,
    );

    const record =
      await this.attendanceModel.create({
        ...dto,
        createdBy: dto.addedById,
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
      departmentId,
      shiftId,
      isPresent,
      dateFrom,
      dateTo,
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

    if (departmentId) {
      where.departmentId = departmentId;
    }

    if (shiftId) {
      where.shiftId = shiftId;
    }

    if (
      isPresent !== undefined &&
      isPresent !== null
    ) {
      where.isPresent = isPresent;
    }

    if (date) {
      where.date = date;
    } else if (dateFrom || dateTo) {
      where.date = {
        ...(dateFrom
          ? { [Op.gte]: dateFrom }
          : {}),
        ...(dateTo ? { [Op.lte]: dateTo } : {}),
      };
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      where[Op.or] = [
        { day: { [Op.iLike]: `%${search}%` } },
        { note: { [Op.iLike]: `%${search}%` } },
        {
          comment: { [Op.iLike]: `%${search}%` },
        },
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

    await this.validateRelations({
      monthYearId:
        dto.monthYearId !== record.monthYearId
          ? dto.monthYearId
          : undefined,
      departmentId:
        dto.departmentId !== record.departmentId
          ? dto.departmentId
          : undefined,
      shiftId:
        dto.shiftId !== record.shiftId
          ? dto.shiftId
          : undefined,
    });

    const newEmployeeId =
      dto.employeeId ?? record.employeeId;
    const newDate = dto.date ?? record.date;

    if (
      newEmployeeId !== record.employeeId ||
      newDate !== record.date
    ) {
      await this.ensureUniqueEmployeeDate(
        newEmployeeId,
        newDate,
        uuid,
      );
    }

    await record.update({
      ...dto,
      updatedBy:
        dto.addedById ?? record.updatedBy,
    } as any);

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
