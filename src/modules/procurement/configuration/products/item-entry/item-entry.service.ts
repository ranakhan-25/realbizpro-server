import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Category } from 'src/database/models/procurement/configuration/products/pr_category.model';
import { ProcurementBrand } from 'src/database/models/procurement/configuration/products/pr_brand.model';
import { ProcurementItemEntry } from 'src/database/models/procurement/configuration/products/pr_item_entry.model';
import { ProcurementSubCategory } from 'src/database/models/procurement/configuration/products/pr_sub_category.model';
import { ProcurementUnit } from 'src/database/models/procurement/configuration/products/pr_unit.model';
import { CreateProcurementItemEntryDto } from './dto/create-item-entry.dto';
import { QueryProcurementItemEntryDto } from './dto/query-item-entry.dto';
import { UpdateProcurementItemEntryDto } from './dto/update-item-entry.dto';

const associations = [
  { association: 'category', attributes: ['uuid', 'code', 'name'] },
  { association: 'sub_category', attributes: ['uuid', 'code', 'name', 'categoryId'] },
  { association: 'brand', attributes: ['uuid', 'code', 'name'] },
  { association: 'unit', attributes: ['uuid', 'code', 'name', 'conversionUnit', 'rate'] },
];

@Injectable()
export class ProcurementItemEntryService {
  constructor(
    @InjectModel(ProcurementItemEntry) private readonly itemModel: typeof ProcurementItemEntry,
    @InjectModel(Category) private readonly categoryModel: typeof Category,
    @InjectModel(ProcurementSubCategory) private readonly subCategoryModel: typeof ProcurementSubCategory,
    @InjectModel(ProcurementBrand) private readonly brandModel: typeof ProcurementBrand,
    @InjectModel(ProcurementUnit) private readonly unitModel: typeof ProcurementUnit,
  ) {}

  private async validateRelations(values: Partial<CreateProcurementItemEntryDto>) {
    if (values.category_id) {
      const category = await this.categoryModel.findOne({ where: { uuid: values.category_id } as any });
      if (!category) throw new BadRequestException('Selected category does not exist');
    }
    if (values.unit_id) {
      const unit = await this.unitModel.findOne({ where: { uuid: values.unit_id } as any });
      if (!unit) throw new BadRequestException('Selected unit does not exist');
    }
    if (values.brand_id) {
      const brand = await this.brandModel.findOne({ where: { uuid: values.brand_id } as any });
      if (!brand) throw new BadRequestException('Selected brand does not exist');
    }
    if (values.sub_category_id) {
      const subCategory = await this.subCategoryModel.findOne({ where: { uuid: values.sub_category_id } as any });
      if (!subCategory) throw new BadRequestException('Selected sub-category does not exist');
      if (values.category_id && subCategory.categoryId !== values.category_id) {
        throw new BadRequestException('Selected sub-category does not belong to selected category');
      }
      if (!values.category_id) values.category_id = subCategory.categoryId;
    }
  }

  async create(dto: CreateProcurementItemEntryDto) {
    const duplicate = await this.itemModel.findOne({ where: { item_code: dto.item_code } as any });
    if (duplicate) throw new BadRequestException(`Item code "${dto.item_code}" already exists`);
    await this.validateRelations(dto);
    const item = await this.itemModel.create({ purchase_price: 0, sale_price: 0, ...dto } as any);
    return this.findOne(item.uuid);
  }

  async findAll(query: QueryProcurementItemEntryDto) {
    const { page = 1, limit = 10, skip, search, category_id, sub_category_id, sortBy = 'createdAt', sortOrder = 'DESC', withDeleted = false } = query;
    const offset = skip ?? (page - 1) * limit;
    const where: any = {};
    if ((query as any)?.orgId) where.orgId = (query as any).orgId;
    if ((query as any)?.projectId) where.projectId = (query as any).projectId;
    if (category_id) where.category_id = category_id;
    if (sub_category_id) where.sub_category_id = sub_category_id;
    if (search) where[Op.or] = [
      { item_code: { [Op.iLike]: `%${search}%` } },
      { name: { [Op.iLike]: `%${search}%` } },
    ];
    const { rows, count } = await this.itemModel.findAndCountAll({ where, limit, offset, order: [[sortBy, sortOrder]], paranoid: !withDeleted, include: associations });
    const currentPage = skip !== undefined ? Math.floor(offset / limit) + 1 : page;
    const totalPages = Math.ceil(count / limit) || 1;
    return { data: rows, meta: { total: count, page: currentPage, pageNo: currentPage, limit, skip: offset, totalPages, nextPage: currentPage < totalPages ? currentPage + 1 : null, previousPage: currentPage > 1 ? currentPage - 1 : null } };
  }

  async findOne(uuid: string) {
    const item = await this.itemModel.findOne({ where: { uuid } as any, include: associations });
    if (!item) throw new NotFoundException(`Item #${uuid} not found`);
    return item;
  }

  async update(uuid: string, dto: UpdateProcurementItemEntryDto) {
    const item = await this.itemModel.findOne({ where: { uuid } as any });
    if (!item) throw new NotFoundException(`Item #${uuid} not found`);
    const values: any = { ...dto };
    const categoryId = dto.category_id ?? item.category_id;
    const subCategoryId = dto.sub_category_id === undefined ? item.sub_category_id : dto.sub_category_id;
    await this.validateRelations({ ...dto, category_id: categoryId, sub_category_id: subCategoryId ?? undefined });
    if (dto.item_code && dto.item_code !== item.item_code) {
      const duplicate = await this.itemModel.findOne({ where: { item_code: dto.item_code, uuid: { [Op.ne]: uuid } } as any });
      if (duplicate) throw new BadRequestException(`Item code "${dto.item_code}" already exists`);
    }
    await item.update(values);
    return this.findOne(uuid);
  }

  async remove(uuid: string) { const item = await this.itemModel.findOne({ where: { uuid } as any }); if (!item) throw new NotFoundException(`Item #${uuid} not found`); await item.destroy(); return { message: `Item #${uuid} deleted successfully` }; }

  async restore(uuid: string) {
    const item = await this.itemModel.findOne({ where: { uuid } as any, paranoid: false });
    if (!item) throw new NotFoundException(`Item #${uuid} not found`);
    if (!item.deletedAt) throw new BadRequestException(`Item #${uuid} is not deleted`);
    await item.restore(); return this.findOne(uuid);
  }

  async dropdowns(categoryId?: string) {
    const [categories, subCategories, brands, units] = await Promise.all([
      this.categoryModel.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.subCategoryModel.findAll({ where: categoryId ? { categoryId } as any : {}, attributes: ['uuid', 'categoryId', 'code', 'name'], order: [['name', 'ASC']] }),
      this.brandModel.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.unitModel.findAll({ attributes: ['uuid', 'code', 'name', 'conversionUnit', 'rate'], order: [['name', 'ASC']] }),
    ]);
    return { categories, subCategories, brands, units };
  }
}
