/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import {
  Unit,
  UnitStatus,
} from 'src/database/models/hrm/employee/hrm_unit_model';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { QueryUnitDto } from './dto/query-unit.dto';

@Injectable()
export class UnitService {
  constructor(
    @InjectModel(Unit)
    private readonly unitModel: typeof Unit,
  ) {}

  async create(
    dto: CreateUnitDto,
    userId?: number,
    currentUser?: any,
  ): Promise<Unit> {
    // name column unique, tai soft-deleted gulo-o check kori
    const existing = await this.unitModel.findOne(
      {
        where: { name: dto.name } as any,
        paranoid: false,
      },
    );

    if (existing) {
      throw new BadRequestException(
        existing.deletedAt
          ? `Unit "${dto.name}" already exists in deleted units, please restore it`
          : `Unit "${dto.name}" already exists`,
      );
    }

    const unit = await this.unitModel.create({
      ...dto,
      createdBy: userId ? String(userId) : (dto as any).createdBy ?? (dto as any).addedById ?? null,
        orgId: (dto as any).orgId ?? currentUser?.orgId ?? null,
        projectId: (dto as any).projectId ?? currentUser?.projectId ?? null,
      status: dto.status ?? UnitStatus.ACTIVE,
    } as any);

    return this.findOne(unit.uuid);
  }

  async findAll(query: QueryUnitDto, currentUser?: any) {
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
      where.name = { [Op.like]: `%${search}%` };
    }

    if (status) {
      where.status = status;
    }

    const { rows, count } =
      await this.unitModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
        paranoid: !withDeleted,
      } as any);

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

  async findOne(uuid: string, currentUser?: any): Promise<Unit> {
    const unit = await this.unitModel.findOne({
      where: { uuid } as any,
    });

    if (!unit) {
      throw new NotFoundException(
        `Unit #${uuid} not found`,
      );
    }

    return unit;
  }

  async update(uuid: string, dto: UpdateUnitDto, userId?: number, currentUser?: any): Promise<Unit> {
    const unit = await this.unitModel.findOne({
      where: { uuid } as any,
    });

    if (!unit) {
      throw new NotFoundException(
        `Unit #${uuid} not found`,
      );
    }

    if (dto.name && dto.name !== unit.name) {
      const exists = await this.unitModel.findOne(
        {
          where: {
            name: dto.name,
            uuid: { [Op.ne]: uuid },
          } as any,
          paranoid: false,
        },
      );

      if (exists) {
        throw new BadRequestException(
          exists.deletedAt
            ? `Unit "${dto.name}" already exists in deleted units`
            : `Unit "${dto.name}" already exists`,
        );
      }
    }

    await unit.update({
      ...dto,
      updatedBy: dto.addedById ?? unit.updatedBy,
    } as any);

    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const unit = await this.unitModel.findOne({
      where: { uuid } as any,
    });

    if (!unit) {
      throw new NotFoundException(
        `Unit #${uuid} not found`,
      );
    }

    // status → inactive + soft delete
    await unit.update({
      status: UnitStatus.INACTIVE,
      deletedBy: userId ? String(userId) : null,
    } as any);

    await unit.destroy();

    return {
      message: `Unit #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<Unit> {
    const unit = await this.unitModel.findOne({
      where: { uuid } as any,
      paranoid: false,
    });

    if (!unit) {
      throw new NotFoundException(
        `Unit #${uuid} not found`,
      );
    }

    if (!unit.deletedAt) {
      throw new BadRequestException(
        `Unit #${uuid} is not deleted`,
      );
    }

    // status → active + restore
    await unit.restore();
    await unit.update({
      status: UnitStatus.ACTIVE,
      deletedBy: null,
      updatedBy: userId ? String(userId) : null,
    } as any);

    return this.findOne(uuid);
  }
}
