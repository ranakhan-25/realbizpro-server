/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { UnitPlot } from 'src/database/models/projects/unit_plot/pr_unit_plot_model';
import { CreateUnitPlotDto } from './dto/create-unit_plot.dto';
import { UpdateUnitPlotDto } from './dto/update-unit_plot.dto';
import { QueryUnitPlotDto } from './dto/query-unit_plot.dto';

@Injectable()
export class UnitPlotService {
  constructor(
    @InjectModel(UnitPlot) private readonly unitPlotModel: typeof UnitPlot,
  ) {}

  async create(dto: CreateUnitPlotDto): Promise<UnitPlot> {
    try {
      return await this.unitPlotModel.create(dto as any);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Plot code already exists.');
      }
      throw error;
    }
  }

  async findAll(query: QueryUnitPlotDto) {
    const { page = '1', limit = '10', search, ...filters } = query;
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
        { plotCode: { [Op.iLike]: `%${search}%` } },
        { notes: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.unitPlotModel.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows,
      meta: { total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) },
    };
  }

  async findOne(uuid: string): Promise<UnitPlot> {
    const plot = await this.unitPlotModel.findOne({ where: { uuid } });
    if (!plot) throw new NotFoundException(`UnitPlot ${uuid} not found`);
    return plot;
  }

  async update(uuid: string, dto: UpdateUnitPlotDto): Promise<UnitPlot> {
    const plot = await this.findOne(uuid);
    return plot.update(dto as any);
  }

  async remove(uuid: string): Promise<{ message: string }> {
    const plot = await this.findOne(uuid);
    await plot.destroy();
    return { message: 'UnitPlot deleted successfully' };
  }

  async restore(uuid: string): Promise<UnitPlot> {
    const plot = await this.unitPlotModel.findOne({ where: { uuid }, paranoid: false });
    if (!plot) throw new NotFoundException(`UnitPlot ${uuid} not found`);
    if (!plot.deletedAt) throw new BadRequestException('UnitPlot is not deleted');
    await plot.restore();
    return this.findOne(uuid);
  }
}