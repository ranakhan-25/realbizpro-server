import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LandOwner } from '../../../database/models/lams/land-owner.model';
import { CreateLandOwnerDto } from './dto/create-land-owner.dto';

@Injectable()
export class LandOwnerService {
  constructor(
    @InjectModel(LandOwner)
    private readonly landOwnerModel: typeof LandOwner,
  ) {}

  async create(createDto: CreateLandOwnerDto): Promise<LandOwner> {
    return await this.landOwnerModel.create(createDto as any);
  }

  async findAll(): Promise<LandOwner[]> {
    return await this.landOwnerModel.findAll();
  }
}
