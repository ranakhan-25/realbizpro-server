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
    return await this.landOwnerModel.findAll({
      include: [
        { association: 'acquisition_lead', required: false },
      ],
    });
  }

  async findOne(uuid: string): Promise<LandOwner> {
    const owner = await this.landOwnerModel.findByPk(uuid, {
      include: [
        { association: 'acquisition_lead', required: false },
      ],
    });
    if (!owner) throw new NotFoundException('Land Owner not found');
    return owner;
  }

  async update(uuid: string, updateDto: UpdateLandOwnerDto): Promise<LandOwner> {
    const owner = await this.findOne(uuid);
    await owner.update(updateDto as any);
    return owner;
  }

  async remove(uuid: string): Promise<void> {
    const owner = await this.findOne(uuid);
    await owner.destroy();
  }
}
