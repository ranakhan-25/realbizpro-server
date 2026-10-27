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

  async create(dto: CreateRequirementTypeDto, createdBy?: string) {
    const name = dto.name.trim();
    await this.assertUniqueName(name);
    const row = await this.types.create({ name, createdBy } as any);
    return this.findOne(row.uuid);
  }

  async findAll(query: QueryRequirementTypeDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    const search = query.search?.trim();
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    const { rows, count } = await this.types.findAndCountAll({
      attributes: ['uuid', 'name', 'createdBy', 'createdAt', 'updatedAt', 'deletedAt'],
      where, limit, offset: (page - 1) * limit, order: [['name', 'ASC']], paranoid: !query.withDeleted,
    });
    return {
      data: rows.map(row => this.toPublic(row)),
      meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 },
    };
  }

  async findOne(uuid: string) {
    const row = await this.types.findOne({
      where: { uuid },
      attributes: ['uuid', 'name', 'createdBy', 'createdAt', 'updatedAt', 'deletedAt'],
      include: [{ association: 'requirements', attributes: ['uuid'], required: false }],
    });
    if (!row) throw new NotFoundException(`Requirement type ${uuid} not found`);
    const result: Record<string, any> = this.toPublic(row);
    result.requirements = (row.requirements ?? []).map(requirement => ({ uuid: requirement.uuid }));
    return result;
  }

  async update(uuid: string, dto: UpdateRequirementTypeDto, updatedBy?: string) {
    const row = await this.types.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Requirement type ${uuid} not found`);
    const changes: Record<string, any> = { ...dto };
    if (dto.name !== undefined) {
      changes.name = dto.name.trim();
      await this.assertUniqueName(changes.name, uuid);
    }
    await row.update({ ...changes, ...(updatedBy ? { updatedBy } : {}) });
    return this.findOne(uuid);
  }

  async remove(uuid: string, deletedBy?: string) {
    const row = await this.types.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Requirement type ${uuid} not found`);
    if (deletedBy) await row.update({ deletedBy });
    await row.destroy({ force: false });
    return { message: `Requirement type ${uuid} deleted successfully` };
  }

  async restore(uuid: string) {
    const row = await this.types.findOne({ where: { uuid }, paranoid: false });
    if (!row) throw new NotFoundException(`Requirement type ${uuid} not found`);
    if (!row.deletedAt) throw new BadRequestException(`Requirement type ${uuid} is not deleted`);
    await row.restore();
    return this.findOne(uuid);
  }

  async dropdown() {
    const rows = await this.types.findAll({ attributes: ['uuid', 'name'], order: [['name', 'ASC']] });
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
      createdBy: data.createdBy ?? null,
      ...(data.createdAt !== undefined ? { createdAt: data.createdAt } : {}),
      ...(data.updatedAt !== undefined ? { updatedAt: data.updatedAt } : {}),
      ...(data.deletedAt !== undefined ? { deletedAt: data.deletedAt } : {}),
    };
  }
}
