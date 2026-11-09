import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LamsValuation } from '../../../database/models/lams/valuation.model';
import { CreateValuationDto } from './dto/create-valuation.dto';
import { UpdateValuationDto } from './dto/update-valuation.dto';

@Injectable()
export class ValuationService {
  constructor(
    @InjectModel(LamsValuation)
    private readonly valuationModel: typeof LamsValuation,
  ) {}

  async create(createDto: CreateValuationDto): Promise<LamsValuation> {
    return await this.valuationModel.create(createDto as any);
  }

  async findAll(filter?: { lead_id?: string; org_id?: string }): Promise<LamsValuation[]> {
    const where: any = {};
    if (filter?.lead_id) where.lead_id = filter.lead_id;
    if (filter?.org_id) where.org_id = filter.org_id;
    return await this.valuationModel.findAll({
      where,
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(uuid: string): Promise<LamsValuation> {
    const record = await this.valuationModel.findOne({
      where: { uuid },
    });
    if (!record) throw new NotFoundException('Valuation record not found');
    return record;
  }

  async update(uuid: string, updateDto: UpdateValuationDto): Promise<LamsValuation> {
    const record = await this.findOne(uuid);
    await record.update(updateDto as any);
    return record;
  }

  async remove(uuid: string): Promise<void> {
    const record = await this.findOne(uuid);
    await record.destroy();
  }
}
