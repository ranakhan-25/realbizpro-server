/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ProjectProgress } from 'src/database/models/projects/project-progress/pr_project-progress_model';
import { CreateProjectProgressDto } from './dto/create-project_progress.dto';
import { QueryProjectProgressDto } from './dto/query-project_progress.dto';
import { UpdateProjectProgressDto } from './dto/update-project_progress.dto';


@Injectable()
export class ProjectProgressService {
  constructor(
    @InjectModel(ProjectProgress)
    private readonly progressModel: typeof ProjectProgress,
  ) {}

  async create(createDto: CreateProjectProgressDto): Promise<ProjectProgress> {
    try {
      return await this.progressModel.create({
        ...createDto,
        // ✅ Convert string to Date before saving to Database
        asOfDate: new Date(createDto.asOfDate),
      } as any);
    } catch (error) {
      throw error;
    }
  }

  async findAll(query: QueryProjectProgressDto) {
    const { page = '1', limit = '10', search, fromDate, toDate, ...filters } = query;
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    // ✅ Filter out undefined/null/empty string values
    const whereClause: any = {};
    if ((query as any)?.orgId) {
      whereClause.orgId = (query as any).orgId;
    }
    if ((query as any)?.projectId) {
      whereClause.projectId = (query as any).projectId;
    }
    if ((query as any)?.orgId) {
      whereClause.orgId = (query as any).orgId;
    }
    if ((query as any)?.projectId) {
      whereClause.projectId = (query as any).projectId;
    }
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== '') {
        whereClause[key] = value;
      }
    });

    // Date Range Filter
    if (fromDate || toDate) {
      whereClause.asOfDate = {};
      if (fromDate) whereClause.asOfDate[Op.gte] = new Date(fromDate);
      if (toDate) whereClause.asOfDate[Op.lte] = new Date(toDate);
    }

    // Search Filter (remarks or loggedBy)
    if (search && search.trim() !== '') {
      whereClause[Op.or] = [
        { remarks: { [Op.iLike]: `%${search}%` } },
        { loggedBy: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.progressModel.findAndCountAll({
      where: whereClause,
      limit: limitNum,
      offset: offset,
      order: [['asOfDate', 'DESC']], // Latest first
    });

    // Map response to include calculated Variance
    const data = rows.map(row => {
      const physical = Number(row.physicalPct);
      const financial = Number(row.financialPct);
      const variance = physical - financial;

      return {
        ...row.toJSON(),
        variance: variance.toFixed(2),
      };
    });

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

  async findOne(uuid: string): Promise<ProjectProgress> {
    const progress = await this.progressModel.findOne({ where: { uuid } });
    if (!progress) {
      throw new NotFoundException(`Progress with UUID ${uuid} not found`);
    }
    return progress;
  }

  async update(uuid: string, updateDto: UpdateProjectProgressDto): Promise<ProjectProgress> {
    const progress = await this.findOne(uuid);
    
    // ✅ Convert asOfDate to Date if provided
    const updateData: any = { ...updateDto };
    if (updateDto.asOfDate) {
      updateData.asOfDate = new Date(updateDto.asOfDate);
    }

    return progress.update(updateData);
  }

  async remove(uuid: string, deletedBy?: string): Promise<{ message: string }> {
    const progress = await this.findOne(uuid);
    
    if (deletedBy) {
      await progress.update({ deletedBy });
    }
    
    await progress.destroy(); // Soft delete
    return { message: 'Progress entry deleted successfully' };
  }

  async restore(uuid: string): Promise<ProjectProgress> {
    const progress = await this.progressModel.findOne({ 
      where: { uuid },
      paranoid: false 
    });

    if (!progress) {
      throw new NotFoundException(`Progress with UUID ${uuid} not found`);
    }

    if (!progress.deletedAt) {
      throw new BadRequestException('Progress entry is not deleted');
    }

    await progress.restore();
    return progress;
  }

  // Helper endpoint for top Cards (Latest Physical, Latest Financial, Variance, Total Logs)
  async getSummary(projectUuid: string) {
    // Get latest record
    const latest = await this.progressModel.findOne({
      where: { projectUuid },
      order: [['asOfDate', 'DESC']],
    });

    const totalLogs = await this.progressModel.count({ where: { projectUuid } });

    if (!latest) {
      return {
        latestPhysical: 0,
        latestFinancial: 0,
        progressVariance: 0,
        totalLogs: 0,
        status: 'No data',
      };
    }

    const physical = Number(latest.physicalPct);
    const financial = Number(latest.financialPct);
    const variance = physical - financial;

    return {
      latestPhysical: physical,
      latestFinancial: financial,
      progressVariance: variance.toFixed(2),
      totalLogs,
      status: variance > 0 ? 'Ahead of schedule' : variance < 0 ? 'Behind schedule' : 'On schedule',
    };
  }
}