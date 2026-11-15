import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ProcurementAssetCategory } from 'src/database/models/procurement/configuration/asset/pr_asset_category.model';
import { CreateProcurementAssetCategoryDto } from './dto/create-asset-category.dto';
import { QueryProcurementAssetCategoryDto } from './dto/query-asset-category.dto';
import { UpdateProcurementAssetCategoryDto } from './dto/update-asset-category.dto';

@Injectable()
export class ProcurementAssetCategoryService {
  constructor(@InjectModel(ProcurementAssetCategory) private readonly categoryModel: typeof ProcurementAssetCategory) {}

  async create(dto: CreateProcurementAssetCategoryDto) {
    const duplicate = await this.categoryModel.findOne({ where: { code: dto.code } as any, paranoid: false });
    if (duplicate) throw new BadRequestException(`Asset category code "${dto.code}" already exists`);
    return this.categoryModel.create({ type: 'Asset', ...dto } as any);
  }

  async findAll(query: QueryProcurementAssetCategoryDto) {
    const { page = 1, limit = 10, skip, search, sortBy = 'createdAt', sortOrder = 'DESC', withDeleted = false } = query;
    const offset = skip ?? (page - 1) * limit;
    const where: any = {};
    if ((query as any)?.orgId) where.orgId = (query as any).orgId;
    if ((query as any)?.projectId) where.projectId = (query as any).projectId;
    if (search) where[Op.or] = [
      { type: { [Op.iLike]: `%${search}%` } },
      { code: { [Op.iLike]: `%${search}%` } },
      { name: { [Op.iLike]: `%${search}%` } },
    ];
    const { rows, count } = await this.categoryModel.findAndCountAll({ where, limit, offset, order: [[sortBy, sortOrder]], paranoid: !withDeleted });
    const currentPage = skip !== undefined ? Math.floor(offset / limit) + 1 : page;
    const totalPages = Math.ceil(count / limit) || 1;
    return { data: rows, meta: { total: count, page: currentPage, pageNo: currentPage, limit, skip: offset, totalPages, nextPage: currentPage < totalPages ? currentPage + 1 : null, previousPage: currentPage > 1 ? currentPage - 1 : null } };
  }

  async findOne(uuid: string) {
    const category = await this.categoryModel.findOne({ where: { uuid } as any });
    if (!category) throw new NotFoundException(`Asset category #${uuid} not found`);
    return category;
  }

  async update(uuid: string, dto: UpdateProcurementAssetCategoryDto) {
    const category = await this.findOne(uuid);
    if (dto.code && dto.code !== category.code) {
      const duplicate = await this.categoryModel.findOne({ where: { code: dto.code, uuid: { [Op.ne]: uuid } } as any, paranoid: false });
      if (duplicate) throw new BadRequestException(`Asset category code "${dto.code}" already exists`);
    }
    await category.update({ ...dto, updatedBy: dto.createdBy ?? category.updatedBy } as any);
    return this.findOne(uuid);
  }

  async remove(uuid: string) { const category = await this.findOne(uuid); await category.destroy(); return { message: `Asset category #${uuid} deleted successfully` }; }

  async restore(uuid: string) {
    const category = await this.categoryModel.findOne({ where: { uuid } as any, paranoid: false });
    if (!category) throw new NotFoundException(`Asset category #${uuid} not found`);
    if (!category.deletedAt) throw new BadRequestException(`Asset category #${uuid} is not deleted`);
    await category.restore();
    return this.findOne(uuid);
  }
}
