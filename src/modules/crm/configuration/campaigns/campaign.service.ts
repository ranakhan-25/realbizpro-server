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

  async create(dto: CreateCampaignDto) {
    const source = await this.getActiveLeadSource(dto.leadSourceUuid);
    const { leadSourceUuid, ...fields } = dto;
    const campaign = await this.campaigns.create({
      ...fields,
      name: dto.name.trim(),
      leadSourceId: source.id,
      status: dto.status ?? 'active',
    } as any);
    return this.findOne(campaign.uuid);
  }

  async findAll(query: QueryCampaignDto) {
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

  async findOne(uuid: string) {
    const campaign = await this.campaigns.findOne({
      where: { uuid },
      include: [
        { association: 'leadSource', attributes: ['uuid', 'code', 'name'], required: false, paranoid: false },
        { association: 'leads', attributes: ['uuid', 'leadCode', 'clientName'], required: false },
      ],
    });
    if (!campaign) throw new NotFoundException(`Campaign ${uuid} not found`);
    return this.toPublicCampaign(campaign);
  }

  async update(uuid: string, dto: UpdateCampaignDto) {
    const campaign = await this.campaigns.findOne({ where: { uuid } });
    if (!campaign) throw new NotFoundException(`Campaign ${uuid} not found`);
    const { leadSourceUuid, ...fields } = dto;
    const changes: Record<string, any> = { ...fields };
    if (leadSourceUuid) changes.leadSourceId = (await this.getActiveLeadSource(leadSourceUuid)).id;
    if (dto.name) changes.name = dto.name.trim();
    await campaign.update(changes);
    return this.findOne(uuid);
  }

  async remove(uuid: string) {
    const campaign = await this.campaigns.findOne({ where: { uuid } });
    if (!campaign) throw new NotFoundException(`Campaign ${uuid} not found`);
    await campaign.destroy({ force: false });
    return { message: `Campaign ${uuid} deleted successfully` };
  }

  async restore(uuid: string) {
    const campaign = await this.campaigns.findOne({ where: { uuid }, paranoid: false });
    if (!campaign) throw new NotFoundException(`Campaign ${uuid} not found`);
    if (!campaign.deletedAt) throw new BadRequestException(`Campaign ${uuid} is not deleted`);
    await campaign.restore();
    return this.findOne(uuid);
  }

  async leadSourceDropdown() {
    return this.leadSources.findAll({
      where: { isActive: true }, attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']],
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
    result.addedBy = result.createdBy ?? null;
    delete result.createdBy;
    delete result.updatedBy;
    delete result.deletedBy;
    return result;
  }
}
