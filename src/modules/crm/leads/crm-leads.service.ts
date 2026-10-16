import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CrmLead } from '../../../database/models/crm/crm_lead.model';
import { CrmLeadCategory } from '../../../database/models/crm/crm_lead_category.model';
import { CrmLeadStage } from '../../../database/models/crm/crm_lead_stage.model';
import { CrmLeadSource } from '../../../database/models/crm/crm_lead_source.model';
import { CrmCampaign } from '../../../database/models/crm/crm_campaign.model';
import { CrmProfession } from '../../../database/models/crm/crm_profession.model';
import { CrmLeadRequirement } from '../../../database/models/crm/crm_lead_requirement.model';
import { CrmLeadPropertyInterest } from '../../../database/models/crm/crm_lead_property_interest.model';
import { CrmLeadActivity } from '../../../database/models/crm/crm_lead_activity.model';
import { CrmLeadAttachment } from '../../../database/models/crm/crm_lead_attachment.model';
import { CrmLeadCallAssign } from '../../../database/models/crm/crm_lead_call_assign.model';
import { CrmLeadTransferLog } from '../../../database/models/crm/crm_lead_transfer_log.model';
import { CrmDealNegotiation } from '../../../database/models/crm/crm_deal_negotiation.model';
import {
  CreateCrmLeadDto,
  UpdateCrmLeadDto,
  CreateCrmLeadRequirementDto,
  CreateCrmLeadPropertyInterestDto,
  CreateCrmLeadActivityDto,
  CreateCrmLeadCallAssignDto,
  TransferCrmLeadDto,
  ChangeCrmLeadStageDto,
} from './dto/create-crm-lead.dto';

@Injectable()
export class CrmLeadsService {
  constructor(
    @InjectModel(CrmLead)
    private readonly leadModel: typeof CrmLead,
    @InjectModel(CrmLeadCategory)
    private readonly categoryModel: typeof CrmLeadCategory,
    @InjectModel(CrmLeadStage)
    private readonly stageModel: typeof CrmLeadStage,
    @InjectModel(CrmLeadSource)
    private readonly sourceModel: typeof CrmLeadSource,
    @InjectModel(CrmCampaign)
    private readonly campaignModel: typeof CrmCampaign,
    @InjectModel(CrmProfession)
    private readonly professionModel: typeof CrmProfession,
    @InjectModel(CrmLeadRequirement)
    private readonly requirementModel: typeof CrmLeadRequirement,
    @InjectModel(CrmLeadPropertyInterest)
    private readonly propertyInterestModel: typeof CrmLeadPropertyInterest,
    @InjectModel(CrmLeadActivity)
    private readonly activityModel: typeof CrmLeadActivity,
    @InjectModel(CrmLeadAttachment)
    private readonly attachmentModel: typeof CrmLeadAttachment,
    @InjectModel(CrmLeadCallAssign)
    private readonly callAssignModel: typeof CrmLeadCallAssign,
    @InjectModel(CrmLeadTransferLog)
    private readonly transferLogModel: typeof CrmLeadTransferLog,
    @InjectModel(CrmDealNegotiation)
    private readonly dealNegotiationModel: typeof CrmDealNegotiation,
  ) {}

  async create(createDto: CreateCrmLeadDto): Promise<CrmLead> {
    const lead = await this.leadModel.create(createDto as any);
    return lead;
  }

  async findAll(query?: {
    search?: string;
    stage_id?: number;
    category_id?: number;
    priority?: string;
    assigned_to?: string;
  }): Promise<CrmLead[]> {
    const where: any = {};
    if (query?.search) {
      where[Op.or] = [
        { client_name: { [Op.iLike || Op.like]: `%${query.search}%` } },
        { phone: { [Op.iLike || Op.like]: `%${query.search}%` } },
        { lead_code: { [Op.iLike || Op.like]: `%${query.search}%` } },
      ];
    }
    if (query?.stage_id) where.lead_stage_id = query.stage_id;
    if (query?.category_id) where.lead_category_id = query.category_id;
    if (query?.priority) where.priority = query.priority;
    if (query?.assigned_to) where.assigned_to = query.assigned_to;

    return await this.leadModel.findAll({
      where,
      include: [
        { model: this.categoryModel, as: 'category' },
        { model: this.stageModel, as: 'stage' },
        { model: this.sourceModel, as: 'source' },
        { model: this.campaignModel, as: 'campaign' },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(uuid: string): Promise<CrmLead> {
    const lead = await this.leadModel.findOne({
      where: { uuid },
      include: [
        { model: this.categoryModel, as: 'category' },
        { model: this.stageModel, as: 'stage' },
        { model: this.sourceModel, as: 'source' },
        { model: this.campaignModel, as: 'campaign' },
        { model: this.professionModel, as: 'profession' },
        { model: this.requirementModel, as: 'requirements' },
        { model: this.propertyInterestModel, as: 'property_interests' },
        { model: this.activityModel, as: 'activities' },
        { model: this.attachmentModel, as: 'attachments' },
        { model: this.callAssignModel, as: 'call_assignments' },
        { model: this.transferLogModel, as: 'transfer_logs' },
        { model: this.dealNegotiationModel, as: 'negotiations' },
      ],
    });
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async update(uuid: string, updateDto: UpdateCrmLeadDto): Promise<CrmLead> {
    const lead = await this.findOne(uuid);
    await lead.update(updateDto as any);
    return lead;
  }

  async remove(uuid: string): Promise<{ success: boolean; message: string }> {
    const lead = await this.findOne(uuid);
    await lead.destroy();
    return { success: true, message: 'Lead deleted successfully' };
  }

  async addRequirement(uuid: string, dto: CreateCrmLeadRequirementDto) {
    const lead = await this.findOne(uuid);
    return await this.requirementModel.create({
      ...dto,
      lead_id: lead.id,
    } as any);
  }

  async addPropertyInterest(uuid: string, dto: CreateCrmLeadPropertyInterestDto) {
    const lead = await this.findOne(uuid);
    return await this.propertyInterestModel.create({
      ...dto,
      lead_id: lead.id,
    } as any);
  }

  async addActivity(uuid: string, dto: CreateCrmLeadActivityDto) {
    const lead = await this.findOne(uuid);
    return await this.activityModel.create({
      ...dto,
      lead_id: lead.id,
    } as any);
  }

  async assignCall(uuid: string, dto: CreateCrmLeadCallAssignDto) {
    const lead = await this.findOne(uuid);
    return await this.callAssignModel.create({
      ...dto,
      lead_id: lead.id,
    } as any);
  }

  async transferLead(uuid: string, dto: TransferCrmLeadDto) {
    const lead = await this.findOne(uuid);
    await lead.update({ assigned_to: dto.transferred_to });
    const log = await this.transferLogModel.create({
      ...dto,
      lead_id: lead.id,
      transfer_date: new Date(),
    } as any);
    return { success: true, lead, transfer_log: log };
  }

  async changeStage(uuid: string, dto: ChangeCrmLeadStageDto) {
    const lead = await this.findOne(uuid);
    const oldStageId = lead.lead_stage_id;
    await lead.update({ lead_stage_id: dto.lead_stage_id });
    await this.activityModel.create({
      lead_id: lead.id,
      activity_type: 'stage_change',
      activity_date: new Date(),
      summary: `Stage transitioned from ID ${oldStageId} to ID ${dto.lead_stage_id}. ${dto.notes || ''}`.trim(),
    } as any);
    return { success: true, lead };
  }
}
