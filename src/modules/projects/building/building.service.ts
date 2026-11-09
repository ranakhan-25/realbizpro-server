/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { Building } from 'src/database/models/projects/building/pr_building_model';
import { CreateBuildingDto } from './dto/create-building.dto';
import { QueryBuildingDto } from './dto/query-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';

@Injectable()
export class BuildingService {
  constructor(
    @InjectModel(Building)
    private readonly buildingModel: typeof Building,
  ) {}

  async create(dto: CreateBuildingDto): Promise<Building> {
    const siteUid = dto.siteUid || dto.siteUuid;
    if (!siteUid) {
      throw new BadRequestException('siteUid or siteUuid is required');
    }

    let buildingCode = dto.buildingCode;
    if (!buildingCode || buildingCode.trim() === '') {
      const lastBuilding = await this.buildingModel.findOne({
        order: [['createdAt', 'DESC']],
        paranoid: false,
      });

      let nextNumber = 1;
      const match = lastBuilding?.buildingCode?.match(/BLD-(\d+)/);
      if (match) {
        nextNumber = Number.parseInt(match[1], 10) + 1;
      }
      buildingCode = `BLD-${String(nextNumber).padStart(3, '0')}`;
    }

    try {
      const building = await this.buildingModel.create({
        uid: dto.uid,
        buildingCode,
        buildingName: dto.buildingName,
        floorsCount: dto.floorsCount ?? 0,
        unitsCount: dto.unitsCount ?? 0,
        status: dto.status ?? 'Active',
        siteUid,
        addedBy: dto.addedBy,
        createdBy: dto.createdBy ?? dto.addedBy,
        orgId: dto.orgId,
        projectId: dto.projectId,
      });
      return this.findOne(building.uuid);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          throw new BadRequestException('Building code already exists.');
        }
        if (error.name === 'SequelizeValidationError') {
          throw new BadRequestException(error.message);
        }
      }
      throw error;
    }
  }

  async findAll(query: QueryBuildingDto) {
    const page = Number.parseInt(query.page ?? '1', 10);
    const limit = Number.parseInt(query.limit ?? '10', 10);
    const offset =
      query.skip !== undefined
        ? Number.parseInt(query.skip, 10)
        : (page - 1) * limit;
    const where: Record<string | symbol, unknown> = {};
    if ((query as any)?.orgId) {
      where.orgId = (query as any).orgId;
    }
    if ((query as any)?.projectId) {
      where.projectId = (query as any).projectId;
    }

    if (query.search) {
      where[Op.or] = [
        { buildingName: { [Op.iLike]: `%${query.search}%` } },
        { buildingCode: { [Op.iLike]: `%${query.search}%` } },
      ];
    }
    if (query.buildingName) {
      where.buildingName = { [Op.iLike]: `%${query.buildingName}%` };
    }
    if (query.buildingCode) {
      where.buildingCode = { [Op.iLike]: `%${query.buildingCode}%` };
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.siteUuid || query.siteUid) {
      where.siteUid = query.siteUid || query.siteUuid;
    }

    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'DESC';
    const { rows, count } = await this.buildingModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      paranoid: !query.withDeleted,
    });

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findOne(uuid: string): Promise<Building> {
    const building = await this.buildingModel.findOne({ where: { uuid } });
    if (!building) {
      throw new NotFoundException(`Building ${uuid} not found`);
    }
    return building;
  }

  async update(uuid: string, dto: UpdateBuildingDto): Promise<Building> {
    const building = await this.findOne(uuid);
    const { siteUuid, ...updates } = dto;
    if (siteUuid && !updates.siteUid) {
      updates.siteUid = siteUuid;
    }
    await building.update(updates);
    return this.findOne(uuid);
  }

  async remove(uuid: string): Promise<{ message: string }> {
    const building = await this.findOne(uuid);
    await building.destroy();
    return { message: 'Building deleted successfully' };
  }

  async restore(uuid: string): Promise<Building> {
    const building = await this.buildingModel.findOne({
      where: { uuid },
      paranoid: false,
    });
    if (!building) {
      throw new NotFoundException(`Building ${uuid} not found`);
    }
    if (!building.deletedAt) {
      throw new BadRequestException('Building is not deleted');
    }
    await building.restore();
    return this.findOne(uuid);
  }
}
