/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  InjectConnection,
  InjectModel,
} from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from 'src/database/models/procurement/configuration/products/pr_category.model';
import { CategoryAccountMapping } from 'src/database/models/procurement/configuration/products/pr_category_account_mapping.model';
import { ProcurementSubCategory } from 'src/database/models/procurement/configuration/products/pr_sub_category.model';
import { BillingCategory } from 'src/database/models/projects/billing/pr_category.model';
import type { QueryCategoryDto } from './dto/query-catefory.dto';


@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private readonly categoryModel: typeof Category,

    @InjectModel(CategoryAccountMapping)
    private readonly mappingModel: typeof CategoryAccountMapping,

    @InjectModel(BillingCategory)
    private readonly billingCategoryModel: typeof BillingCategory,

    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async create(
    dto: CreateCategoryDto,
  ): Promise<Category> {
    const existing =
      await this.categoryModel.findOne({
        where: { code: dto.code } as any,
      });

    if (existing) {
      throw new BadRequestException(
        `Category with code "${dto.code}" already exists`,
      );
    }

    const transaction =
      await this.sequelize.transaction();

    try {
      const category =
        await this.categoryModel.create(
          {
            ...dto,
            createdBy: dto.addedById,
          } as any,
          { transaction },
        );

      if (dto.accountMapping) {
        await this.mappingModel.create(
          {
            ...dto.accountMapping,
            categoryId: category.uuid,
            createdBy: dto.addedById,
          } as any,
          { transaction },
        );
      }

      await transaction.commit();
      return this.findOne(category.uuid);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findAll(query: QueryCategoryDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      type,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;

    const offset =
      skip !== undefined && skip !== null
        ? skip
        : (page - 1) * limit;

    const where: any = {};
    if ((query as any)?.orgId) where.orgId = (query as any).orgId;
    if ((query as any)?.projectId) where.projectId = (query as any).projectId;

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (type) {
      where.type = type;
    }

    const { rows, count } =
      await this.categoryModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
        paranoid: !withDeleted,
        include: [
          {
            association: 'accountMapping',
            as: 'accountMapping',
            required: false,
          },
          {
            association: 'subCategories',
            attributes: ['uuid', 'code', 'name', 'categoryId'],
            required: false,
            separate: true,
            order: [['name', 'ASC']],
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

  async findOne(uuid: string): Promise<Category> {
    const category =
      await this.categoryModel.findOne({
        where: { uuid } as any,
        include: [
          {
            association: 'accountMapping',
            as: 'accountMapping',
            required: false,
          },
          {
            association: 'subCategories',
            attributes: ['uuid', 'code', 'name', 'categoryId'],
            required: false,
            separate: true,
            order: [['name', 'ASC']],
          },
        ],
      });

    if (!category) {
      throw new NotFoundException(
        `Category #${uuid} not found`,
      );
    }

    return category;
  }

  async dropdown(type?: string) {
    const where: any = {};
    if (type) where.type = type;
    return this.categoryModel.findAll({
      where,
      attributes: ['uuid', 'code', 'name', 'type'],
      order: [['name', 'ASC']],
    });
  }

  async combinedDropdown(type?: string) {
    const procurementWhere: any = {};
    const billingWhere: any = {};
    if (type) {
      procurementWhere.type = type;
      billingWhere.type = type;
    }
    const [procurementCategories, billingCategories] = await Promise.all([
      this.categoryModel.findAll({
        where: procurementWhere,
        order: [['name', 'ASC']],
      }),
      this.billingCategoryModel.findAll({
        where: billingWhere,
        order: [['name', 'ASC']],
      }),
    ]);
    return [
      ...procurementCategories.map((category) => ({
        ...category.toJSON(),
        source: 'procurement',
        description: null,
      })),
      ...billingCategories.map((category) => ({
        ...category.toJSON(),
        source: 'projects-billing',
        uid: null,
        addedById: null,
      })),
    ].sort((left, right) => left.name.localeCompare(right.name));
  }

  async update(
    uuid: string,
    dto: UpdateCategoryDto,
  ): Promise<Category> {
    const category =
      await this.categoryModel.findOne({
        where: { uuid } as any,
      });

    if (!category) {
      throw new NotFoundException(
        `Category #${uuid} not found`,
      );
    }

    if (dto.code && dto.code !== category.code) {
      const exists =
        await this.categoryModel.findOne({
          where: {
            code: dto.code,
            uuid: { [Op.ne]: uuid },
          } as any,
        });
      if (exists) {
        throw new BadRequestException(
          `Category with code "${dto.code}" already exists`,
        );
      }
    }

    const transaction =
      await this.sequelize.transaction();

    try {
      await category.update(
        {
          ...dto,
          updatedBy:
            dto.addedById ?? category.updatedBy,
        } as any,
        { transaction },
      );

      if (dto.accountMapping) {
        const existingMapping =
          await this.mappingModel.findOne({
            where: { categoryId: uuid } as any,
            transaction,
          });

        if (existingMapping) {
          await existingMapping.update(
            {
              ...dto.accountMapping,
              updatedBy:
                dto.addedById ??
                category.updatedBy,
            } as any,
            { transaction },
          );
        } else {
          await this.mappingModel.create(
            {
              ...dto.accountMapping,
              categoryId: uuid,
              createdBy: dto.addedById,
            } as any,
            { transaction },
          );
        }
      }

      await transaction.commit();
      return this.findOne(uuid);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async remove(
    uuid: string,
  ): Promise<{ message: string }> {
    const category =
      await this.categoryModel.findOne({
        where: { uuid } as any,
      });

    if (!category) {
      throw new NotFoundException(
        `Category #${uuid} not found`,
      );
    }

    await category.destroy();

    return {
      message: `Category #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string): Promise<Category> {
    const category =
      await this.categoryModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!category) {
      throw new NotFoundException(
        `Category #${uuid} not found`,
      );
    }

    if (!category.deletedAt) {
      throw new BadRequestException(
        `Category #${uuid} is not deleted`,
      );
    }

    await category.restore();

    return this.findOne(uuid);
  }
}
