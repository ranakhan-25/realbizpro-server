import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { NegotiationProcess } from '../../../database/models/lams/negotiation-process.model';
import { CreateNegotiationProcessDto } from './dto/create-negotiation-process.dto';

@Injectable()
export class NegotiationProcessService {
  constructor(
    @InjectModel(NegotiationProcess)
    private readonly negotiationProcessModel: typeof NegotiationProcess,
  ) {}

  async create(createDto: CreateNegotiationProcessDto): Promise<NegotiationProcess> {
    return await this.negotiationProcessModel.create({
      ...createDto,
    });
  }

  async findAll(): Promise<NegotiationProcess[]> {
    return await this.negotiationProcessModel.findAll();
  }
}
