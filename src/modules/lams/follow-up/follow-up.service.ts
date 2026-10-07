import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FollowUp } from '../../../database/models/lams/follow-up.model';
import { CreateFollowUpDto } from './dto/create-follow-up.dto';

@Injectable()
export class FollowUpService {
  constructor(
    @InjectModel(FollowUp)
    private readonly followUpModel: typeof FollowUp,
  ) {}

  async create(createDto: CreateFollowUpDto): Promise<FollowUp> {
    return await this.followUpModel.create({
      ...createDto,
    });
  }

  async findAll(): Promise<FollowUp[]> {
    return await this.followUpModel.findAll();
  }
}
