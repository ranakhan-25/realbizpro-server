import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Category } from 'src/database/models/procurement/configuration/products/pr_category.model';
import { ProcurementSubCategory } from 'src/database/models/procurement/configuration/products/pr_sub_category.model';
import { BillingSubCategory } from 'src/database/models/projects/billing/pr_sub_category.model';
import { CreateProcurementSubCategoryDto } from './dto/create-sub-category.dto';
import { QueryProcurementSubCategoryDto } from './dto/query-sub-category.dto';
import { UpdateProcurementSubCategoryDto } from './dto/update-sub-category.dto';

@Injectable()
export class ProcurementSubCategoryService {
  constructor(
    @InjectModel(ProcurementSubCategory)
    private readonly subCategoryModel: typeof ProcurementSubCategory,

    @InjectModel(Category)
    private readonly categoryModel: typeof Category,

    @InjectModel(BillingSubCategory)
    private readonly billingSubCategoryModel: typeof BillingSubCategory,
  ) {}

  async create(dto: CreateProcurementSubCategoryDto) {
    const category = await this.categoryModel.findOne({
      where: { uuid: dto.categoryId } as any,
    });

    if (!category) {
      throw new NotFoundException(
        `Category #${dto.categoryId} not found`,
      );
    }

    const duplicate = await this.subCategoryModel.findOne({
      where: { code: dto.code } as any,
    });

    if (duplicate) {
      throw new BadRequestException(
        `Sub category code "${dto.code}" already exists`,
      );
    }

    const subCategory = await this.subCategoryModel.create(
      dto as any,
    );

    return this.findOne(subCategory.uuid);
  }

  async findAll(query: QueryProcurementSubCategoryDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      categoryId,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;
    const offset = skip ?? (page - 1) * limit;
    const where: any = {};
    if ((query as any)?.orgId) where.orgId = (query as any).orgId;
    if ((query as any)?.projectId) where.projectId = (query as any).projectId;

    if (categoryId) where.categoryId = categoryId;
    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } =
      await this.subCategoryModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
        paranoid: !withDeleted,
        include: [
          {
            association: 'category',
            as: 'category',
            attributes: ['uuid', 'code', 'name'],
            required: false,
          },
        ],
      });

    const currentPage = skip !== undefined
      ? Math.floor(offset / limit) + 1
      : page;
    const totalPages = Math.ceil(count / limit) || 1;

    return {
      data: rows,
      meta: {
        total: count,
        page: currentPage,
        pageNo: currentPage,
        limit,
        skip: offset,
        totalPages,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        previousPage: currentPage > 1 ? currentPage - 1 : null,
      },
    };
  }

  async dropdown(categoryId?: string) {
    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    return this.subCategoryModel.findAll({
      where,
      attributes: ['uuid', 'code', 'name', 'categoryId'],
      include: [{
        association: 'category',
        attributes: ['uuid', 'code', 'name', 'type'],
        required: false,
      }],
      order: [['name', 'ASC']],
    });
  }

  async combinedDropdown(categoryId?: string) {
    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    const [procurementSubCategories, billingSubCategories] = await Promise.all([
      this.subCategoryModel.findAll({
        where,
        include: [{
          association: 'category',
          required: false,
        }],
        order: [['name', 'ASC']],
      }),
      this.billingSubCategoryModel.findAll({
        where,
        include: [{
          association: 'category',
          required: false,
        }],
        order: [['name', 'ASC']],
      }),
    ]);
    return [
      ...procurementSubCategories.map((subCategory) => ({
        ...subCategory.toJSON(),
        source: 'procurement',
        type: null,
        description: null,
      })),
      ...billingSubCategories.map((subCategory) => ({
        ...subCategory.toJSON(),
        source: 'projects-billing',
        createdBy: subCategory.createdBy ?? null,
        updatedBy: subCategory.updatedBy ?? null,
        deletedBy: subCategory.deletedBy ?? null,
      })),
    ].sort((left, right) => left.name.localeCompare(right.name));
  }

  async findOne(uuid: string) {
    const subCategory = await this.subCategoryModel.findOne({
      where: { uuid } as any,
      include: [
        {
          association: 'category',
          as: 'category',
          attributes: ['uuid', 'code', 'name'],
          required: false,
        },
      ],
    });

    if (!subCategory) {
      throw new NotFoundException(
        `Sub category #${uuid} not found`,
      );
    }

    return subCategory;
  }

  async update(
    uuid: string,
    dto: UpdateProcurementSubCategoryDto,
  ) {
    const subCategory = await this.subCategoryModel.findOne({
      where: { uuid } as any,
    });

    if (!subCategory) {
      throw new NotFoundException(
        `Sub category #${uuid} not found`,
      );
    }

    if (dto.categoryId) {
      const category = await this.categoryModel.findOne({
        where: { uuid: dto.categoryId } as any,
      });
      if (!category) {
        throw new NotFoundException(
          `Category #${dto.categoryId} not found`,
        );
      }
    }

    if (dto.code && dto.code !== subCategory.code) {
      const duplicate = await this.subCategoryModel.findOne({
        where: {
          code: dto.code,
          uuid: { [Op.ne]: uuid },
        } as any,
      });
      if (duplicate) {
        throw new BadRequestException(
          `Sub category code "${dto.code}" already exists`,
        );
      }
    }

    await subCategory.update(dto as any);
    return this.findOne(uuid);
  }

  async remove(uuid: string) {
    const subCategory = await this.subCategoryModel.findOne({
      where: { uuid } as any,
    });
    if (!subCategory) {
      throw new NotFoundException(
        `Sub category #${uuid} not found`,
      );
    }

    await subCategory.destroy();
    return {
      message: `Sub category #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string) {
    const subCategory = await this.subCategoryModel.findOne({
      where: { uuid } as any,
      paranoid: false,
    });
    if (!subCategory) {
      throw new NotFoundException(
        `Sub category #${uuid} not found`,
      );
    }
    if (!subCategory.deletedAt) {
      throw new BadRequestException(
        `Sub category #${uuid} is not deleted`,
      );
    }

    await subCategory.restore();
    return this.findOne(uuid);
  }
}
