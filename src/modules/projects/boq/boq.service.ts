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

@Injectable()
export class BoqService {
  constructor(
    @InjectModel(Boq)
    private readonly boqModel: typeof Boq,
  ) {}

  async create(dto: CreateBoqDto): Promise<Boq> {
    const boq = await this.boqModel.create(dto as any);
    return this.findOne(boq.uuid);
  }

  async findAll(query: QueryBoqDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      titleOfWork,
      task,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;

    const offset =
      skip !== undefined && skip !== null ? skip : (page - 1) * limit;

    const where: any = {};

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
      ];
    }

    if (titleOfWork) {
      where.titleOfWork = titleOfWork;
    }

    if (task) {
      where.task = task;
    }

    const { rows, count } = await this.boqModel.findAndCountAll({
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

  async findOne(uuid: string): Promise<Boq> {
    const boq = await this.boqModel.findOne({
      where: { uuid } as any,
    });

    if (!boq) {
      throw new NotFoundException(`BOQ #${uuid} not found`);
    }

    return boq;
  }

  async update(uuid: string, dto: UpdateBoqDto): Promise<Boq> {
    const boq = await this.boqModel.findOne({
      where: { uuid } as any,
    });

    if (!boq) {
      throw new NotFoundException(`BOQ #${uuid} not found`);
    }

    await boq.update(dto as any);

    return this.findOne(uuid);
  }

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