/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';

import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { QuerySubCategoryDto } from './dto/query-sub-category.dto';
import { BillingSubCategory } from 'src/database/models/projects/billing/pr_sub_category.madel';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(BillingSubCategory)
    private readonly billingSubCategoryModel: typeof BillingSubCategory,
  ) {}

  // CREATE
  async create(dto: CreateSubCategoryDto) {
    const existingSubCategory =
      await this.billingSubCategoryModel.findOne({
        where: {
          code: dto.code,
        },
      });

    if (existingSubCategory) {
      throw new BadRequestException(
        `Sub category code "${dto.code}" already exists`,
      );
    }

    const subCategory =
      await this.billingSubCategoryModel.create({
        type: dto.type,
        categoryId: dto.categoryId,
        code: dto.code,
        name: dto.name,
        description: dto.description,
        createdBy: dto.createdBy,
        updatedBy: dto.updatedBy,
      });

    return {
      success: true,
      message:
        'Sub category created successfully',
      data: subCategory,
    };
  }

  // GET ALL
  async findAll(query: QuerySubCategoryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const skip =
      query.skip !== undefined
        ? Number(query.skip)
        : (page - 1) * limit;

    const where: any = {};

    // Type filter
    if (query.type) {
      where.type = query.type;
    }

    // Category filter
    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    // Search
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
        {
          categoryId: {
            [Op.iLike]: `%${query.search}%`,
          },
        },
      ];
    }

    const { rows, count } =
      await this.billingSubCategoryModel.findAndCountAll(
        {
          where,
          limit,
          offset: skip,
          order: [['createdAt', 'DESC']],
        },
      );

    return {
      success: true,
      data: {
        data: rows,
        meta: {
          total: count,
          page,
          limit,
          skip,
          totalPages: Math.ceil(count / limit),
        },
      },
    };
  }

  // GET ONE
  async findOne(uuid: string) {
    const subCategory =
      await this.billingSubCategoryModel.findOne({
        where: {
          uuid,
        },
      });

    if (!subCategory) {
      throw new NotFoundException(
        `Sub category with uuid "${uuid}" not found`,
      );
    }

    return {
      success: true,
      data: subCategory,
    };
  }

  // UPDATE
  async update(
    uuid: string,
    dto: UpdateSubCategoryDto,
  ) {
    const subCategory =
      await this.billingSubCategoryModel.findOne({
        where: {
          uuid,
        },
      });

    if (!subCategory) {
      throw new NotFoundException(
        `Sub category with uuid "${uuid}" not found`,
      );
    }

    // Check duplicate code
    if (
      dto.code &&
      dto.code !== subCategory.code
    ) {
      const existingSubCategory =
        await this.billingSubCategoryModel.findOne(
          {
            where: {
              code: dto.code,
              uuid: {
                [Op.ne]: uuid,
              },
            },
          },
        );

      if (existingSubCategory) {
        throw new BadRequestException(
          `Sub category code "${dto.code}" already exists`,
        );
      }
    }

    await subCategory.update({
      ...dto,
    });

    return {
      success: true,
      message:
        'Sub category updated successfully',
      data: subCategory,
    };
  }

  // DELETE
  async remove(uuid: string) {
    const subCategory =
      await this.billingSubCategoryModel.findOne({
        where: {
          uuid,
        },
      });

    if (!subCategory) {
      throw new NotFoundException(
        `Sub category with uuid "${uuid}" not found`,
      );
    }

    await subCategory.destroy();

    return {
      success: true,
      message:
        'Sub category deleted successfully',
    };
  }

  // RESTORE
  async restore(uuid: string) {
    const subCategory =
      await this.billingSubCategoryModel.findOne({
        where: {
          uuid,
        },
        paranoid: false,
      });

    if (!subCategory) {
      throw new NotFoundException(
        `Sub category with uuid "${uuid}" not found`,
      );
    }

    if (!subCategory.deletedAt) {
      throw new BadRequestException(
        'Sub category is not deleted',
      );
    }

    await subCategory.restore();

    return {
      success: true,
      message:
        'Sub category restored successfully',
      data: subCategory,
    };
  }
}
