/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { QueryItemDto } from './dto/query-item.dto';

import { Item } from 'src/database/models/projects/billing/pr_item.model';
import { BillingCategory } from 'src/database/models/projects/billing/pr_category.model';
import { BillingSubCategory } from 'src/database/models/projects/billing/pr_sub_category.model';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item)
    private readonly itemModel: typeof Item,

    @InjectModel(BillingCategory)
    private readonly categoryModel: typeof BillingCategory,

    @InjectModel(BillingSubCategory)
    private readonly subCategoryModel: typeof BillingSubCategory,
  ) {}

  // Create Item
  async create(
    dto: CreateItemDto,
    userId?: number,
    currentUser?: any,
  ) {
    // Validate category UUID
    if (dto.categoryId) {
      const category =
        await this.categoryModel.findOne({
          where: {
            uuid: dto.categoryId,
          },
        });

      if (!category) {
        throw new BadRequestException(
          'Category not found',
        );
      }
    }

    // Validate subcategory UUID
    if (dto.subCategoryId) {
      const subCategory =
        await this.subCategoryModel.findOne({
          where: {
            uuid: dto.subCategoryId,
          },
        });

      if (!subCategory) {
        throw new BadRequestException(
          'SubCategory not found',
        );
      }

      // Ensure subcategory belongs to the selected category
      if (
        dto.categoryId &&
        subCategory.categoryId !== dto.categoryId
      ) {
        throw new BadRequestException(
          'SubCategory does not belong to the selected category',
        );
      }
    }

    return this.itemModel.create(({
        createdBy: userId ? String(userId) : null,
        orgId: currentUser?.orgId ?? null,
        projectId: currentUser?.projectId ?? null,
        ...dto,
    }) as any);
  }

  // Get All Items with Pagination, Filtering and Search
  async findAll(
    query: QueryItemDto,
    currentUser?: any,
  ) {
    const page = Math.max(
      1,
      Number(query.page) || 1,
    );
    const limit = Math.max(
      1,
      Number(query.limit) || 10,
    );

    const skip =
      query.skip !== undefined
        ? Math.max(0, Number(query.skip) || 0)
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

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.subCategoryId) {
      where.subCategoryId = query.subCategoryId;
    }

    if (query.search) {
      where[Op.or] = [
        {
          itemName: {
            [Op.iLike]: `%${query.search}%`,
          },
        },
        {
          brand: {
            [Op.iLike]: `%${query.search}%`,
          },
        },
      ];
    }

    const { rows, count } =
      await this.itemModel.findAndCountAll({
        where,
        limit,
        offset: skip,
        order: [['createdAt', 'DESC']],
        paranoid: query.withDeleted
          ? false
          : true,
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

  // Get Single Item by UUID
  async findOne(uuid: string, currentUser?: any) {
    const item = await this.itemModel.findOne({
      where: {
        uuid,
      },
      include: [
        {
          model: BillingCategory,
          as: 'category',
        },
        {
          model: BillingSubCategory,
          as: 'subCategory',
        },
      ],
    });

    if (!item) {
      throw new NotFoundException(
        `Item "${uuid}" not found`,
      );
    }

    return item;
  }

  // Update Item by UUID
  async update(
    uuid: string,
    dto: UpdateItemDto,
    userId?: number,
    currentUser?: any,
  ) {
    const item = await this.findOne(uuid);

    // Validate category UUID if supplied
    if (dto.categoryId) {
      const category =
        await this.categoryModel.findOne({
          where: {
            uuid: dto.categoryId,
          },
        });

      if (!category) {
        throw new BadRequestException(
          'Category not found',
        );
      }
    }

    // Validate subcategory UUID if supplied
    if (dto.subCategoryId) {
      const subCategory =
        await this.subCategoryModel.findOne({
          where: {
            uuid: dto.subCategoryId,
          },
        });

      if (!subCategory) {
        throw new BadRequestException(
          'SubCategory not found',
        );
      }

      const categoryIdToCheck =
        dto.categoryId ?? item.categoryId;

      if (
        categoryIdToCheck &&
        subCategory.categoryId !==
          categoryIdToCheck
      ) {
        throw new BadRequestException(
          'SubCategory does not belong to the selected category',
        );
      }
    }

    await item.update(({
      ...dto,
    }) as any);

    return item;
  }

  // Soft Delete Item by UUID
  async remove(uuid: string, userId?: number, currentUser?: any) {
    const item = await this.findOne(uuid);

    await item.destroy();

    return {
      message: `Item "${uuid}" deleted successfully`,
    };
  }

  // Restore Soft-Deleted Item by UUID
  async restore(uuid: string, userId?: number, currentUser?: any) {
    const item = await this.itemModel.findOne({
      where: {
        uuid,
      },
      paranoid: false,
    });

    if (!item) {
      throw new NotFoundException(
        `Item "${uuid}" not found`,
      );
    }

    if (!item.deletedAt) {
      throw new BadRequestException(
        'Item is not deleted',
      );
    }

    await item.restore();

    return item;
  }
}
