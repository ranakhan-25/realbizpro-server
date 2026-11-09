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
  ): Promise<LeaveType> {
    const record =
      await this.leaveTypeModel.create({
        ...dto,
        createdBy: dto.createdBy ?? dto.addedById,
        status:
          dto.status ?? LeaveTypeStatus.ACTIVE,
      });

    return this.findOne(record.uuid);
  }

  async findAll(query: QueryLeaveTypeDto) {
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
    if (query.orgId) {
      where.orgId = query.orgId;
    }
    if ((query as any).projectId) {
      where.projectId = (query as any).projectId;
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

  async findOne(
    uuid: string,
  ): Promise<LeaveType> {
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

  async update(
    uuid: string,
    dto: UpdateLeaveTypeDto,
  ): Promise<LeaveType> {
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
    });

    return this.findOne(uuid);
  }

  async remove(
    uuid: string,
  ): Promise<{ message: string }> {
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
    });

    await record.destroy();

    return {
      message: `Leave type #${uuid} deleted successfully`,
    };
  }

  async restore(
    uuid: string,
  ): Promise<LeaveType> {
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
    });

    return this.findOne(uuid);
  }
}
