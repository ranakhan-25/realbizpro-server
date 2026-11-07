import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadArea } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { CreateAreaDto } from './dto/create-area.dto';
import { QueryAreaDto } from './dto/query-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@Injectable()
export class AreaService {
  constructor(
    @InjectModel(LeadArea) private readonly areas: typeof LeadArea,
    @InjectModel(Lead) private readonly leads: typeof Lead,
  ) {}

  async create(dto: CreateAreaDto) {
    if (dto.status === 'inactive') throw new ConflictException('The crm_areas table has no status column; inactive areas cannot be saved without a schema change');
    const row = await this.areas.create({ name: dto.name.trim() } as any);
    return this.findOne(row.uuid);
  }

  async findAll(query: QueryAreaDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    const search = query.search?.trim();
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (query.status === 'inactive') return { data: [], meta: { page, limit, total: 0, totalPages: 0 } };
    const { rows, count } = await this.areas.findAndCountAll({
      where, limit, offset: (page - 1) * limit, order: [['name', 'ASC']],
      paranoid: !query.withDeleted,
    });
    return { data: rows.map(row => this.toPublicArea(row)), meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 } };
  }

  async findOne(uuid: string) {
    const row = await this.areas.findOne({
      where: { uuid },
      include: [{ association: 'leads', attributes: ['uuid', 'leadCode', 'clientName'], required: false }],
    });
    if (!row) throw new NotFoundException(`Area ${uuid} not found`);
    const data = this.toPublicArea(row);
    data.leads = (row.leads ?? []).map(lead => ({ uuid: lead.uuid, leadCode: lead.leadCode, clientName: lead.clientName }));
    return data;
  }

  async update(uuid: string, dto: UpdateAreaDto) {
    if (dto.status === 'inactive') throw new ConflictException('The crm_areas table has no status column; inactive areas cannot be saved without a schema change');
    const row = await this.areas.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Area ${uuid} not found`);
    await row.update({ ...dto, ...(dto.name !== undefined ? { name: dto.name.trim() } : {}) } as any);
    return this.findOne(uuid);
  }

  async remove(uuid: string) {
    const row = await this.areas.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Area ${uuid} not found`);
    await row.destroy({ force: false });
    return { message: `Area ${uuid} deleted successfully` };
  }

  async restore(uuid: string) {
    const row = await this.areas.findOne({ where: { uuid }, paranoid: false });
    if (!row) throw new NotFoundException(`Area ${uuid} not found`);
    if (!row.deletedAt) throw new BadRequestException(`Area ${uuid} is not deleted`);
    await row.restore();
    return this.findOne(uuid);
  }

  async dropdown() {
    const rows = await this.areas.findAll({ attributes: ['uuid', 'name'], order: [['name', 'ASC']] });
    return rows.map(row => { const data = row.toJSON() as Record<string, any>; delete data.id; return data; });
  }

  statusDropdown() {
    return [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }];
  }

  private toPublicArea(row: LeadArea) {
    const data = row.toJSON() as Record<string, any>;
    delete data.id;
    data.status = 'active';
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
}
