/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import {
  LeaveApplication,
  LeaveApplicationStatus,
} from 'src/database/models/hrm/leaveapplication/leaveapplication_modes';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model';
import { LeaveType } from 'src/database/models/hrm/configuration/leave_type_list';
import { CreateLeaveApplicationDto } from './dto/create-leave-application.dto';
import { UpdateLeaveApplicationDto } from './dto/update-leave-application.dto';
import { QueryLeaveApplicationDto } from './dto/query-leave-application.dto';

@Injectable()
export class LeaveApplicationService {
  private readonly relationIncludes = [
    {
      association: 'employee',
      required: false,
    },
    {
      association: 'leaveType',
      required: false,
    },
  ];

  constructor(
    @InjectModel(LeaveApplication)
    private readonly leaveApplicationModel: typeof LeaveApplication,
    @InjectModel(EmployeeList)
    private readonly employeeModel: typeof EmployeeList,
    @InjectModel(LeaveType)
    private readonly leaveTypeModel: typeof LeaveType,
  ) {}

  // ---------- helpers ----------

  private async ensureRelationsExist(
    data: Record<string, any>,
    current?: Record<string, any>,
  ): Promise<void> {
    const checks: [string, any, string][] = [
      [
        'employeeId',
        this.employeeModel,
        'Employee',
      ],
      [
        'leaveTypeId',
        this.leaveTypeModel,
        'Leave type',
      ],
    ];

    for (const [key, model, label] of checks) {
      const value = data[key];

      if (value && value !== current?.[key]) {
        const found = await model.findOne({
          where: { uuid: value },
        });

        if (!found) {
          throw new NotFoundException(
            `${label} #${value} not found`,
          );
        }
      }
    }
  }

  private validateDates(
    fromDate: string,
    toDate: string,
  ): void {
    if (
      new Date(toDate).getTime() <
      new Date(fromDate).getTime()
    ) {
      throw new BadRequestException(
        'To date cannot be before from date',
      );
    }
  }

  // ---------- CRUD ----------

  async create(
    dto: CreateLeaveApplicationDto,
  ): Promise<LeaveApplication> {
    this.validateDates(dto.fromDate, dto.toDate);
    await this.ensureRelationsExist(dto);

    const record =
      await this.leaveApplicationModel.create({
        ...dto,
        createdBy: dto.addedById,
        status:
          dto.status ??
          LeaveApplicationStatus.PENDING,
      });

    return this.findOne(record.uuid);
  }

  async findAll(query: QueryLeaveApplicationDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      employeeId,
      leaveTypeId,
      status,
      fromDateFrom,
      fromDateTo,
      toDateFrom,
      toDateTo,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withRelations = false,
      withDeleted = false,
    } = query;

    const offset =
      skip !== undefined && skip !== null
        ? skip
        : (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.reason = {
        [Op.like]: `%${search}%`,
      };
    }

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (leaveTypeId) {
      where.leaveTypeId = leaveTypeId;
    }

    if (status) {
      where.status = status;
    }

    if (fromDateFrom && fromDateTo) {
      where.fromDate = {
        [Op.between]: [fromDateFrom, fromDateTo],
      };
    } else if (fromDateFrom) {
      where.fromDate = { [Op.gte]: fromDateFrom };
    } else if (fromDateTo) {
      where.fromDate = { [Op.lte]: fromDateTo };
    }

    if (toDateFrom && toDateTo) {
      where.toDate = {
        [Op.between]: [toDateFrom, toDateTo],
      };
    } else if (toDateFrom) {
      where.toDate = { [Op.gte]: toDateFrom };
    } else if (toDateTo) {
      where.toDate = { [Op.lte]: toDateTo };
    }

    const { rows, count } =
      await this.leaveApplicationModel.findAndCountAll(
        {
          where,
          include: withRelations
            ? (this.relationIncludes as any)
            : undefined,
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
    withRelations = false,
  ): Promise<LeaveApplication> {
    const record =
      await this.leaveApplicationModel.findOne({
        where: { uuid } as any,
        include: withRelations
          ? (this.relationIncludes as any)
          : undefined,
      });

    if (!record) {
      throw new NotFoundException(
        `Leave application #${uuid} not found`,
      );
    }

    return record;
  }

  async update(
    uuid: string,
    dto: UpdateLeaveApplicationDto,
  ): Promise<LeaveApplication> {
    const record =
      await this.leaveApplicationModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Leave application #${uuid} not found`,
      );
    }

    this.validateDates(
      dto.fromDate ?? record.fromDate,
      dto.toDate ?? record.toDate,
    );

    await this.ensureRelationsExist(dto, record);

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
      await this.leaveApplicationModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Leave application #${uuid} not found`,
      );
    }

    // status → cancelled + soft delete
    await record.update({
      status: LeaveApplicationStatus.CANCELLED,
    });

    await record.destroy();

    return {
      message: `Leave application #${uuid} deleted successfully`,
    };
  }

  async restore(
    uuid: string,
  ): Promise<LeaveApplication> {
    const record =
      await this.leaveApplicationModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!record) {
      throw new NotFoundException(
        `Leave application #${uuid} not found`,
      );
    }

    if (!record.deletedAt) {
      throw new BadRequestException(
        `Leave application #${uuid} is not deleted`,
      );
    }

    await record.restore();
    await record.update({
      status: LeaveApplicationStatus.PENDING,
    });

    return this.findOne(uuid);
  }
}
