/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateProjectCostDto } from './dto/create-project_cost.dto';
import { CostRefType, ProjectCost } from 'src/database/models/projects/project_cost/pr_project_cost_model';
import { QueryProjectCostDto } from './dto/query-project_cost.dto';
import { UpdateProjectCostDto } from './dto/update-project_cost.dto';

@Injectable()
export class ProjectCostService {
  constructor(
    @InjectModel(ProjectCost)
    private readonly costModel: typeof ProjectCost,
  ) {}

  async create(createDto: CreateProjectCostDto): Promise<ProjectCost> {
    try {
      // Auto-generate Ref No if left blank
      let refNo = createDto.refNo;
      if (!refNo || refNo.trim() === '') {
        const prefixMap = {
          [CostRefType.BILL]: 'BILL',
          [CostRefType.JOURNAL]: 'JRN',
          [CostRefType.PO]: 'PO',
          [CostRefType.MANUAL]: 'MNL',
        };
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        refNo = `${prefixMap[createDto.refType]}-${randomNum}`;
      }

      return await this.costModel.create({
        ...createDto,
        incurredAt: new Date(createDto.incurredAt), // ✅ Convert string to Date
        refNo,
      } as any);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Cost code already exists.');
      }
      throw error;
    }
  }

  async findAll(query: QueryProjectCostDto) {
    const { page = '1', limit = '10', search, ...filters } = query;
    
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
        { costCode: { [Op.iLike]: `%${search}%` } },
        { refNo: { [Op.iLike]: `%${search}%` } },
        { approvedBy: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.costModel.findAndCountAll({
      where: whereClause,
      limit: limitNum,
      offset: offset,
      order: [['incurredAt', 'DESC']],
    });

    return {
      data: rows,
      meta: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    };
  }

  async findOne(uuid: string): Promise<ProjectCost> {
    const cost = await this.costModel.findOne({ where: { uuid } });
    if (!cost) {
      throw new NotFoundException(`Cost with UUID ${uuid} not found`);
    }
    return cost;
  }

  async update(uuid: string, updateDto: UpdateProjectCostDto): Promise<ProjectCost> {
    const cost = await this.findOne(uuid);
    
    // ✅ Convert incurredAt string to Date if provided
    const updateData: any = { ...updateDto };
    if (updateDto.incurredAt) {
      updateData.incurredAt = new Date(updateDto.incurredAt);
    }

    return cost.update(updateData);
  }

  async remove(uuid: string, deletedBy?: string): Promise<{ message: string }> {
    const cost = await this.findOne(uuid);
    
    if (deletedBy) {
      await cost.update({ deletedBy });
    }
    
    await cost.destroy(); // Soft delete
    return { message: 'Cost entry deleted successfully' };
  }

  async restore(uuid: string): Promise<ProjectCost> {
    const cost = await this.costModel.findOne({ 
      where: { uuid },
      paranoid: false 
    });

    if (!cost) {
      throw new NotFoundException(`Cost with UUID ${uuid} not found`);
    }

    if (!cost.deletedAt) {
      throw new BadRequestException('Cost entry is not deleted');
    }

    await cost.restore();
    return cost;
  }

  // Helper endpoint for top Cards (Total Cost, Voucher Count, Attachments Count)
  async getSummary(projectUuid: string) {
    const costs = await this.costModel.findAll({ where: { projectUuid } });
    
    let totalIncurredCost = 0;
    let voucherCount = costs.length;
    let attachmentsIncluded = 0;

    costs.forEach(c => {
      totalIncurredCost += Number(c.amount);
      if (c.attachmentUrl) {
        attachmentsIncluded++;
      }
    });

    return {
      totalIncurredCost,
      voucherCount,
      attachmentsIncluded,
    };
  }
}