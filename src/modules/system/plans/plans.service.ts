import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysPlan } from '@/database/models/system/sys_plan.model';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanResponseDto } from './dto/plan-response.dto';
import { Op } from 'sequelize';

@Injectable()
export class PlansService {
  constructor(
    @InjectModel(SysPlan)
    private readonly planModel: typeof SysPlan,
  ) {}

  private toResponseDto(plan: SysPlan): PlanResponseDto {
    const raw = plan.get({ plain: true });
    return {
      id: raw.id,
      uuid: raw.uuid,
      name: raw.name,
      code: raw.code,
      description: raw.description,
      monthlyPrice: Number(raw.monthlyPrice) || 0,
      yearlyPrice: Number(raw.yearlyPrice) || 0,
      billingCycle: raw.billingCycle,
      durationDays: raw.durationDays,
      trialDays: raw.trialDays,
      maxUsers: raw.maxUsers,
      maxProjects: raw.maxProjects,
      maxStorageMb: raw.maxStorageMb,
      features: raw.features,
      status: raw.status,
      subscribersCount: raw.subscribersCount,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }

  async findAll(query?: { status?: string; search?: string }): Promise<PlanResponseDto[]> {
    const where: any = {};
    if (query?.status) {
      where.status = query.status;
    }
    if (query?.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${query.search}%` } },
        { code: { [Op.iLike]: `%${query.search}%` } },
      ];
    }
    const plans = await this.planModel.findAll({
      where,
      order: [['id', 'ASC']],
    });
    return plans.map((p) => this.toResponseDto(p));
  }

  async findOne(identifier: string | number): Promise<PlanResponseDto> {
    const isNumeric = !isNaN(Number(identifier));
    const where: any = isNumeric
      ? { [Op.or]: [{ id: Number(identifier) }, { uuid: String(identifier) }] }
      : { uuid: String(identifier) };

    const plan = await this.planModel.findOne({ where });
    if (!plan) {
      throw new NotFoundException(`Subscription plan "${identifier}" not found`);
    }
    return this.toResponseDto(plan);
  }

  async create(dto: CreatePlanDto): Promise<PlanResponseDto> {
    const existing = await this.planModel.findOne({
      where: { code: dto.code },
    });
    if (existing) {
      throw new ConflictException(`Plan with code "${dto.code}" already exists`);
    }

    const created = await this.planModel.create(dto as any);
    return this.toResponseDto(created);
  }

  async update(identifier: string | number, dto: UpdatePlanDto): Promise<PlanResponseDto> {
    const isNumeric = !isNaN(Number(identifier));
    const where: any = isNumeric
      ? { [Op.or]: [{ id: Number(identifier) }, { uuid: String(identifier) }] }
      : { uuid: String(identifier) };

    const plan = await this.planModel.findOne({ where });
    if (!plan) {
      throw new NotFoundException(`Subscription plan "${identifier}" not found`);
    }

    if (dto.code && dto.code !== plan.code) {
      const conflict = await this.planModel.findOne({
        where: { code: dto.code, id: { [Op.ne]: plan.id } },
      });
      if (conflict) {
        throw new ConflictException(`Plan with code "${dto.code}" already exists`);
      }
    }

    await plan.update(dto as any);
    return this.toResponseDto(plan);
  }

  async remove(identifier: string | number): Promise<{ message: string; id: number | string }> {
    const isNumeric = !isNaN(Number(identifier));
    const where: any = isNumeric
      ? { [Op.or]: [{ id: Number(identifier) }, { uuid: String(identifier) }] }
      : { uuid: String(identifier) };

    const plan = await this.planModel.findOne({ where });
    if (!plan) {
      throw new NotFoundException(`Subscription plan "${identifier}" not found`);
    }

    await plan.destroy();
    return {
      message: `Plan "${plan.name}" successfully archived`,
      id: identifier,
    };
  }
}
