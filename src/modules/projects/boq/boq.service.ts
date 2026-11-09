/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import { Boq } from 'src/database/models/projects/boq/pr_boq.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { CreateBoqDto } from './dto/create-boq.dto';
import { UpdateBoqDto } from './dto/update-boq.dto';
import { QueryBoqDto } from './dto/query-boq.dto';

@Injectable()
export class BoqService {
  constructor(
    @InjectModel(Boq)
    private readonly boqModel: typeof Boq,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
  ) {}

  // ---------- helpers ----------

  private async ensureProjectExists(
    projectId: string,
  ): Promise<void> {
    const project = await this.projectModel.findOne({
      where: { uuid: projectId } as any,
    });

    if (!project) {
      throw new NotFoundException(
        `Project #${projectId} not found`,
      );
    }
  }

  // ---------- CRUD ----------

  async create(dto: CreateBoqDto): Promise<Boq> {
    if (dto.projectId) {
      await this.ensureProjectExists(dto.projectId);
    }

    const record = await this.boqModel.create({
      ...dto,
      createdBy: dto.addedById,
    } as any);

    return this.findOne(record.uuid);
  }

  async findAll(query: QueryBoqDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      projectId,
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

    if (projectId) {
      where.projectId = projectId;
    }

    if (date) {
      where.date = date;
    } else if (dateFrom || dateTo) {
      where.date = {
        ...(dateFrom ? { [Op.gte]: dateFrom } : {}),
        ...(dateTo ? { [Op.lte]: dateTo } : {}),
      };
    }

    if (search) {
      where[Op.or] = [
        { uid: { [Op.iLike]: `%${search}%` } },
        { titleOfWork: { [Op.iLike]: `%${search}%` } },
        { task: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } =
      await this.boqModel.findAndCountAll({
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

  async findOne(uuid: string): Promise<Boq> {
    const record = await this.boqModel.findOne({
      where: { uuid } as any,
    });

    if (!record) {
      throw new NotFoundException(
        `BOQ #${uuid} not found`,
      );
    }

    return record;
  }

  async update(
    uuid: string,
    dto: UpdateBoqDto,
  ): Promise<Boq> {
    const record = await this.boqModel.findOne({
      where: { uuid } as any,
    });

    if (!record) {
      throw new NotFoundException(
        `BOQ #${uuid} not found`,
      );
    }

    if (
      dto.projectId &&
      dto.projectId !== record.projectId
    ) {
      await this.ensureProjectExists(dto.projectId);
    }

    await record.update({
      ...dto,
      updatedBy: dto.addedById ?? record.updatedBy,
    } as any);

    return this.findOne(uuid);
  }

  async remove(
    uuid: string,
  ): Promise<{ message: string }> {
    const record = await this.boqModel.findOne({
      where: { uuid } as any,
    });

    if (!record) {
      throw new NotFoundException(
        `BOQ #${uuid} not found`,
      );
    }

    // soft delete
    await record.destroy();

    return {
      message: `BOQ #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string): Promise<Boq> {
    const record = await this.boqModel.findOne({
      where: { uuid } as any,
      paranoid: false,
    });

    if (!record) {
      throw new NotFoundException(
        `BOQ #${uuid} not found`,
      );
    }

    if (!record.deletedAt) {
      throw new BadRequestException(
        `BOQ #${uuid} is not deleted`,
      );
    }

    await record.restore();

    return this.findOne(uuid);
  }
}
