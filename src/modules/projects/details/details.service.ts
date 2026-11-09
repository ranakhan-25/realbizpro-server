/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Details } from 'src/database/models/projects/details/pr_details.model';
import { CreateDetailsDto } from './dto/create-detail.dto';
import { QueryDetailsDto } from './dto/query-detail.dto';
import { UpdateDetailsDto } from './dto/update-detail.dto';


@Injectable()
export class DetailsService {
  constructor(
    @InjectModel(Details)
    private readonly detailsModel: typeof Details,
  ) {}

  async create(
    dto: CreateDetailsDto,
    userId?: number,
    currentUser?: any,
  ): Promise<Details> {
    const details = await this.detailsModel.create({
        createdBy: userId ? String(userId) : null,
        orgId: currentUser?.orgId ?? null,
        projectId: currentUser?.projectId ?? null,
        ...dto,
    } as any);

    return this.findOne(details.uuid);
  }

  async findAll(
    query: QueryDetailsDto,
    currentUser?: any,
  ) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
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
          nameOfLandOwner: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          areaOfLand: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          uid: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { rows, count } = await this.detailsModel.findAndCountAll({
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

  async findOne(uuid: string, currentUser?: any): Promise<Details> {
    const details = await this.detailsModel.findOne({
      where: { uuid } as any,
    });

    if (!details) {
      throw new NotFoundException(`Details #${uuid} not found`);
    }

    return details;
  }

  async update(
    uuid: string,
    dto: UpdateDetailsDto,
    userId?: number,
    currentUser?: any,
  ): Promise<Details> {
    const details = await this.detailsModel.findOne({
      where: { uuid } as any,
    });

    if (!details) {
      throw new NotFoundException(`Details #${uuid} not found`);
    }

    await details.update(dto as any);

    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const details = await this.detailsModel.findOne({
      where: { uuid } as any,
    });

    if (!details) {
      throw new NotFoundException(`Details #${uuid} not found`);
    }

    await details.destroy();

    return {
      message: `Details #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<Details> {
    const details = await this.detailsModel.findOne({
      where: { uuid } as any,
      paranoid: false,
    });

    if (!details) {
      throw new NotFoundException(`Details #${uuid} not found`);
    }

    if (!details.deletedAt) {
      throw new BadRequestException(`Details #${uuid} is not deleted`);
    }

    await details.restore();

    return this.findOne(uuid);
  }
}