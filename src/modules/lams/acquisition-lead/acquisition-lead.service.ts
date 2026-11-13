import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AcquisitionLead } from '../../../database/models/lams/acquisition-lead.model';
import { LandOwner } from '../../../database/models/lams/land-owner.model';
import { LeadStageLog } from '../../../database/models/lams/lead-stage-log.model';
import { CreateAcquisitionLeadDto } from './dto/create-acquisition-lead.dto';
import { UpdateAcquisitionLeadDto } from './dto/update-acquisition-lead.dto';
import { AdvanceStageDto, RejectLeadDto } from './dto/advance-stage.dto';

@Injectable()
export class AcquisitionLeadService {
  constructor(
    @InjectModel(AcquisitionLead)
    private readonly acquisitionLeadModel: typeof AcquisitionLead,
    @InjectModel(LandOwner)
    private readonly landOwnerModel: typeof LandOwner,
    @InjectModel(LeadStageLog)
    private readonly stageLogModel: typeof LeadStageLog,
  ) {}

  async create(createDto: CreateAcquisitionLeadDto, user?: any): Promise<AcquisitionLead> {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id || createDto.org_id;
    if (!orgId) {
      throw new BadRequestException('Organization identifier (org_id) is mandatory');
    }

    // Auto generate lead code if not provided
    let leadCode = createDto.lead_code;
    if (!leadCode) {
      const count = await this.acquisitionLeadModel.count({ where: { org_id: orgId } });
      leadCode = `LAD-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    }

    const lead = await this.acquisitionLeadModel.create({
      ...createDto,
      lead_code: leadCode,
      org_id: orgId,
      created_by: user?.id,
    } as any);

    // If inline landowner details were provided in the wizard
    if (createDto.owner_id) {
      await this.landOwnerModel.update(
        { lead_id: lead.id },
        { where: { id: createDto.owner_id, org_id: orgId } },
      );
    } else if (createDto.owner_name) {
      await this.landOwnerModel.create({
        org_id: orgId,
        lead_id: lead.id,
        name: createDto.owner_name,
        contact_number: createDto.owner_phone || '',
        nid_number: createDto.owner_nid || '',
        owner_type: 'Owner',
        created_by: user?.id,
      } as any);
    }

    // Record initial stage log
    await this.stageLogModel.create({
      org_id: orgId,
      lead_id: lead.id,
      from_stage: 'Initial',
      to_stage: lead.lead_status || 'Draft',
      remarks: 'Lead created via registration wizard',
      transitioned_by: user?.name || user?.username || 'System',
      created_by: user?.id,
    } as any);

    return this.findOne(lead.id, orgId);
  }

  async findAll(filter?: {
    org_id?: string;
    lead_status?: string;
    source?: string;
    assigned_to?: string;
    search?: string;
    from_date?: string;
    to_date?: string;
  }): Promise<AcquisitionLead[]> {
    const where: any = {};

    if (filter?.org_id) {
      where.org_id = filter.org_id;
    }
    if (filter?.lead_status && filter.lead_status !== 'ALL') {
      where.lead_status = filter.lead_status;
    }
    if (filter?.source && filter.source !== 'ALL') {
      where.source = filter.source;
    }
    if (filter?.assigned_to && filter.assigned_to !== 'ALL') {
      where.assigned_to = filter.assigned_to;
    }
    if (filter?.from_date && filter?.to_date) {
      where.lead_date = { [Op.between]: [filter.from_date, filter.to_date] };
    }

    if (filter?.search) {
      const term = `%${filter.search}%`;
      where[Op.or] = [
        { lead_title: { [Op.iLike]: term } },
        { lead_code: { [Op.iLike]: term } },
        { location: { [Op.iLike]: term } },
        { mouza: { [Op.iLike]: term } },
      ];
    }

    return await this.acquisitionLeadModel.findAll({
      where,
      include: [
        { association: 'land_owners', required: false },
        { association: 'negotiation_processes', required: false },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(uuid: string, orgId?: string): Promise<AcquisitionLead> {
    const where: any = { id: uuid };
    if (orgId) {
      where.org_id = orgId;
    }

    const lead = await this.acquisitionLeadModel.findOne({
      where,
      include: [
        { association: 'land_owners', required: false },
        { association: 'follow_ups', required: false },
        { association: 'negotiation_processes', required: false },
        { association: 'legal_documents', required: false },
      ],
    });
    if (!lead) throw new NotFoundException('Acquisition Lead not found');
    return lead;
  }

  async update(uuid: string, updateDto: UpdateAcquisitionLeadDto, user?: any): Promise<AcquisitionLead> {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id;
    const lead = await this.findOne(uuid, orgId);
    await lead.update(updateDto as any);
    return lead;
  }

  async remove(uuid: string, user?: any): Promise<void> {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id;
    const lead = await this.findOne(uuid, orgId);
    await lead.destroy();
  }

  async advanceStage(uuid: string, dto: AdvanceStageDto, user?: any): Promise<AcquisitionLead> {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id;
    const lead = await this.findOne(uuid, orgId);

    const fromStage = lead.lead_status;
    const toStage = dto.to_stage;

    await this.stageLogModel.create({
      org_id: lead.org_id,
      lead_id: lead.id,
      from_stage: fromStage,
      to_stage: toStage,
      remarks: dto.remarks,
      transitioned_by: user?.name || user?.username || dto.transitioned_by || 'System',
      created_by: user?.id,
    } as any);

    await lead.update({ lead_status: toStage });
    return lead;
  }

  async qualifyLead(uuid: string, user?: any): Promise<AcquisitionLead> {
    return this.advanceStage(
      uuid,
      { to_stage: 'Qualified', remarks: 'Lead validated and qualified for legal vetting' },
      user,
    );
  }

  async rejectLead(uuid: string, dto: RejectLeadDto, user?: any): Promise<AcquisitionLead> {
    return this.advanceStage(
      uuid,
      { to_stage: 'Rejected', remarks: dto.remarks },
      user,
    );
  }

  async getStageLogs(uuid: string, orgId?: string): Promise<LeadStageLog[]> {
    const where: any = { lead_id: uuid };
    if (orgId) {
      where.org_id = orgId;
    }
    return await this.stageLogModel.findAll({
      where,
      order: [['created_at', 'ASC']],
    });
  }
}
