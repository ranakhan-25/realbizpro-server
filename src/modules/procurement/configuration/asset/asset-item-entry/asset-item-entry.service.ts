import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ProcurementAssetCategory } from 'src/database/models/procurement/configuration/asset/pr_asset_category.model';
import { ProcurementAssetItemEntry } from 'src/database/models/procurement/configuration/asset/pr_asset_item_entry.model';
import { ProcurementBrand } from 'src/database/models/procurement/configuration/products/pr_brand.model';
import { ProcurementUnit } from 'src/database/models/procurement/configuration/products/pr_unit.model';
import { CreateProcurementAssetItemEntryDto } from './dto/create-asset-item-entry.dto';
import { QueryProcurementAssetItemEntryDto } from './dto/query-asset-item-entry.dto';
import { UpdateProcurementAssetItemEntryDto } from './dto/update-asset-item-entry.dto';

const related = [
  { association: 'category', attributes: ['uuid', 'code', 'name'] },
  { association: 'unit', attributes: ['uuid', 'code', 'name'] },
  { association: 'brand', attributes: ['uuid', 'code', 'name'], required: false },
];

@Injectable()
export class ProcurementAssetItemEntryService {
  constructor(
    @InjectModel(ProcurementAssetItemEntry) private readonly itemModel: typeof ProcurementAssetItemEntry,
    @InjectModel(ProcurementAssetCategory) private readonly categoryModel: typeof ProcurementAssetCategory,
    @InjectModel(ProcurementUnit) private readonly unitModel: typeof ProcurementUnit,
    @InjectModel(ProcurementBrand) private readonly brandModel: typeof ProcurementBrand,
  ) {}

  private async validateRelations(dto: Partial<CreateProcurementAssetItemEntryDto>) {
    if (dto.category_id && !await this.categoryModel.findOne({ where: { uuid: dto.category_id } as any })) {
      throw new BadRequestException('Selected asset category does not exist');
    }
    if (dto.unit_id && !await this.unitModel.findOne({ where: { uuid: dto.unit_id } as any })) {
      throw new BadRequestException('Selected unit does not exist');
    }
    if (dto.brand_id && !await this.brandModel.findOne({ where: { uuid: dto.brand_id } as any })) {
      throw new BadRequestException('Selected brand does not exist');
    }
  }

  private makeCode() {
    return `AST-${Date.now()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  }

  async create(dto: CreateProcurementAssetItemEntryDto) {
    await this.validateRelations(dto);
    const code = dto.item_code || this.makeCode();
    const existing = await this.itemModel.findOne({ where: { item_code: code } as any, paranoid: false });
    if (existing) throw new BadRequestException(`Asset item code "${code}" already exists`);
    const item = await this.itemModel.create({ ...dto, item_code: code, purchase_price: dto.purchase_price ?? 0 } as any);
    return this.findOne(item.uuid);
  }

  async findAll(query: QueryProcurementAssetItemEntryDto) {
    const { page = 1, limit = 10, skip, search, category_id, brand_id, sortBy = 'createdAt', sortOrder = 'DESC', withDeleted = false } = query;
    const offset = skip ?? (page - 1) * limit;
    const where: any = {};
    if (category_id) where.category_id = category_id;
    if (brand_id) where.brand_id = brand_id;
    if (search) where[Op.or] = [
      { item_code: { [Op.iLike]: `%${search}%` } },
      { name: { [Op.iLike]: `%${search}%` } },
    ];
    const { rows, count } = await this.itemModel.findAndCountAll({ where, limit, offset, order: [[sortBy, sortOrder]], paranoid: !withDeleted, include: related });
    const currentPage = skip !== undefined ? Math.floor(offset / limit) + 1 : page;
    const totalPages = Math.ceil(count / limit) || 1;
    return { data: rows, meta: { total: count, page: currentPage, pageNo: currentPage, limit, skip: offset, totalPages, nextPage: currentPage < totalPages ? currentPage + 1 : null, previousPage: currentPage > 1 ? currentPage - 1 : null } };
  }

  async findOne(uuid: string) {
    const item = await this.itemModel.findOne({ where: { uuid } as any, include: related });
    if (!item) throw new NotFoundException(`Asset item #${uuid} not found`);
    return item;
  }

  async update(uuid: string, dto: UpdateProcurementAssetItemEntryDto) {
    const item = await this.itemModel.findOne({ where: { uuid } as any });
    if (!item) throw new NotFoundException(`Asset item #${uuid} not found`);
    await this.validateRelations(dto);
    if (dto.item_code && dto.item_code !== item.item_code) {
      const duplicate = await this.itemModel.findOne({ where: { item_code: dto.item_code, uuid: { [Op.ne]: uuid } } as any, paranoid: false });
      if (duplicate) throw new BadRequestException(`Asset item code "${dto.item_code}" already exists`);
    }
    await item.update({ ...dto, updatedBy: dto.createdBy ?? item.updatedBy });
    return this.findOne(uuid);
  }

  async remove(uuid: string) {
    const item = await this.itemModel.findOne({ where: { uuid } as any });
    if (!item) throw new NotFoundException(`Asset item #${uuid} not found`);
    await item.destroy();
    return { message: `Asset item #${uuid} deleted successfully` };
  }

  async restore(uuid: string) {
    const item = await this.itemModel.findOne({ where: { uuid } as any, paranoid: false });
    if (!item) throw new NotFoundException(`Asset item #${uuid} not found`);
    if (!item.deletedAt) throw new BadRequestException(`Asset item #${uuid} is not deleted`);
    await item.restore();
    return this.findOne(uuid);
  }

  async dropdowns() {
    const [categories, brands, units] = await Promise.all([
      this.categoryModel.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.brandModel.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.unitModel.findAll({ attributes: ['uuid', 'code', 'name', 'conversionUnit', 'rate'], order: [['name', 'ASC']] }),
    ]);
    // There is no chart-of-groups model/table in this backend repository yet.
    return { categories, brands, units, chartOfGroups: [] };
  }
}
