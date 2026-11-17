import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { LeadCategory } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { CreateLeadCategoryDto } from './dto/create-lead-category.dto';
import { QueryLeadCategoryDto } from './dto/query-lead-category.dto';
import { UpdateLeadCategoryDto } from './dto/update-lead-category.dto';

@Injectable()
export class LeadCategoryService {
  constructor(
    @InjectModel(LeadCategory) private readonly categories: typeof LeadCategory,
    @InjectModel(Lead) private readonly leads: typeof Lead,
  ) {}

  async create(dto: CreateLeadCategoryDto, userId?: number, currentUser?: any) {
    const code = dto.code?.trim() || await this.generateCode();
    const row = await this.categories.create({
      ...dto,
      code,
      name: dto.name.trim(),
      isActive: dto.isActive ?? true,
      createdBy: userId ? String(userId) : dto.createdBy ?? null,
      updatedBy: null,
      deletedBy: null,
      orgId: dto.orgId ?? currentUser?.orgId ?? null,
    } as any);
    return { ...this.toPublicCategory(row), leads: [] };
  }

  async findAll(query: QueryLeadCategoryDto, currentUser?: any) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    const search = query.search?.trim();
    if (search) where[Op.or] = [
      { code: { [Op.iLike]: `%${search}%` } },
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
    if (query.isActive !== undefined) where.isActive = query.isActive;
    const effectiveOrgId = query.orgId ?? currentUser?.orgId;
    if (effectiveOrgId) where.orgId = effectiveOrgId;
    const { rows, count } = await this.categories.findAndCountAll({
      where, limit, offset: (page - 1) * limit, order: [['createdAt', 'DESC']],
      paranoid: !query.withDeleted,
    });
    return {
      data: rows.map(row => this.toPublicCategory(row)),
      meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 },
    };
  }

  async findOne(uuid: string, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.orgId) where.orgId = currentUser.orgId;
    const row = await this.categories.findOne({ where });
    if (!row) throw new NotFoundException(`Lead category ${uuid} not found`);
    const result = this.toPublicCategory(row);
    return { ...result, leads: [] };
  }

  async update(uuid: string, dto: UpdateLeadCategoryDto, userId?: number, currentUser?: any) {
    const row = await this.categories.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Lead category ${uuid} not found`);
    const { createdBy, ...updateData } = dto as any;
    await row.update({
      ...updateData,
      ...(dto.name ? { name: dto.name.trim() } : {}),
      ...(dto.code ? { code: dto.code.trim() } : {}),
      updatedBy: userId ? String(userId) : row.updatedBy ?? null,
      ...(dto.orgId !== undefined ? { orgId: dto.orgId } : {}),
    } as any);
    return { ...this.toPublicCategory(row), leads: [] };
  }

  async remove(uuid: string, userId?: number, currentUser?: any) {
    const row = await this.categories.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Lead category ${uuid} not found`);
    await row.update({ deletedBy: userId ? String(userId) : null } as any);
    await row.destroy({ force: false });
    return { message: `Lead category ${uuid} deleted successfully` };
  }

  async restore(uuid: string, userId?: number, currentUser?: any) {
    const row = await this.categories.findOne({ where: { uuid }, paranoid: false });
    if (!row) throw new NotFoundException(`Lead category ${uuid} not found`);
    if (!row.deletedAt) throw new BadRequestException(`Lead category ${uuid} is not deleted`);
    await row.restore();
    await row.update({ deletedBy: null, updatedBy: userId ? String(userId) : row.updatedBy ?? null } as any);
    return this.findOne(uuid);
  }

  private toPublicCategory(row: LeadCategory) {
    const data = row.toJSON() as Record<string, any>;
    delete data.id;
    data.created_at = data.created_at ?? data.createdAt;
    data.updated_at = data.updated_at ?? data.updatedAt;
    data.deleted_at = data.deleted_at ?? data.deletedAt ?? null;
    delete data.createdAt;
    delete data.updatedAt;
    delete data.deletedAt;
    data.created_by = data.createdBy ?? data.created_by ?? null;
    data.updated_by = data.updatedBy ?? data.updated_by ?? null;
    data.deleted_by = data.deletedBy ?? data.deleted_by ?? null;
    delete data.addedBy;
    delete data.createdBy;
    delete data.updatedBy;
    delete data.deletedBy;
    delete data.projectId;
    return data;
  }

  private async generateCode(): Promise<string> {
    for (let attempt = 0; attempt < 20; attempt++) {
      const code = `LC${Math.floor(1_000_000 + Math.random() * 9_000_000)}`;
      const exists = await this.categories.findOne({ where: { code }, paranoid: false, attributes: ['uuid'] });
      if (!exists) return code;
    }
    throw new BadRequestException('Unable to generate a unique lead category code');
  }
}
