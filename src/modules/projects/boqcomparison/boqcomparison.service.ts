/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BoqComparison, BoqComparisonStatus } from 'src/database/models/projects/boqcomparison/boq-comparison.model';
import { CreateBoqComparisonDto } from './dto/create-boqcomparison.dto';
import { QueryBoqComparisonDto } from './dto/query-boqcomparison.dto';
import { UpdateBoqComparisonDto } from './dto/update-boqcomparison.dto';


@Injectable()
export class BoqComparisonService {
  constructor(
    @InjectModel(BoqComparison)
    private readonly boqComparisonModel: typeof BoqComparison,
  ) {}

  async create(dto: CreateBoqComparisonDto): Promise<BoqComparison> {
    const boqComparison = await this.boqComparisonModel.create({
      ...dto,
      status: dto.status ?? BoqComparisonStatus.IN_PROGRESS,
    } as any);

    return this.findOne(boqComparison.uuid);
  }

  async findAll(query: QueryBoqComparisonDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      titleOfWork,
      task,
      status,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;

    const offset =
      skip !== undefined && skip !== null ? skip : (page - 1) * limit;

    const where: any = {};
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
          description: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          type: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    if (titleOfWork) {
      where.titleOfWork = titleOfWork;
    }

    if (task) {
      where.task = task;
    }

    if (status) {
      where.status = status;
    }

    const { rows, count } = await this.boqComparisonModel.findAndCountAll({
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

  async findOne(uuid: string): Promise<BoqComparison> {
    const boqComparison = await this.boqComparisonModel.findOne({
      where: { uuid } as any,
    });

    if (!boqComparison) {
      throw new NotFoundException(`BOQ Comparison #${uuid} not found`);
    }

    return boqComparison;
  }

  async update(uuid: string, dto: UpdateBoqComparisonDto): Promise<BoqComparison> {
    const boqComparison = await this.boqComparisonModel.findOne({
      where: { uuid } as any,
    });

    if (!boqComparison) {
      throw new NotFoundException(`BOQ Comparison #${uuid} not found`);
    }

    await boqComparison.update(dto as any);

    return this.findOne(uuid);
  }

  async remove(uuid: string): Promise<{ message: string }> {
    const boqComparison = await this.boqComparisonModel.findOne({
      where: { uuid } as any,
    });

    if (!boqComparison) {
      throw new NotFoundException(`BOQ Comparison #${uuid} not found`);
    }

    await boqComparison.destroy();

    return {
      message: `BOQ Comparison #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string): Promise<BoqComparison> {
    const boqComparison = await this.boqComparisonModel.findOne({
      where: { uuid } as any,
      paranoid: false,
    });

    if (!boqComparison) {
      throw new NotFoundException(`BOQ Comparison #${uuid} not found`);
    }

    if (!boqComparison.deletedAt) {
      throw new BadRequestException(`BOQ Comparison #${uuid} is not deleted`);
    }

    await boqComparison.restore();

    return this.findOne(uuid);
  }
} 

// comment