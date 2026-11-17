import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { LeadRequirementType } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { LeadRequirement } from 'src/database/models/crm/lead/crm-lead-requirement.model';
import { CreateRequirementTypeDto } from './dto/create-requirement-type.dto';
import { QueryRequirementTypeDto } from './dto/query-requirement-type.dto';
import { UpdateRequirementTypeDto } from './dto/update-requirement-type.dto';

@Injectable()
export class RequirementTypeService {
  constructor(
    @InjectModel(LeadRequirementType) private readonly types: typeof LeadRequirementType,
    @InjectModel(LeadRequirement) private readonly requirements: typeof LeadRequirement,
  ) {}

  async create(dto: CreateRequirementTypeDto, userId?: number, currentUser?: any) {
    const name = dto.name.trim();
    await this.assertUniqueName(name);
    const row = await this.types.create({
      name,
      createdBy: userId ? String(userId) : null,
      updatedBy: null,
      deletedBy: null,
      orgId: dto.orgId ?? currentUser?.orgId ?? null,
    } as any);
    return this.findOne(row.uuid);
  }

  async findAll(query: QueryRequirementTypeDto, currentUser?: any) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    const search = query.search?.trim();
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    const effectiveOrgId = query.orgId ?? currentUser?.orgId;
    if (effectiveOrgId) where.orgId = effectiveOrgId;
    const { rows, count } = await this.types.findAndCountAll({
      attributes: ['uuid', 'name', 'createdBy', 'updatedBy', 'deletedBy', 'createdAt', 'updatedAt', 'deletedAt', 'orgId'],
      where, limit, offset: (page - 1) * limit, order: [['name', 'ASC']], paranoid: !query.withDeleted,
    });
    return {
      data: rows.map(row => this.toPublic(row)),
      meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 },
    };
  }

  async findOne(uuid: string, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.orgId) where.orgId = currentUser.orgId;
    const row = await this.types.findOne({
      where,
      attributes: ['uuid', 'name', 'createdBy', 'updatedBy', 'deletedBy', 'createdAt', 'updatedAt', 'deletedAt', 'orgId'],
      include: [{ association: 'requirements', attributes: ['uuid'], required: false }],
    });
    if (!row) throw new NotFoundException(`Requirement type ${uuid} not found`);
    const result: Record<string, any> = this.toPublic(row);
    result.requirements = (row.requirements ?? []).map(requirement => ({ uuid: requirement.uuid }));
    return result;
  }

  async update(uuid: string, dto: UpdateRequirementTypeDto, userId?: number, currentUser?: any) {
    const row = await this.types.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Requirement type ${uuid} not found`);
    const changes: Record<string, any> = { ...dto };
    if (dto.name !== undefined) {
      changes.name = dto.name.trim();
      await this.assertUniqueName(changes.name, uuid);
    }
    await row.update({
      ...changes,
      updatedBy: userId ? String(userId) : row.updatedBy ?? null,
      ...(dto.orgId !== undefined ? { orgId: dto.orgId } : {}),
    });
    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any) {
    const row = await this.types.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Requirement type ${uuid} not found`);
    await row.update({ deletedBy: userId ? String(userId) : null });
    await row.destroy({ force: false });
    return { message: `Requirement type ${uuid} deleted successfully` };
  }

  async restore(uuid: string, userId?: number, currentUser?: any) {
    const row = await this.types.findOne({ where: { uuid }, paranoid: false });
    if (!row) throw new NotFoundException(`Requirement type ${uuid} not found`);
    if (!row.deletedAt) throw new BadRequestException(`Requirement type ${uuid} is not deleted`);
    await row.restore();
    await row.update({ deletedBy: null, updatedBy: userId ? String(userId) : row.updatedBy ?? null });
    return this.findOne(uuid);
  }

  async dropdown(currentUser?: any) {
    const where: any = {};
    if (currentUser?.orgId) where.orgId = currentUser.orgId;
    const rows = await this.types.findAll({ where, attributes: ['uuid', 'name'], order: [['name', 'ASC']] });
    return rows.map(row => this.toPublic(row));
  }

  private async assertUniqueName(name: string, excludeUuid?: string) {
    const existing = await this.types.findOne({
      where: { name: { [Op.iLike]: name }, ...(excludeUuid ? { uuid: { [Op.ne]: excludeUuid } } : {}) } as any,
      paranoid: false, attributes: ['uuid'],
    });
    if (existing) throw new ConflictException(`Requirement type '${name}' already exists`);
  }

  private toPublic(row: LeadRequirementType) {
    const data = row.toJSON() as Record<string, any>;
    return {
      uuid: data.uuid,
      name: data.name,
      created_by: data.created_by ?? data.createdBy ?? null,
      updated_by: data.updated_by ?? data.updatedBy ?? null,
      deleted_by: data.deleted_by ?? data.deletedBy ?? null,
      created_at: data.created_at ?? data.createdAt,
      updated_at: data.updated_at ?? data.updatedAt,
      ...(data.deleted_at || data.deletedAt ? { deleted_at: data.deleted_at ?? data.deletedAt } : {}),
    };
  }
}
