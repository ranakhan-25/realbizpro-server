import { BadRequestException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Agent } from 'src/database/models/sales_management/sm_commission_form_agent_model';
import { Commission, CommissionType } from 'src/database/models/sales_management/sm_commission_form_model';
import {
  CreateCommissionDto, QueryCommissionDto, RestoreCommissionDto, UpdateCommissionDto,
} from './dto';

@Injectable()
export class CommissionsService {
  private readonly logger = new Logger(CommissionsService.name);

  constructor(
    @InjectModel(Commission) private commissionModel: typeof Commission,
    @InjectModel(Agent) private agentModel: typeof Agent,
  ) {}

  // ── CREATE ──────────────────────────────────────────
  async create(dto: CreateCommissionDto): Promise<Commission> {
    // 💡 agentUuid বা agentId — দুটোই হ্যান্ডেল করার জন্য ফলব্যাক
    const agentId = (dto as any).agentUuid || (dto as any).agentId;
    
    this.logger.log(`Checking Agent ID: ${agentId}`);
    
    const agent = await this.agentModel.findByPk(agentId);
    if (!agent) {
      throw new NotFoundException(`Agent "${agentId}" not found in database.`);
    }

    if (dto.commissionType === CommissionType.PERCENTAGE && !dto.percentage) {
      throw new BadRequestException('Percentage is required for percentage-based commission');
    }
    if (dto.commissionType === CommissionType.FLAT && !dto.baseAmount) {
      throw new BadRequestException('Base amount is required for flat fee commission');
    }

    return this.commissionModel.create({ ...dto } as any);
  }

  // ── FIND ALL ────────────────────────────────────────
  async findAll(query: QueryCommissionDto) {
    const { search, agentUuid, propertyType, commissionType, page = 1, limit = 10, sortBy = 'createdAt', order = 'DESC', includeDeleted = false } = query;
    
    const where: WhereOptions = {};
    // 💡 agentUuid ডাটা থাকলে ফিল্টার হবে
    if (agentUuid) where['agentId'] = agentUuid; 
    if (propertyType) where['propertyType'] = propertyType;
    if (commissionType) where['commissionType'] = commissionType;
    
    if (search) {
      Object.assign(where, {
        [Op.or]: [
          { notes: { [Op.iLike]: `%${search}%` } },
          // 💡 জয়েন করা এজেন্ট টেবিলের নাম দিয়ে সার্চ
          { '$agent.name$': { [Op.iLike]: `%${search}%` } },
        ],
      });
    }

    const { rows, count } = await this.commissionModel.findAndCountAll({
      where,
      // 💡 জয়েন (include) যুক্ত করা হলো, যাতে এজেন্টের নামও আসে
      include: [{ model: Agent, as: 'agent', required: false }],
      limit,
      offset: (page - 1) * limit,
      order: [[sortBy, order]],
      paranoid: !includeDeleted,
      distinct: true,
    });

    return {
      data: rows,
      meta: {
        total: count,
        page, limit,
        totalPages: Math.ceil(count / limit),
        hasNext: page * limit < count,
        hasPrev: page > 1,
      },
    };
  }

  // ── FIND ONE ────────────────────────────────────────
  async findOne(uuid: string): Promise<Commission> {
    const commission = await this.commissionModel.findByPk(uuid, {

    });
    if (!commission) throw new NotFoundException(`Commission rule "${uuid}" not found`);
    return commission;
  }

  // ── UPDATE ──────────────────────────────────────────
  async update(uuid: string, dto: UpdateCommissionDto): Promise<Commission> {
    const commission = await this.findOne(uuid);
    await commission.update(dto as any);
    return this.findOne(uuid);
  }

  // ── SOFT DELETE ─────────────────────────────────────
  async remove(uuid: string): Promise<{ message: string }> {
    const commission = await this.findOne(uuid);
    await commission.destroy();
    return { message: `Commission rule deleted` };
  }

  // ── FORCE DELETE ────────────────────────────────────
  async forceRemove(uuid: string): Promise<{ message: string }> {
    const commission = await this.commissionModel.findByPk(uuid, { paranoid: false });
    if (!commission) throw new NotFoundException(`Commission rule "${uuid}" not found`);
    await commission.destroy({ force: true });
    return { message: 'Commission rule permanently deleted' };
  }

  // ── RESTORE ─────────────────────────────────────────
  async restore(dto: RestoreCommissionDto): Promise<Commission> {
    const commission = await this.commissionModel.findByPk(dto.uuid, { paranoid: false });
    if (!commission) throw new NotFoundException(`Commission rule "${dto.uuid}" not found`);
    if (!commission.deletedAt) throw new BadRequestException('Commission rule is not deleted');
    await commission.restore();
    return this.findOne(dto.uuid);
  }

  // ── RESTORE ALL ─────────────────────────────────────
  async restoreAll(): Promise<{ restored: number }> {
    const deletedCommissions = await this.commissionModel.findAll({
      where: { deletedAt: { [Op.ne]: null } } as any,
      paranoid: false,
    });
    await Promise.all(deletedCommissions.map((commission) => commission.restore()));
    return { restored: deletedCommissions.length };
  }

  // ── TRASH ───────────────────────────────────────────
  async findDeleted() {
    return this.commissionModel.findAll({
      where: { deletedAt: { [Op.ne]: null } } as any,
      paranoid: false,
    
    });
  }

  // ── AGENTS LIST (for UI dropdown) ───────────────────
  async findAgents() {
    return this.agentModel.findAll({ order: [['name', 'ASC']] });
  }
}