/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { FlatLand, FlatLandStatus } from 'src/database/models/projects/flatland/pr_flatland_model';
import { CreateFlatLandDto } from './dto/create-flatland.dto';
import { QueryFlatLandDto } from './dto/query-flatland.dto';
import { UpdateFlatLandDto } from './dto/update-flatland.dto';


@Injectable()
export class FlatLandService {
  constructor(
    @InjectModel(FlatLand)
    private readonly flatLandModel: typeof FlatLand,
  ) {}

  async create(dto: CreateFlatLandDto): Promise<FlatLand> {
    const flatLand = await this.flatLandModel.create({
      ...dto,
      status: dto.status ?? FlatLandStatus.AVAILABLE,
    } as any);

    return this.findOne(flatLand.uuid);
  }

  async findAll(query: QueryFlatLandDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      status,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;

    const offset =
      skip !== undefined && skip !== null ? skip : (page - 1) * limit;

    const where: any = {};

    if (search) {
      where[Op.or] = [
        {
          projectName: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          flatLandNo: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          customerName: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          uid: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    if (status) {
      where.status = status;
    }

    const { rows, count } = await this.flatLandModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      paranoid: !withDeleted,
    });

    const totalPages = Math.ceil(count / limit) || 1;
    const currentPage =
      skip !== undefined && skip !== null
        ? Math.floor(skip / limit) + 1
        : page;

    const nextPage = currentPage < totalPages ? currentPage + 1 : null;
    const previousPage = currentPage > 1 ? currentPage - 1 : null;

    return {
      data: rows,
      meta: {
        page: currentPage,
        pageNo: currentPage,
        nextPage,
        previousPage,
        limit,
        skip: offset,
        total: count,
        totalPages,
      },
    };
  }

  async findOne(uuid: string): Promise<FlatLand> {
    const flatLand = await this.flatLandModel.findOne({
      where: { uuid } as any,
    });

    if (!flatLand) {
      throw new NotFoundException(`Flat/Land #${uuid} not found`);
    }

    return flatLand;
  }

  async update(uuid: string, dto: UpdateFlatLandDto): Promise<FlatLand> {
    const flatLand = await this.flatLandModel.findOne({
      where: { uuid } as any,
    });

    if (!flatLand) {
      throw new NotFoundException(`Flat/Land #${uuid} not found`);
    }

    await flatLand.update(dto as any);

    return this.findOne(uuid);
  }

  async remove(uuid: string): Promise<{ message: string }> {
    const flatLand = await this.flatLandModel.findOne({
      where: { uuid } as any,
    });

    if (!flatLand) {
      throw new NotFoundException(`Flat/Land #${uuid} not found`);
    }

    await flatLand.destroy();

    return {
      message: `Flat/Land #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string): Promise<FlatLand> {
    const flatLand = await this.flatLandModel.findOne({
      where: { uuid } as any,
      paranoid: false,
    });

    if (!flatLand) {
      throw new NotFoundException(`Flat/Land #${uuid} not found`);
    }

    if (!flatLand.deletedAt) {
      throw new BadRequestException(`Flat/Land #${uuid} is not deleted`);
    }

    await flatLand.restore();

    return this.findOne(uuid);
  }
}
