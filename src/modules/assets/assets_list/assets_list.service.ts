/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Asset } from 'src/database/models/accounts/assets/assets_list_model';
import { CreateAssetDto } from './dto/create-assets_list.dto';
import { QueryAssetDto } from './dto/query-assets_list.dto';
import { UpdateAssetDto } from './dto/update-assets_list.dto';

@Injectable()
export class AssetService {
  constructor(
    @InjectModel(Asset)
    private readonly assetModel: typeof Asset,
  ) {}

  async create(dto: CreateAssetDto): Promise<Asset> {
    try {
      const original = Number(dto.originalValue) || 0;
      const notDep = Number(dto.notDepreciableValue) || 0;
      const depreciable = original - notDep;

      return await this.assetModel.create({
        ...dto,
        acquisitionDate: new Date(dto.acquisitionDate),
        bookValue: dto.bookValue ?? original,
        depreciableValue: dto.depreciableValue ?? depreciable,
      } as any);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Asset already exists.');
      }
      throw error;
    }
  }

  async findAll(query: QueryAssetDto) {
    const { page = '1', limit = '10', search, sortBy = 'createdAt', sortOrder = 'DESC', ...filters } = query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    Object.keys(filters).forEach((k) => {
      if (filters[k] !== undefined && filters[k] !== null && filters[k] !== '') {
        where[k] = filters[k];
      }
    });

    if (search) {
      where[Op.or] = [
        { itemName: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.assetModel.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [[sortBy, sortOrder]],
    });

    return {
      data: rows,
      meta: { total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) },
    };
  }

  async findOne(uuid: string): Promise<Asset> {
    const asset = await this.assetModel.findOne({ where: { uuid } });
    if (!asset) throw new NotFoundException(`Asset ${uuid} not found`);
    return asset;
  }

  async update(uuid: string, dto: UpdateAssetDto): Promise<Asset> {
    const asset = await this.findOne(uuid);
    
    const updateData: any = { ...dto };
    if (dto.acquisitionDate) updateData.acquisitionDate = new Date(dto.acquisitionDate);

    return asset.update(updateData);
  }

  async remove(uuid: string): Promise<{ message: string }> {
    const asset = await this.findOne(uuid);
    await asset.destroy();
    return { message: 'Asset deleted successfully' };
  }

  async restore(uuid: string): Promise<Asset> {
    const asset = await this.assetModel.findOne({ where: { uuid }, paranoid: false });
    if (!asset) throw new NotFoundException(`Asset ${uuid} not found`);
    if (!asset.deletedAt) throw new BadRequestException('Asset is not deleted');
    await asset.restore();
    return this.findOne(uuid);
  }
}