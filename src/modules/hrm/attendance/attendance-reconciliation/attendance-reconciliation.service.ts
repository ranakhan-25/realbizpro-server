/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';

import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model';
import { CreateAttendanceReconciliationDto } from './dto/create-attendance-reconciliation.dto';
import { UpdateAttendanceReconciliationDto } from './dto/update-attendance-reconciliation.dto';
import { QueryAttendanceReconciliationDto } from './dto/query-attendance-reconciliation.dto';
import {
  AttendanceReconciliation,
  AttendanceReconciliationStatus,
} from 'src/database/models/hrm/attendance/attendance_reconciliation_model';

@Injectable()
export class AttendanceReconciliationService {
  constructor(
    @InjectModel(AttendanceReconciliation)
    private readonly attendanceReconciliationModel: typeof AttendanceReconciliation,
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

  // status ↔ isApproved ↔ approvedBy sync
  private resolveApproval(
    status:
      AttendanceReconciliationStatus | undefined,
    addedById?: string,
    approvedBy?: string | null,
  ): Record<string, any> {
    if (!status) {
      return {};
    }

    if (
      status ===
      AttendanceReconciliationStatus.APPROVED
    ) {
      return {
        isApproved: true,
        approvedBy:
          approvedBy ?? addedById ?? null,
      };
    }

    return {
      isApproved: false,
      approvedBy: null,
    };
  }

  // ---------- CRUD ----------

  async create(
    dto: CreateAttendanceReconciliationDto,
    userId?: number,
    currentUser?: any,
  ): Promise<AttendanceReconciliation> {
    await this.ensureEmployeeExists(
      dto.employeeId,
    );

    const status =
      dto.status ??
      AttendanceReconciliationStatus.PENDING;

    const record =
      await this.attendanceReconciliationModel.create(
        {
          ...dto,
          status,
          ...this.resolveApproval(
            status,
            dto.addedById,
            dto.approvedBy,
          ),
          createdBy: userId ? String(userId) : (dto as any).createdBy ?? (dto as any).addedById ?? null,
        orgId: (dto as any).orgId ?? currentUser?.orgId ?? null,
        projectId: (dto as any).projectId ?? currentUser?.projectId ?? null,
        },
      );

    return this.findOne(record.uuid);
  }

  async findAll(
    query: QueryAttendanceReconciliationDto,
    currentUser?: any,
  ) {
    const {
      page = 1,
      limit = 10,
      skip,
      employeeId,
      requestType,
      status,
      isApproved,
      date,
      dateFrom,
      dateTo,
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
    const effectiveOrgId = (query as any)?.orgId ?? currentUser?.orgId;
    if (effectiveOrgId) {
      where.orgId = effectiveOrgId;
    }
    const effectiveProjectId = (query as any)?.projectId ?? currentUser?.projectId;
    if (effectiveProjectId) {
      where.projectId = effectiveProjectId;
    }

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (requestType) {
      where.requestType = requestType;
    }

    if (status) {
      where.status = status;
    }

    if (
      isApproved !== undefined &&
      isApproved !== null
    ) {
      where.isApproved = isApproved;
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

    if (search) {
      where.reason = {
        [Op.iLike]: `%${search}%`,
      };
    }

    const { rows, count } =
      await this.attendanceReconciliationModel.findAndCountAll(
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

  async findOne(uuid: string, currentUser?: any): Promise<AttendanceReconciliation> {
    const record =
      await this.attendanceReconciliationModel.findOne(
        {
          where: { uuid } as any,
        },
      );

    if (!record) {
      throw new NotFoundException(
        `Attendance reconciliation #${uuid} not found`,
      );
    }

    return record;
  }

  async update(uuid: string, dto: UpdateAttendanceReconciliationDto, userId?: number, currentUser?: any): Promise<AttendanceReconciliation> {
    const record =
      await this.attendanceReconciliationModel.findOne(
        {
          where: { uuid } as any,
        },
      );

    if (!record) {
      throw new NotFoundException(
        `Attendance reconciliation #${uuid} not found`,
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

    await record.update({
      ...dto,
      ...this.resolveApproval(
        dto.status,
        dto.addedById,
        dto.approvedBy ?? record.approvedBy,
      ),
      updatedBy:
        dto.addedById ?? record.updatedBy,
    } as any);

    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const record =
      await this.attendanceReconciliationModel.findOne(
        {
          where: { uuid } as any,
        },
      );

    if (!record) {
      throw new NotFoundException(
        `Attendance reconciliation #${uuid} not found`,
      );
    }

    // soft delete
    await record.update({ deletedBy: userId ? String(userId) : null } as any);
    await record.destroy();

    return {
      message: `Attendance reconciliation #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<AttendanceReconciliation> {
    const record =
      await this.attendanceReconciliationModel.findOne(
        {
          where: { uuid } as any,
          paranoid: false,
        },
      );

    if (!record) {
      throw new NotFoundException(
        `Attendance reconciliation #${uuid} not found`,
      );
    }

    if (!record.deletedAt) {
      throw new BadRequestException(
        `Attendance reconciliation #${uuid} is not deleted`,
      );
    }

    await record.restore();
    await record.update({ deletedBy: null, updatedBy: userId ? String(userId) : null } as any);

    return this.findOne(uuid);
  }
}
