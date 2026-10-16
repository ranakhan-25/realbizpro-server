/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { CreateBoqDto } from './dto/create-boq.dto';
import { QueryBoqDto } from './dto/query-boq.dto';
import { UpdateBoqDto } from './dto/update-boq.dto';

import { Boq } from 'src/database/models/projects/boq/pr_boq.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';

@Injectable()
export class BoqService {
  constructor(
    @InjectModel(Boq)
    private readonly boqModel: typeof Boq,

    @InjectModel(Project)
    private readonly projectModel: typeof Project,
  ) {}

  // =========================================================
  // CREATE
  // =========================================================
  async create(dto: CreateBoqDto): Promise<Boq> {
    // 1. Project exist kore kina check
    const project = await this.projectModel.findOne({
      where: { uuid: dto.projectId } as any,
    });

    if (!project) {
      throw new NotFoundException(
        `Project with UUID ${dto.projectId} not found`,
      );
    }

    // 2. Boq create
    const boq = await this.boqModel.create(dto as any);

    return this.findOne(boq.uuid);
  }

  // =========================================================
  // FIND ALL
  // =========================================================
  async findAll(query: QueryBoqDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      projectId,
      titleOfWork,
      task,
      uid,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;

    const offset =
      skip !== undefined && skip !== null
        ? skip
        : (page - 1) * limit;

    const where: any = {};

    // -------------------- Filters --------------------
    if (projectId) {
      where.projectId = projectId;
    }

    if (titleOfWork) {
      where.titleOfWork = {
        [Op.iLike]: `%${titleOfWork}%`,
      };
    }

    if (task) {
      where.task = {
        [Op.iLike]: `%${task}%`,
      };
    }

    if (uid) {
      where.uid = {
        [Op.iLike]: `%${uid}%`,
      };
    }

    // -------------------- Search --------------------
    if (search) {
      where[Op.or] = [
        {
          titleOfWork: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          task: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          uid: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          addedBy: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    // -------------------- Safe Sorting --------------------
    const allowedSortFields = [
      'id',
      'createdAt',
      'updatedAt',
      'date',
      'titleOfWork',
      'task',
      'uid',
      'budget',
      'percentageOfTotalBudget',
      'perSftBudget',
      'cost',
      'available',
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    const safeSortOrder = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    // -------------------- Query --------------------
    const { rows, count } = await this.boqModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [[safeSortBy, safeSortOrder]],
      paranoid: !withDeleted,
      include: [
        {
          association: 'project',
          required: false,
        },
      ],
      distinct: true,
    });

    // -------------------- Pagination Meta --------------------
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

  // =========================================================
  // FIND ONE
  // =========================================================
  async findOne(uuid: string): Promise<Boq> {
    const boq = await this.boqModel.findOne({
      where: { uuid } as any,
      include: [
        {
          association: 'project',
          required: false,
        },
      ],
    });

    if (!boq) {
      throw new NotFoundException(`BOQ #${uuid} not found`);
    }

    return boq;
  }

  // =========================================================
  // UPDATE
  // =========================================================
  async update(uuid: string, dto: UpdateBoqDto): Promise<Boq> {
    const boq = await this.boqModel.findOne({
      where: { uuid } as any,
    });

    if (!boq) {
      throw new NotFoundException(`BOQ #${uuid} not found`);
    }

    // Jodi projectId change hoy, validate korun
    if (dto.projectId && dto.projectId !== boq.projectId) {
      const project = await this.projectModel.findOne({
        where: { uuid: dto.projectId } as any,
      });

      if (!project) {
        throw new NotFoundException(
          `Project with UUID ${dto.projectId} not found`,
        );
      }
    }

    await boq.update(dto as any);

    return this.findOne(uuid);
  }

  // =========================================================
  // REMOVE (soft delete)
  // =========================================================
  async remove(uuid: string): Promise<{ message: string }> {
    const boq = await this.boqModel.findOne({
      where: { uuid } as any,
    });

    if (!boq) {
      throw new NotFoundException(`BOQ #${uuid} not found`);
    }

    await boq.destroy();

    return {
      message: `BOQ #${uuid} deleted successfully`,
    };
  }

  // =========================================================
  // RESTORE
  // =========================================================
  async restore(uuid: string): Promise<Boq> {
    const boq = await this.boqModel.findOne({
      where: { uuid } as any,
      paranoid: false,
    });

    if (!boq) {
      throw new NotFoundException(`BOQ #${uuid} not found`);
    }

    if (!boq.deletedAt) {
      throw new BadRequestException(`BOQ #${uuid} is not deleted`);
    }

    await boq.restore();

    return this.findOne(uuid);
  }
}