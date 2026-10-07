import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { NegotiationProcess } from '../../../database/models/lams/negotiation-process.model';
import { CreateNegotiationProcessDto } from './dto/create-negotiation-process.dto';
import { UpdateNegotiationProcessDto } from './dto/update-negotiation-process.dto';

@Injectable()
export class NegotiationProcessService {
  constructor(
    @InjectModel(NegotiationProcess)
    private readonly negotiationProcessModel: typeof NegotiationProcess,
  ) {}

  async create(createDto: CreateNegotiationProcessDto): Promise<NegotiationProcess> {
    return await this.negotiationProcessModel.create(createDto as any);
  }

  async findAll(): Promise<NegotiationProcess[]> {
    return await this.negotiationProcessModel.findAll();
  }

  async findOne(id: string): Promise<NegotiationProcess> {
    const process = await this.negotiationProcessModel.findByPk(id);
    if (!process) throw new NotFoundException('Negotiation Process not found');
    return process;
  }

  async update(id: string, updateDto: UpdateNegotiationProcessDto): Promise<NegotiationProcess> {
    const process = await this.findOne(id);
    await process.update(updateDto as any);
    return process;
  }

  async remove(id: string): Promise<void> {
    const process = await this.findOne(id);
    await process.destroy();
  }
}
