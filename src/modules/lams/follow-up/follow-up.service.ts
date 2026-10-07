import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FollowUp } from '../../../database/models/lams/follow-up.model';
import { CreateFollowUpDto } from './dto/create-follow-up.dto';
import { UpdateFollowUpDto } from './dto/update-follow-up.dto';

@Injectable()
export class FollowUpService {
  constructor(
    @InjectModel(FollowUp)
    private readonly followUpModel: typeof FollowUp,
  ) {}

  async create(createDto: CreateFollowUpDto): Promise<FollowUp> {
    return await this.followUpModel.create(createDto as any);
  }

  async findAll(): Promise<FollowUp[]> {
    return await this.followUpModel.findAll();
  }

  async findOne(id: string): Promise<FollowUp> {
    const followUp = await this.followUpModel.findByPk(id);
    if (!followUp) throw new NotFoundException('Follow-up record not found');
    return followUp;
  }

  async update(id: string, updateDto: UpdateFollowUpDto): Promise<FollowUp> {
    const followUp = await this.findOne(id);
    await followUp.update(updateDto as any);
    return followUp;
  }

  async remove(id: string): Promise<void> {
    const followUp = await this.findOne(id);
    await followUp.destroy();
  }
}
