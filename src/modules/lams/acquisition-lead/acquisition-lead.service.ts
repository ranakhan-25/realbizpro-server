import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AcquisitionLead } from '../../../database/models/lams/acquisition-lead.model';
import { CreateAcquisitionLeadDto } from './dto/create-acquisition-lead.dto';
import { UpdateAcquisitionLeadDto } from './dto/update-acquisition-lead.dto';

@Injectable()
export class AcquisitionLeadService {
  constructor(
    @InjectModel(AcquisitionLead)
    private readonly acquisitionLeadModel: typeof AcquisitionLead,
  ) {}

  async create(createDto: CreateAcquisitionLeadDto): Promise<AcquisitionLead> {
    return await this.acquisitionLeadModel.create(createDto as any);
  }

  async findAll(): Promise<AcquisitionLead[]> {
    return await this.acquisitionLeadModel.findAll();
  }

  async findOne(id: string): Promise<AcquisitionLead> {
    const lead = await this.acquisitionLeadModel.findByPk(id);
    if (!lead) throw new NotFoundException('Acquisition Lead not found');
    return lead;
  }

  async update(id: string, updateDto: UpdateAcquisitionLeadDto): Promise<AcquisitionLead> {
    const lead = await this.findOne(id);
    await lead.update(updateDto as any);
    return lead;
  }

  async remove(id: string): Promise<void> {
    const lead = await this.findOne(id);
    await lead.destroy();
  }
}
