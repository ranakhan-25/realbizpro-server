/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { BillingCategory } from 'src/database/models/projects/billing/pr_category.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(BillingCategory)
    private readonly categoryModel: typeof BillingCategory,
  ) {}

  // CREATE
  async create(
    dto: CreateCategoryDto,
    userId?: number,
    currentUser?: any,
  ) {
    const existingCategory =
      await this.categoryModel.findOne({
        where: {
          code: dto.code,
        },
      });

    if (existingCategory) {
      throw new BadRequestException(
        `Category code "${dto.code}" already exists`,
      );
    }

    const category =
      await this.categoryModel.create(({
        type: dto.type,
        code: dto.code,
        name: dto.name,
        description: dto.description,
        createdBy: dto.createdBy,
        updatedBy: dto.updatedBy,
      }) as any);

    return category;
  }

  // GET ALL
  async findAll(
    query: QueryCategoryDto,
    currentUser?: any,
  ) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const skip =
      query.skip !== undefined
        ? Number(query.skip)
        : (page - 1) * limit;

    const where: any = {};
    const effectiveOrgId = (query as any)?.orgId ?? currentUser?.orgId;
    if (effectiveOrgId) {
      where.orgId = effectiveOrgId;
    }
    if ((query as any)?.orgId) {
      where.orgId = (query as any).orgId;
    }
    if ((query as any)?.orgId) {
      where.orgId = (query as any).orgId;
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.search) {
      where[Op.or] = [
        {
          code: {
            [Op.iLike]: `%${query.search}%`,
          },
        },
        {
          name: {
            [Op.iLike]: `%${query.search}%`,
          },
        },
        {
          description: {
            [Op.iLike]: `%${query.search}%`,
          },
        },
      ];
    }

    const { rows, count } =
      await this.categoryModel.findAndCountAll({
        where,
        limit,
        offset: skip,
        order: [['createdAt', 'DESC']],
      });

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        skip,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  // GET ONE
  async findOne(uuid: string, currentUser?: any) {
    const category =
      await this.categoryModel.findOne({
        where: {
          uuid: uuid,
        },
      });

    if (!category) {
      throw new NotFoundException(
        `Category with uuid "${uuid}" not found`,
      );
    }

    return category;
  }

  // UPDATE
  async update(
    uuid: string,
    dto: UpdateCategoryDto,
    userId?: number,
    currentUser?: any,
  ) {
    const category =
      await this.categoryModel.findOne({
        where: {
          uuid: uuid,
        },
      });

    if (!category) {
      throw new NotFoundException(
        `Category with uuid "${uuid}" not found`,
      );
    }

    if (dto.code && dto.code !== category.code) {
      const existingCategory =
        await this.categoryModel.findOne({
          where: {
            code: dto.code,
            uuid: {
              [Op.ne]: uuid,
            },
          },
        });

      if (existingCategory) {
        throw new BadRequestException(
          `Category code "${dto.code}" already exists`,
        );
      }
    }

    await category.update(({
      ...dto,
    }) as any);

    return category;
  }

  // DELETE
  async remove(uuid: string, userId?: number, currentUser?: any) {
    const category =
      await this.categoryModel.findOne({
        where: {
          uuid: uuid,
        },
      });

    if (!category) {
      throw new NotFoundException(
        `Category with uuid "${uuid}" not found`,
      );
    }

    await category.destroy();

    return { message: 'Category deleted successfully' };
  }

  // RESTORE
  async restore(uuid: string, userId?: number, currentUser?: any) {
    const category =
      await this.categoryModel.findOne({
        where: {
          uuid: uuid,
        },
        paranoid: false,
      });

    if (!category) {
      throw new NotFoundException(
        `Category with uuid "${uuid}" not found`,
      );
    }

    if (!category.deletedAt) {
      throw new BadRequestException(
        'Category is not deleted',
      );
    }

    await category.restore();

    return category;
  }
}
