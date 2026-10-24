/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ControlStatus, ProjectControl } from 'src/database/models/projects/project_control/pr_project_control_model';
import { CreateProjectControlDto } from './dto/create-project_control.dto';
import { QueryProjectControlDto } from './dto/query-project_control.dto';
import { UpdateProjectControlDto } from './dto/update-project_control.dto';


@Injectable()
export class ProjectControlService {
  constructor(
    @InjectModel(ProjectControl)
    private readonly controlModel: typeof ProjectControl,
  ) {}

  // Helper: Calculate Status based on Variance
  private calculateStatus(threshold: number, actual: number): ControlStatus {
    const variance = actual - threshold;
    
    if (variance <= 0) {
      return ControlStatus.OK;
    }
    
    // Example Logic: 
    // If variance is more than 10% of threshold -> Breach
    // If variance is less than or equal to 10% -> Warning
    const variancePercent = (variance / threshold) * 100;
    
    if (variancePercent > 10) {
      return ControlStatus.BREACH;
    } else {
      return ControlStatus.WARNING;
    }
  }

  async create(createDto: CreateProjectControlDto): Promise<ProjectControl> {
    try {
      return await this.controlModel.create(createDto as any);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Control code already exists.');
      }
      throw error;
    }
  }

  async findAll(query: QueryProjectControlDto) {
    const { page = '1', limit = '10', search, status, ...filters } = query;
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const whereClause: any = {};
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== '') {
        whereClause[key] = value;
      }
    });

    if (search && search.trim() !== '') {
      whereClause[Op.or] = [
        { controlCode: { [Op.iLike]: `%${search}%` } },
        { actionStep: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.controlModel.findAndCountAll({
      where: whereClause,
      limit: limitNum,
      offset: offset,
      order: [['createdAt', 'DESC']],
    });

    // Calculate Variance and Status for each row
    let data = rows.map(row => {
      const threshold = Number(row.thresholdTarget);
      const actual = Number(row.actualValue);
      const variance = actual - threshold;
      const calculatedStatus = this.calculateStatus(threshold, actual);

      return {
        ...row.toJSON(),
        variance,
        status: calculatedStatus,
      };
    });

    // Filter by Status (If applied in query)
    if (status) {
      data = data.filter(item => item.status === status);
    }

    return {
      data,
      meta: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    };
  }

  async findOne(uuid: string): Promise<ProjectControl> {
    const control = await this.controlModel.findOne({ where: { uuid } });
    if (!control) {
      throw new NotFoundException(`Control with UUID ${uuid} not found`);
    }
    return control;
  }

  async update(uuid: string, updateDto: UpdateProjectControlDto): Promise<ProjectControl> {
    const control = await this.findOne(uuid);
    return control.update(updateDto);
  }

  async remove(uuid: string, deletedBy?: string): Promise<{ message: string }> {
    const control = await this.findOne(uuid);
    
    if (deletedBy) {
      await control.update({ deletedBy });
    }
    
    await control.destroy(); // Soft delete
    return { message: 'Control entry deleted successfully' };
  }

  async restore(uuid: string): Promise<ProjectControl> {
    const control = await this.controlModel.findOne({ 
      where: { uuid },
      paranoid: false 
    });

    if (!control) {
      throw new NotFoundException(`Control with UUID ${uuid} not found`);
    }

    if (!control.deletedAt) {
      throw new BadRequestException('Control entry is not deleted');
    }

    await control.restore();
    return control;
  }

  // Helper endpoint for top Cards (Total Controls, OK, Warning, Critical Breaches)
  async getSummary(projectUuid: string) {
    const controls = await this.controlModel.findAll({ where: { projectUuid } });
    
    let totalControls = controls.length;
    let okCount = 0;
    let warningCount = 0;
    let breachCount = 0;

    controls.forEach(c => {
      const threshold = Number(c.thresholdTarget);
      const actual = Number(c.actualValue);
      const status = this.calculateStatus(threshold, actual);

      if (status === ControlStatus.OK) okCount++;
      else if (status === ControlStatus.WARNING) warningCount++;
      else if (status === ControlStatus.BREACH) breachCount++;
    });

    return {
      totalControls,
      okCount,
      warningCount,
      breachCount,
    };
  }
}