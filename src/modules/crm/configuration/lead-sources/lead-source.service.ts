import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { LeadCampaign, LeadSource } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { CreateLeadSourceDto, LeadSourceStatus } from './dto/create-lead-source.dto';
import { QueryLeadSourceDto } from './dto/query-lead-source.dto';
import { UpdateLeadSourceDto } from './dto/update-lead-source.dto';

@Injectable()
export class LeadSourceService {
  constructor(
    @InjectModel(LeadSource) private readonly sources: typeof LeadSource,
    @InjectModel(Lead) private readonly leads: typeof Lead,
    @InjectModel(LeadCampaign) private readonly campaigns: typeof LeadCampaign,
  ) {}

  async create(dto: CreateLeadSourceDto) {
    const row = await this.sources.create({
      ...dto,
      name: dto.name.trim(),
      ...(dto.code !== undefined ? { code: dto.code.trim() || null } : {}),
      isActive: dto.status ? dto.status === LeadSourceStatus.ACTIVE : true,
    } as any);
    return this.findOne(row.uuid);
  }

  async findAll(query: QueryLeadSourceDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    const search = query.search?.trim();
    if (search) where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { code: { [Op.iLike]: `%${search}%` } },
    ];
    if (query.status) where.isActive = query.status === LeadSourceStatus.ACTIVE;
    const { rows, count } = await this.sources.findAndCountAll({
      where, limit, offset: (page - 1) * limit, order: [['createdAt', 'DESC']],
      paranoid: !query.withDeleted,
    });
    return {
      data: rows.map(row => this.toPublicLeadSource(row)),
      meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 },
    };
  }

  async findOne(uuid: string) {
    const row = await this.sources.findOne({
      where: { uuid },
      include: [
        { association: 'leads', attributes: ['uuid', 'leadCode', 'clientName'], required: false },
        { association: 'campaigns', attributes: ['uuid', 'name', 'status'], required: false },
      ],
    });
    if (!row) throw new NotFoundException(`Lead source ${uuid} not found`);
    return this.toPublicLeadSource(row);
  }

  async update(uuid: string, dto: UpdateLeadSourceDto) {
    const row = await this.sources.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Lead source ${uuid} not found`);
    const { status, ...fields } = dto;
    const changes: Record<string, any> = { ...fields };
    if (dto.name !== undefined) changes.name = dto.name.trim();
    if (dto.code !== undefined) changes.code = dto.code.trim() || null;
    if (status !== undefined) changes.isActive = status === LeadSourceStatus.ACTIVE;
    await row.update(changes);
    return this.findOne(uuid);
  }

  async remove(uuid: string) {
    const row = await this.sources.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Lead source ${uuid} not found`);
    await row.destroy({ force: false });
    return { message: `Lead source ${uuid} deleted successfully` };
  }

  async restore(uuid: string) {
    const row = await this.sources.findOne({ where: { uuid }, paranoid: false });
    if (!row) throw new NotFoundException(`Lead source ${uuid} not found`);
    if (!row.deletedAt) throw new BadRequestException(`Lead source ${uuid} is not deleted`);
    await row.restore();
    return this.findOne(uuid);
  }

  async dropdown() {
    const rows = await this.sources.findAll({
      where: { isActive: true }, attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']],
    });
    return rows.map(row => {
      const result = row.toJSON() as Record<string, any>;
      delete result.id;
      return result;
    });
  }

  private toPublicLeadSource(row: LeadSource) {
    const data = row.toJSON() as Record<string, any>;
    delete data.id;
    data.status = data.isActive === false ? LeadSourceStatus.INACTIVE : LeadSourceStatus.ACTIVE;
    data.addedBy = data.createdBy ?? null;
    delete data.isActive;
    delete data.createdBy;
    delete data.updatedBy;
    delete data.deletedBy;
    delete data.projectId;
    if (Array.isArray(data.leads)) {
      data.leads = data.leads.map((lead: Record<string, any>) => ({
        uuid: lead.uuid, leadCode: lead.leadCode, clientName: lead.clientName,
      }));
    }
    if (Array.isArray(data.campaigns)) {
      data.campaigns = data.campaigns.map((campaign: Record<string, any>) => ({
        uuid: campaign.uuid, name: campaign.name, status: campaign.status,
      }));
    }
    return data;
  }
}
