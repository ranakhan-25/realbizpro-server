/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { CreateFloorDto } from './dto/create-floor.dto';
import { QueryFloorDto } from './dto/query-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import { Floor } from 'src/database/models/projects/floor/pr_floor_model';


@Injectable()
export class FloorService {
  constructor(
    @InjectModel(Floor)
    private readonly floorModel: typeof Floor,
  ) {}

  async create(
    dto: CreateFloorDto,
    userId?: number,
    currentUser?: any,
  ): Promise<Floor> {
    const floor = await this.floorModel.create(dto as any);
    return this.findOne(floor.uuid);
  }

  async findAll(
    query: QueryFloorDto,
    currentUser?: any,
  ) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      buildingUuid,
      floorName,
      floorCode,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;

    const offset =
      skip !== undefined && skip !== null ? skip : (page - 1) * limit;

    const where: any = {};
    const effectiveOrgId = (query as any)?.orgId ?? currentUser?.orgId;
    if (effectiveOrgId) {
      where.orgId = effectiveOrgId;
    }
    const effectiveProjectId = (query as any)?.projectId ?? currentUser?.projectId;
    if (effectiveProjectId) {
      where.projectId = effectiveProjectId;
    }
    if ((query as any)?.orgId) {
      where.orgId = (query as any).orgId;
    }
    if ((query as any)?.projectId) {
      where.projectId = (query as any).projectId;
    }
    if ((query as any)?.orgId) {
      where.orgId = (query as any).orgId;
    }
    if ((query as any)?.projectId) {
      where.projectId = (query as any).projectId;
    }

    if (search) {
      where[Op.or] = [
        {
          floorName: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          floorCode: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    if (buildingUuid) {
      where.buildingUuid = buildingUuid;
    }

    if (floorName) {
      where.floorName = { [Op.iLike]: `%${floorName}%` };
    }

    if (floorCode) {
      where.floorCode = floorCode;
    }

    const { rows, count } = await this.floorModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      paranoid: !withDeleted,
    });

    const totalPages = Math.ceil(count / limit) || 1;
    const currentPage =
      skip !== undefined && skip !== null
        ? Math.floor(skip / limit) + 1
        : page;

    const nextPage = currentPage < totalPages ? currentPage + 1 : null;
    const previousPage = currentPage > 1 ? currentPage - 1 : null;

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

  async findOne(uuid: string, currentUser?: any): Promise<Floor> {
    const floor = await this.floorModel.findOne({
      where: { uuid } as any,
    });

    if (!floor) {
      throw new NotFoundException(`Floor #${uuid} not found`);
    }

    return floor;
  }

  async update(
    uuid: string,
    dto: UpdateFloorDto,
    userId?: number,
    currentUser?: any,
  ): Promise<Floor> {
    const floor = await this.floorModel.findOne({
      where: { uuid } as any,
    });

    if (!floor) {
      throw new NotFoundException(`Floor #${uuid} not found`);
    }

    await floor.update(dto as any);

    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const floor = await this.floorModel.findOne({
      where: { uuid } as any,
    });

    if (!floor) {
      throw new NotFoundException(`Floor #${uuid} not found`);
    }

    await floor.destroy();

    return {
      message: `Floor #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<Floor> {
    const floor = await this.floorModel.findOne({
      where: { uuid } as any,
      paranoid: false,
    });

    if (!floor) {
      throw new NotFoundException(`Floor #${uuid} not found`);
    }

    if (!floor.deletedAt) {
      throw new BadRequestException(`Floor #${uuid} is not deleted`);
    }

    await floor.restore();

    return this.findOne(uuid);
  }
}