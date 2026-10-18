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

  async create(dto: CreateItemDto) {
    if (dto.categoryId) {
      const cat =
        await this.categoryModel.findByPk(
          dto.categoryId,
        );
      if (!cat)
        throw new BadRequestException(
          `Category not found`,
        );
    }
    if (dto.subCategoryId) {
      const sub =
        await this.subCategoryModel.findByPk(
          dto.subCategoryId,
        );
      if (!sub)
        throw new BadRequestException(
          `SubCategory not found`,
        );
    }

    return this.itemModel.create({ ...dto });
  }

  async findAll(query: QueryItemDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip =
      query.skip !== undefined
        ? Number(query.skip)
        : (page - 1) * limit;

    const where: any = {};

    if (query.categoryId)
      where.categoryId = query.categoryId;
    if (query.subCategoryId)
      where.subCategoryId = query.subCategoryId;

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

  async findOne(uuid: string) {
    const item = await this.itemModel.findOne({
      where: { uuid },
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
    if (!item)
      throw new NotFoundException(
        `Item "${uuid}" not found`,
      );
    return item;
  }

  async update(uuid: string, dto: UpdateItemDto) {
    const item = await this.findOne(uuid);
    await item.update({ ...dto });
    return item;
  }

  async remove(uuid: string) {
    const item = await this.findOne(uuid);
    await item.destroy();
    return {
      message: `Item "${uuid}" deleted successfully`,
    };
  }

  async restore(uuid: string) {
    const item = await this.itemModel.findOne({
      where: { uuid },
      paranoid: false,
    });
    if (!item)
      throw new NotFoundException(
        `Item "${uuid}" not found`,
      );
    if (!item.deletedAt)
      throw new BadRequestException(
        'Item is not deleted',
      );
    await item.restore();
    return item;
  }
}
