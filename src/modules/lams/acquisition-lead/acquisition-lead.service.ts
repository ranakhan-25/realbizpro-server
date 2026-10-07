import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AcquisitionLead } from '../../../database/models/lams/acquisition-lead.model';
import { CreateAcquisitionLeadDto } from './dto/create-acquisition-lead.dto';

@Injectable()
export class AcquisitionLeadService {
  constructor(
    @InjectModel(AcquisitionLead)
    private readonly acquisitionLeadModel: typeof AcquisitionLead,
  ) {}

  async create(createDto: CreateAcquisitionLeadDto): Promise<AcquisitionLead> {
    return await this.acquisitionLeadModel.create({
      ...createDto,
    });
  }

  async findAll(): Promise<AcquisitionLead[]> {
    return await this.acquisitionLeadModel.findAll();
  }
}
