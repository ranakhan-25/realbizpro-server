import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LandOwner } from '../../../database/models/lams/land-owner.model';
import { CreateLandOwnerDto } from './dto/create-land-owner.dto';
import { UpdateLandOwnerDto } from './dto/update-land-owner.dto';

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

  async findOne(id: string): Promise<LandOwner> {
    const owner = await this.landOwnerModel.findByPk(id);
    if (!owner) throw new NotFoundException('Land Owner not found');
    return owner;
  }

  async update(id: string, updateDto: UpdateLandOwnerDto): Promise<LandOwner> {
    const owner = await this.findOne(id);
    await owner.update(updateDto as any);
    return owner;
  }

  async remove(id: string): Promise<void> {
    const owner = await this.findOne(id);
    await owner.destroy();
  }
}
