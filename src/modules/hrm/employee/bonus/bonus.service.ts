/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import {
  Bonus,
  BonusStatus,
} from 'src/database/models/hrm/employee/hrm_bonus_model';
import { CreateBonusDto } from './dto/create-bonus.dto';
import { UpdateBonusDto } from './dto/update-bonus.dto';
import { QueryBonusDto } from './dto/query-bonus.dto';

@Injectable()
export class BonusService {
  constructor(
    @InjectModel(Bonus)
    private readonly bonusModel: typeof Bonus,
  ) {}

  async create(
    dto: CreateBonusDto,
    userId?: number,
    currentUser?: any,
  ): Promise<Bonus> {
    // same name + same festival date duplicate block
    // (same name different year allowed, e.g. Eid bonus every year)
    const existing =
      await this.bonusModel.findOne({
        where: {
          name: dto.name,
          festivalDate: dto.festivalDate,
        } as any,
      });

    if (existing) {
      throw new BadRequestException(
        `Bonus "${dto.name}" already exists for ${dto.festivalDate}`,
      );
    }

    const bonus = await this.bonusModel.create({
      ...dto,
      createdBy: userId ? String(userId) : (dto as any).createdBy ?? (dto as any).addedById ?? null,
        orgId: (dto as any).orgId ?? currentUser?.orgId ?? null,
        projectId: (dto as any).projectId ?? currentUser?.projectId ?? null,
      status: dto.status ?? BonusStatus.ACTIVE,
    } as any);

    return this.findOne(bonus.uuid);
  }

  async findAll(query: QueryBonusDto, currentUser?: any) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      status,
      festivalDateFrom,
      festivalDateTo,
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

    if (festivalDateFrom && festivalDateTo) {
      where.festivalDate = {
        [Op.between]: [
          festivalDateFrom,
          festivalDateTo,
        ],
      };
    } else if (festivalDateFrom) {
      where.festivalDate = {
        [Op.gte]: festivalDateFrom,
      };
    } else if (festivalDateTo) {
      where.festivalDate = {
        [Op.lte]: festivalDateTo,
      };
    }

    const { rows, count } =
      await this.bonusModel.findAndCountAll({
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

  async findOne(uuid: string, currentUser?: any): Promise<Bonus> {
    const bonus = await this.bonusModel.findOne({
      where: { uuid } as any,
    });

    if (!bonus) {
      throw new NotFoundException(
        `Bonus #${uuid} not found`,
      );
    }

    return bonus;
  }

  async update(uuid: string, dto: UpdateBonusDto, userId?: number, currentUser?: any): Promise<Bonus> {
    const bonus = await this.bonusModel.findOne({
      where: { uuid } as any,
    });

    if (!bonus) {
      throw new NotFoundException(
        `Bonus #${uuid} not found`,
      );
    }

    const newName = dto.name ?? bonus.name;
    const newDate =
      dto.festivalDate ?? bonus.festivalDate;

    if (dto.name || dto.festivalDate) {
      const exists =
        await this.bonusModel.findOne({
          where: {
            name: newName,
            festivalDate: newDate,
            uuid: { [Op.ne]: uuid },
          } as any,
        });

      if (exists) {
        throw new BadRequestException(
          `Bonus "${newName}" already exists for this festival date`,
        );
      }
    }

    await bonus.update({
      ...dto,
      updatedBy: dto.addedById ?? bonus.updatedBy,
    } as any);

    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const bonus = await this.bonusModel.findOne({
      where: { uuid } as any,
    });

    if (!bonus) {
      throw new NotFoundException(
        `Bonus #${uuid} not found`,
      );
    }

    // status → inactive + soft delete
    await bonus.update({
      status: BonusStatus.INACTIVE,
      deletedBy: userId ? String(userId) : null,
    } as any);

    await bonus.destroy();

    return {
      message: `Bonus #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<Bonus> {
    const bonus = await this.bonusModel.findOne({
      where: { uuid } as any,
      paranoid: false,
    });

    if (!bonus) {
      throw new NotFoundException(
        `Bonus #${uuid} not found`,
      );
    }

    if (!bonus.deletedAt) {
      throw new BadRequestException(
        `Bonus #${uuid} is not deleted`,
      );
    }

    // status → active + restore
    await bonus.restore();
    await bonus.update({
      status: BonusStatus.ACTIVE,
      deletedBy: null,
      updatedBy: userId ? String(userId) : null,
    } as any);

    return this.findOne(uuid);
  }
}
