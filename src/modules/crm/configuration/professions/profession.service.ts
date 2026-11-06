import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { LeadProfession } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { QueryProfessionDto } from './dto/query-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';

@Injectable()
export class ProfessionService {
  constructor(@InjectModel(LeadProfession) private readonly professions: typeof LeadProfession) {}

  async create(dto: CreateProfessionDto) {
    const row = await this.professions.create({
      ...dto, name: dto.name.trim(), status: dto.status ?? 'active',
    } as any);
    return this.findOne(row.uuid);
  }

  async findAll(query: QueryProfessionDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    if (query.status) where.status = query.status;
    const search = query.search?.trim();
    if (search) where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
    const { rows, count } = await this.professions.findAndCountAll({
      where, limit, offset: (page - 1) * limit, order: [['createdAt', 'DESC']],
      paranoid: !query.withDeleted,
    });
    return {
      data: rows.map(row => this.toPublicProfession(row)),
      meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 },
    };
  }

  async findOne(uuid: string) {
    const row = await this.professions.findOne({
      where: { uuid },
      include: [{ association: 'leads', attributes: ['uuid', 'leadCode', 'clientName'], required: false }],
    });
    if (!row) throw new NotFoundException(`Profession ${uuid} not found`);
    return this.toPublicProfession(row);
  }

  async update(uuid: string, dto: UpdateProfessionDto) {
    const row = await this.professions.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Profession ${uuid} not found`);
    await row.update({ ...dto, ...(dto.name ? { name: dto.name.trim() } : {}) } as any);
    return this.findOne(uuid);
  }

  async remove(uuid: string) {
    const row = await this.professions.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Profession ${uuid} not found`);
    await row.destroy({ force: false });
    return { message: `Profession ${uuid} deleted successfully` };
  }

  async restore(uuid: string) {
    const row = await this.professions.findOne({ where: { uuid }, paranoid: false });
    if (!row) throw new NotFoundException(`Profession ${uuid} not found`);
    if (!row.deletedAt) throw new BadRequestException(`Profession ${uuid} is not deleted`);
    await row.restore();
    return this.findOne(uuid);
  }

  statusDropdown() {
    return [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ];
  }

  private toPublicProfession(row: LeadProfession) {
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
    if (Array.isArray(data.leads)) {
      data.leads = data.leads.map((lead: Record<string, any>) => ({
        uuid: lead.uuid, leadCode: lead.leadCode, clientName: lead.clientName,
      }));
    }
    return data;
  }
}
