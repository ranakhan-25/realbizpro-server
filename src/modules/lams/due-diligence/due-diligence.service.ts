import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LamsDueDiligence } from '../../../database/models/lams/due-diligence.model';
import { CreateDueDiligenceDto } from './dto/create-due-diligence.dto';
import { UpdateDueDiligenceDto } from './dto/update-due-diligence.dto';

@Injectable()
export class DueDiligenceService {
  constructor(
    @InjectModel(LamsDueDiligence)
    private readonly dueDiligenceModel: typeof LamsDueDiligence,
  ) {}

  async create(createDto: CreateDueDiligenceDto): Promise<LamsDueDiligence> {
    return await this.dueDiligenceModel.create(createDto as any);
  }

  async findAll(filter?: { lead_id?: string; org_id?: string }): Promise<LamsDueDiligence[]> {
    const where: any = {};
    if (filter?.lead_id) where.lead_id = filter.lead_id;
    if (filter?.org_id) where.org_id = filter.org_id;
    return await this.dueDiligenceModel.findAll({
      where,
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(uuid: string): Promise<LamsDueDiligence> {
    const record = await this.dueDiligenceModel.findOne({
      where: { uuid },
    });
    if (!record) throw new NotFoundException('Due diligence record not found');
    return record;
  }

  async update(uuid: string, updateDto: UpdateDueDiligenceDto): Promise<LamsDueDiligence> {
    const record = await this.findOne(uuid);
    await record.update(updateDto as any);
    return record;
  }

  async remove(uuid: string): Promise<void> {
    const record = await this.findOne(uuid);
    await record.destroy();
  }
}
