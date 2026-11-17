import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';

import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { UpdateLeaveTypeDto } from './dto/update-leave-type.dto';
import { QueryLeaveTypeDto } from './dto/query-leave-type.dto';
import {
  LeaveType,
  LeaveTypeStatus,
} from 'src/database/models/hrm/configuration/leave_type_list';

@Injectable()
export class LeaveTypeService {
  constructor(
    @InjectModel(LeaveType)
    private readonly leaveTypeModel: typeof LeaveType,
  ) {}

  async create(
    dto: CreateLeaveTypeDto,
    userId?: number,
    currentUser?: any,
  ): Promise<LeaveType> {
    const record =
      await this.leaveTypeModel.create({
        ...dto,
        createdBy: userId ? String(userId) : (dto as any).createdBy ?? (dto as any).addedById ?? null,
        orgId: (dto as any).orgId ?? currentUser?.orgId ?? null,
        projectId: (dto as any).projectId ?? currentUser?.projectId ?? null,
        status:
          dto.status ?? LeaveTypeStatus.ACTIVE,
      } as any);

    return this.findOne(record.uuid);
  }

  async findAll(query: QueryLeaveTypeDto, currentUser?: any) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
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
    const effectiveOrgId = (query as any)?.orgId ?? currentUser?.orgId;
    if (effectiveOrgId) {
      where.orgId = effectiveOrgId;
    }
    const effectiveProjectId = (query as any)?.projectId ?? currentUser?.projectId;
    if (effectiveProjectId) {
      where.projectId = effectiveProjectId;
    }

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    if (status) {
      where.status = status;
    }

    const { rows, count } =
      await this.leaveTypeModel.findAndCountAll({
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

  async findOne(uuid: string, currentUser?: any): Promise<LeaveType> {
    const record =
      await this.leaveTypeModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Leave type #${uuid} not found`,
      );
    }

    return record;
  }

  async update(uuid: string, dto: UpdateLeaveTypeDto, userId?: number, currentUser?: any): Promise<LeaveType> {
    const record =
      await this.leaveTypeModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Leave type #${uuid} not found`,
      );
    }

    await record.update({
      ...dto,
      updatedBy:
        dto.addedById ?? record.updatedBy,
    } as any);

    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const record =
      await this.leaveTypeModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Leave type #${uuid} not found`,
      );
    }

    // status → inactive + soft delete
    await record.update({
      status: LeaveTypeStatus.INACTIVE,
      deletedBy: userId ? String(userId) : null,
    } as any);

    await record.destroy();

    return {
      message: `Leave type #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<LeaveType> {
    const record =
      await this.leaveTypeModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!record) {
      throw new NotFoundException(
        `Leave type #${uuid} not found`,
      );
    }

    if (!record.deletedAt) {
      throw new BadRequestException(
        `Leave type #${uuid} is not deleted`,
      );
    }

    // status → active + restore
    await record.restore();
    await record.update({
      status: LeaveTypeStatus.ACTIVE,
      deletedBy: null,
      updatedBy: userId ? String(userId) : null,
    } as any);

    return this.findOne(uuid);
  }
}
