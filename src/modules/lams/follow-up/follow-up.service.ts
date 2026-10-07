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

  async findOne(uuid: string): Promise<FollowUp> {
    const followUp = await this.followUpModel.findByPk(uuid);
    if (!followUp) throw new NotFoundException('Follow-up record not found');
    return followUp;
  }

  async update(uuid: string, updateDto: UpdateFollowUpDto): Promise<FollowUp> {
    const followUp = await this.findOne(uuid);
    await followUp.update(updateDto as any);
    return followUp;
  }

  async remove(uuid: string): Promise<void> {
    const followUp = await this.findOne(uuid);
    await followUp.destroy();
  }
}
