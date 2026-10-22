/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { CreateAccountMappingDto } from './dto/create-account-mapping.dto';
import { UpdateAccountMappingDto } from './dto/update-account-mapping.dto';
import { QueryAccountMappingDto } from './dto/query-account-mapping.dto';
import { CategoryAccountMapping } from 'src/database/models/procurement/configuration/products/pr_category_account_mapping.model';
import { Category } from 'src/database/models/procurement/configuration/products/pr_category.model';

@Injectable()
export class AccountMappingService {
  constructor(
    @InjectModel(CategoryAccountMapping)
    private readonly mappingModel: typeof CategoryAccountMapping,

    @InjectModel(Category)
    private readonly categoryModel: typeof Category,
  ) {}

  async create(
    dto: CreateAccountMappingDto,
  ): Promise<CategoryAccountMapping> {
    // Check if Category exists
    const category =
      await this.categoryModel.findOne({
        where: { uuid: dto.categoryId } as any,
      });

    if (!category) {
      throw new NotFoundException(
        `Category #${dto.categoryId} not found`,
      );
    }

    // Check if mapping already exists for this category (assuming 1-to-1)
    const existing =
      await this.mappingModel.findOne({
        where: {
          categoryId: dto.categoryId,
        } as any,
      });

    if (existing) {
      throw new BadRequestException(
        `Account Mapping already exists for Category #${dto.categoryId}`,
      );
    }

    const mapping =
      await this.mappingModel.create({
        ...dto,
        createdBy: dto.addedById,
      } as any);

    return this.findOne(mapping.uuid);
  }

  async findAll(query: QueryAccountMappingDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      categoryId,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;

    const offset =
      skip !== undefined && skip !== null
        ? skip
        : (page - 1) * limit;

    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const { rows, count } =
      await this.mappingModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
        paranoid: !withDeleted,
        include: [
          {
            model: Category,
            as: 'category',
            required: false,
          },
        ],
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

  async findOne(
    uuid: string,
  ): Promise<CategoryAccountMapping> {
    const mapping =
      await this.mappingModel.findOne({
        where: { uuid } as any,
        include: [
          {
            model: Category,
            as: 'category',
            required: false,
          },
        ],
      });

    if (!mapping) {
      throw new NotFoundException(
        `Account Mapping #${uuid} not found`,
      );
    }

    return mapping;
  }

  async update(
    uuid: string,
    dto: UpdateAccountMappingDto,
  ): Promise<CategoryAccountMapping> {
    const mapping =
      await this.mappingModel.findOne({
        where: { uuid } as any,
      });

    if (!mapping) {
      throw new NotFoundException(
        `Account Mapping #${uuid} not found`,
      );
    }

    await mapping.update({
      ...dto,
      updatedBy:
        dto.addedById ?? mapping.updatedBy,
    } as any);

    return this.findOne(uuid);
  }

  async remove(
    uuid: string,
  ): Promise<{ message: string }> {
    const mapping =
      await this.mappingModel.findOne({
        where: { uuid } as any,
      });

    if (!mapping) {
      throw new NotFoundException(
        `Account Mapping #${uuid} not found`,
      );
    }

    await mapping.destroy();

    return {
      message: `Account Mapping #${uuid} deleted successfully`,
    };
  }

  async restore(
    uuid: string,
  ): Promise<CategoryAccountMapping> {
    const mapping =
      await this.mappingModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!mapping) {
      throw new NotFoundException(
        `Account Mapping #${uuid} not found`,
      );
    }

    if (!mapping.deletedAt) {
      throw new BadRequestException(
        `Account Mapping #${uuid} is not deleted`,
      );
    }

    await mapping.restore();

    return this.findOne(uuid);
  }
}
