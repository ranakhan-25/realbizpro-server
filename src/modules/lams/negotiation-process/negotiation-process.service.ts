import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { NegotiationProcess } from '../../../database/models/lams/negotiation-process.model';
import { CreateNegotiationProcessDto } from './dto/create-negotiation-process.dto';
import { UpdateNegotiationProcessDto } from './dto/update-negotiation-process.dto';

@Injectable()
export class NegotiationProcessService {
  constructor(
    @InjectModel(NegotiationProcess)
    private readonly negotiationProcessModel: typeof NegotiationProcess,
  ) {}

  async create(createDto: CreateNegotiationProcessDto, user?: any): Promise<NegotiationProcess> {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id || createDto.org_id;
    if (!orgId) {
      throw new BadRequestException('Organization identifier (org_id) is mandatory');
    }

    // Auto determine round number if not provided
    let roundNo = createDto.round_no;
    if (!roundNo) {
      const existingRounds = await this.negotiationProcessModel.count({
        where: { lead_id: createDto.lead_id, org_id: orgId },
      });
      roundNo = existingRounds + 1;
    }

    // Auto compute price gap
    const offer = Number(createDto.offered_price || 0);
    const counter = Number(createDto.counter_amount || 0);
    const gap = counter > 0 && offer > 0 ? Math.abs(counter - offer) : Number(createDto.gap_amount || 0);

    return await this.negotiationProcessModel.create({
      ...createDto,
      round_no: roundNo,
      gap_amount: gap,
      org_id: orgId,
      created_by: user?.id,
    } as any);
  }

  async findAll(filter?: {
    org_id?: string;
    lead_id?: string;
    negotiation_status?: string;
    from_date?: string;
    to_date?: string;
  }): Promise<NegotiationProcess[]> {
    const where: any = {};

    if (filter?.org_id) {
      where.org_id = filter.org_id;
    }
    if (filter?.lead_id && filter.lead_id !== 'ALL') {
      where.lead_id = filter.lead_id;
    }
    if (filter?.negotiation_status && filter.negotiation_status !== 'ALL') {
      where.negotiation_status = filter.negotiation_status;
    }
    if (filter?.from_date && filter?.to_date) {
      where.negotiation_date = { [Op.between]: [filter.from_date, filter.to_date] };
    }

    return await this.negotiationProcessModel.findAll({
      where,
      include: [
        { association: 'acquisition_lead', required: false },
      ],
      order: [['round_no', 'ASC'], ['created_at', 'DESC']],
    });
  }

  async findOne(uuid: string, orgId?: string): Promise<NegotiationProcess> {
    const where: any = { id: uuid };
    if (orgId) {
      where.org_id = orgId;
    }

    const process = await this.negotiationProcessModel.findOne({
      where,
      include: [
        { association: 'acquisition_lead', required: false },
      ],
    });
    if (!process) throw new NotFoundException('Negotiation Process not found');
    return process;
  }

  async update(uuid: string, updateDto: UpdateNegotiationProcessDto, user?: any): Promise<NegotiationProcess> {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id;
    const process = await this.findOne(uuid, orgId);
    await process.update(updateDto as any);
    return process;
  }

  async remove(uuid: string, user?: any): Promise<void> {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id;
    const process = await this.findOne(uuid, orgId);
    await process.destroy();
  }
}
