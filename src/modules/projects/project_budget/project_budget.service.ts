/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BudgetStatus, ProjectBudget } from 'src/database/models/projects/project_budget/pr_project_budget_model';
import { CreateProjectBudgetDto } from './dto/create-project_budget.dto';
import { QueryProjectBudgetDto } from './dto/query-project_budget.dto';
import { UpdateProjectBudgetDto } from './dto/update-project_budget.dto';



@Injectable()
export class ProjectBudgetService {
  constructor(
    @InjectModel(ProjectBudget)
    private readonly budgetModel: typeof ProjectBudget,
  ) {}

  // Helper to calculate status based on variance percentage
  private calculateStatus(planned: number, revised: number): BudgetStatus {
    if (revised <= planned) return BudgetStatus.ON_TRACK;
    const variancePercent = ((revised - planned) / planned) * 100;
    if (variancePercent > 15) return BudgetStatus.EXCEEDED; // e.g., >15% is Exceeded
    if (variancePercent > 0) return BudgetStatus.WARNING; // e.g., 0-15% is Warning
    return BudgetStatus.ON_TRACK;
  }

  async create(createDto: CreateProjectBudgetDto): Promise<ProjectBudget> {
    try {
      // If revisedAmount is not provided, default it to plannedAmount
      const revisedAmount = createDto.revisedAmount ?? createDto.plannedAmount;
      
      // Auto-calculate status
      const status = createDto.status || this.calculateStatus(createDto.plannedAmount, revisedAmount);

      return await this.budgetModel.create({
        ...createDto,
        revisedAmount,
        status,
      } as any);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Budget code already exists.');
      }
      throw error;
    }
  }

  async findAll(query: QueryProjectBudgetDto) {
    const { page = '1', limit = '10', search, ...filters } = query;
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    // Filter out undefined/null/empty string values
    const whereClause: any = {};
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== undefined && value !== null && value !== '') {
        whereClause[key] = value;
      }
    });

    if (search && search.trim() !== '') {
      whereClause[Op.or] = [
        { category: { [Op.iLike]: `%${search}%` } },
        { budgetCode: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.budgetModel.findAndCountAll({
      where: whereClause,
      limit: limitNum,
      offset: offset,
      order: [['createdAt', 'ASC']], // Ordered by creation
    });

    // Map response to include calculated Variance
    const data = rows.map(row => {
      const planned = Number(row.plannedAmount);
      const revised = Number(row.revisedAmount || planned);
      const variance = revised - planned;
      const variancePercent = planned > 0 ? (variance / planned) * 100 : 0;

      return {
        ...row.toJSON(),
        varianceAmount: variance,
        variancePercent: variancePercent.toFixed(2),
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

  async findOne(uuid: string): Promise<ProjectBudget> {
    const budget = await this.budgetModel.findOne({ where: { uuid } });
    if (!budget) {
      throw new NotFoundException(`Budget with UUID ${uuid} not found`);
    }
    return budget;
  }

  async update(uuid: string, updateDto: UpdateProjectBudgetDto): Promise<ProjectBudget> {
    const budget = await this.findOne(uuid);
    
    const planned = updateDto.plannedAmount ?? Number(budget.plannedAmount);
    const revised = updateDto.revisedAmount ?? Number(budget.revisedAmount ?? planned);
    
    // Recalculate status if amounts are changing
    const status = updateDto.status || this.calculateStatus(planned, revised);

    return budget.update({
      ...updateDto,
      revisedAmount: revised,
      status,
    });
  }

  async remove(uuid: string, deletedBy?: string): Promise<{ message: string }> {
    const budget = await this.findOne(uuid);
    
    if (deletedBy) {
      await budget.update({ deletedBy });
    }
    
    await budget.destroy(); // Soft delete
    return { message: 'Budget entry deleted successfully' };
  }

  async restore(uuid: string): Promise<ProjectBudget> {
    const budget = await this.budgetModel.findOne({ 
      where: { uuid },
      paranoid: false 
    });

    if (!budget) {
      throw new NotFoundException(`Budget with UUID ${uuid} not found`);
    }

    if (!budget.deletedAt) {
      throw new BadRequestException('Budget entry is not deleted');
    }

    await budget.restore();
    return budget;
  }

  // Helper endpoint to get summary totals for the top cards (Planned Total, Revised Total, Overall Variance)
  async getSummary(projectUuid: string) {
    const budgets = await this.budgetModel.findAll({ where: { projectUuid } });
    
    let plannedTotal = 0;
    let revisedTotal = 0;

    budgets.forEach(b => {
      plannedTotal += Number(b.plannedAmount);
      revisedTotal += Number(b.revisedAmount || b.plannedAmount);
    });

    const totalVariance = revisedTotal - plannedTotal;
    const variancePercent = plannedTotal > 0 ? (totalVariance / plannedTotal) * 100 : 0;

    return {
      plannedTotal,
      revisedTotal,
      totalVariance,
      variancePercent: variancePercent.toFixed(2),
    };
  }
}