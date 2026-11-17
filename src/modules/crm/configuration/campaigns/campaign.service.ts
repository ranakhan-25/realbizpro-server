import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { LeadCampaign, LeadSource } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { QueryCampaignDto } from './dto/query-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(LeadCampaign) private readonly campaigns: typeof LeadCampaign,
    @InjectModel(LeadSource) private readonly leadSources: typeof LeadSource,
  ) {}

  async create(dto: CreateCampaignDto, userId?: number, currentUser?: any) {
    const source = await this.getActiveLeadSource(dto.leadSourceUuid);
    const { leadSourceUuid, ...fields } = dto;
    const campaign = await this.campaigns.create({
      ...fields,
      name: dto.name.trim(),
      leadSourceId: source.id,
      status: dto.status ?? 'active',
      createdBy: userId ? String(userId) : dto.createdBy ?? null,
      updatedBy: null,
      deletedBy: null,
      orgId: dto.orgId ?? currentUser?.orgId ?? null,
    } as any);
    return this.findOne(campaign.uuid);
  }

  async findAll(query: QueryCampaignDto, currentUser?: any) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    if (query.status) where.status = query.status;
    const search = query.search?.trim();
    if (search) where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
      { formId: { [Op.iLike]: `%${search}%` } },
    ];
    const effectiveOrgId = query.orgId ?? currentUser?.orgId;
    if (effectiveOrgId) where.orgId = effectiveOrgId;
    const include: any[] = [{
      association: 'leadSource', attributes: ['uuid', 'code', 'name'], required: !!query.leadSourceUuid,
      ...(query.leadSourceUuid ? { where: { uuid: query.leadSourceUuid } } : {}),
    }];
    const { rows, count } = await this.campaigns.findAndCountAll({
      where, include, limit, offset: (page - 1) * limit, order: [['createdAt', 'DESC']],
      distinct: true, paranoid: !query.withDeleted,
    });
    return {
      data: rows.map(row => this.toPublicCampaign(row)),
      meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 },
    };
  }

  async findOne(uuid: string, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.orgId) where.orgId = currentUser.orgId;
    const campaign = await this.campaigns.findOne({
      where,
      include: [
        { association: 'leadSource', attributes: ['uuid', 'code', 'name'], required: false, paranoid: false },
        { association: 'leads', attributes: ['uuid', 'leadCode', 'clientName'], required: false },
      ],
    });
    if (!campaign) throw new NotFoundException(`Campaign ${uuid} not found`);
    return this.toPublicCampaign(campaign);
  }

  async update(uuid: string, dto: UpdateCampaignDto, userId?: number, currentUser?: any) {
    const campaign = await this.campaigns.findOne({ where: { uuid } });
    if (!campaign) throw new NotFoundException(`Campaign ${uuid} not found`);
    const { leadSourceUuid, ...fields } = dto;
    const changes: Record<string, any> = {
      ...fields,
      updatedBy: userId ? String(userId) : campaign.updatedBy ?? null,
      ...(dto.orgId !== undefined ? { orgId: dto.orgId } : {}),
    };
    if (leadSourceUuid) changes.leadSourceId = (await this.getActiveLeadSource(leadSourceUuid)).id;
    if (dto.name) changes.name = dto.name.trim();
    await campaign.update(changes);
    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any) {
    const campaign = await this.campaigns.findOne({ where: { uuid } });
    if (!campaign) throw new NotFoundException(`Campaign ${uuid} not found`);
    await campaign.update({ deletedBy: userId ? String(userId) : null } as any);
    await campaign.destroy({ force: false });
    return { message: `Campaign ${uuid} deleted successfully` };
  }

  async restore(uuid: string, userId?: number, currentUser?: any) {
    const campaign = await this.campaigns.findOne({ where: { uuid }, paranoid: false });
    if (!campaign) throw new NotFoundException(`Campaign ${uuid} not found`);
    if (!campaign.deletedAt) throw new BadRequestException(`Campaign ${uuid} is not deleted`);
    await campaign.restore();
    await campaign.update({ deletedBy: null, updatedBy: userId ? String(userId) : campaign.updatedBy ?? null } as any);
    return this.findOne(uuid);
  }

  async leadSourceDropdown(currentUser?: any) {
    const where: any = { isActive: true };
    if (currentUser?.orgId) where.orgId = currentUser.orgId;
    return this.leadSources.findAll({
      where, attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']],
    });
  }

  statusDropdown() {
    return [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ];
  }

  private async getActiveLeadSource(uuid: string) {
    const source = await this.leadSources.findOne({ where: { uuid, isActive: true } });
    if (!source) throw new BadRequestException(`Active lead source ${uuid} not found`);
    return source;
  }

  private toPublicCampaign(campaign: LeadCampaign) {
    const result = campaign.toJSON() as Record<string, any>;
    delete result.id;
    result.leadSourceUuid = result.leadSource?.uuid ?? null;
    if (Array.isArray(result.leads)) {
      result.leads = result.leads.map((lead: Record<string, any>) => ({
        uuid: lead.uuid, leadCode: lead.leadCode, clientName: lead.clientName,
      }));
    }
    delete result.leadSourceId;
    result.created_at = result.created_at ?? result.createdAt;
    result.updated_at = result.updated_at ?? result.updatedAt;
    result.deleted_at = result.deleted_at ?? result.deletedAt ?? null;
    delete result.createdAt;
    delete result.updatedAt;
    delete result.deletedAt;
    result.created_by = result.createdBy ?? result.created_by ?? null;
    result.updated_by = result.updatedBy ?? result.updated_by ?? null;
    result.deleted_by = result.deletedBy ?? result.deleted_by ?? null;
    delete result.addedBy;
    delete result.createdBy;
    delete result.updatedBy;
    delete result.deletedBy;
    return result;
  }
}
