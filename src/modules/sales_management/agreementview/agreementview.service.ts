import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Agreement } from '../../../database/models/sales_management/sm_agreement_view.model';
import {
  CreateAgreementDto,
  QueryAgreementDto,
  RestoreAgreementDto,
  UpdateAgreementDto,
} from './dto/index';

@Injectable()
export class AgreementsService {
  constructor(
    @InjectModel(Agreement)
    private readonly agreementModel: typeof Agreement,
  ) {}

  // ── CREATE ──────────────────────────────────────────────
  async create(dto: CreateAgreementDto): Promise<Agreement> {
    const exists = await this.agreementModel.findOne({
      where: { agreementCode: dto.agreementCode },
      paranoid: false,
    });
    if (exists) {
      throw new ConflictException(
        `Agreement code "${dto.agreementCode}" already exists`,
      );
    }

    if (Number(dto.advance) > Number(dto.price)) {
      throw new BadRequestException('Advance cannot exceed total price');
    }

    return this.agreementModel.create({ ...dto } as any);
  }

  // ── FIND ALL (pagination + search + filter) ────────────
  async findAll(query: QueryAgreementDto) {
    const {
      search,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'DESC',
      includeDeleted = false,
    } = query;

    const where: WhereOptions = {};

    if (status) where['status'] = status;

    if (search) {
      Object.assign(where, {
        [Op.or]: [
          { buyer: { [Op.iLike]: `%${search}%` } },
          { property: { [Op.iLike]: `%${search}%` } },
          { agreementCode: { [Op.iLike]: `%${search}%` } },
        ],
      });
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await this.agreementModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, order]],
      paranoid: !includeDeleted,
    });

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        hasNext: page * limit < count,
        hasPrev: page > 1,
      },
    };
  }

  // ── STATS ──────────────────────────────────────────────
  async getStats() {
    const total = await this.agreementModel.count();
    const signed = await this.agreementModel.count({
      where: { status: 'Signed' as any },
    });
    const pending = await this.agreementModel.count({
      where: { status: 'Pending' as any },
    });
    const draft = await this.agreementModel.count({
      where: { status: 'Draft' as any },
    });
    const totalValueRaw = (await this.agreementModel.sum('price')) || 0;

    return {
      total,
      signed,
      pending,
      draft,
      pendingAction: pending + draft,
      totalValue: Number(totalValueRaw),
    };
  }

  // ── FIND ONE ───────────────────────────────────────────
  async findOne(id: string): Promise<Agreement> {
    const agreement = await this.agreementModel.findByPk(id);
    if (!agreement) {
      throw new NotFoundException(`Agreement with ID "${id}" not found`);
    }
    return agreement;
  }

  // ── UPDATE ─────────────────────────────────────────────
  async update(id: string, dto: UpdateAgreementDto): Promise<Agreement> {
    const agreement = await this.findOne(id);

    if (dto.agreementCode && dto.agreementCode !== agreement.agreementCode) {
      const dup = await this.agreementModel.findOne({
        where: { agreementCode: dto.agreementCode },
        paranoid: false,
      });
      if (dup) {
        throw new ConflictException(
          `Agreement code "${dto.agreementCode}" already exists`,
        );
      }
    }

    if (
      dto.advance != null &&
      dto.price != null &&
      Number(dto.advance) > Number(dto.price)
    ) {
      throw new BadRequestException('Advance cannot exceed total price');
    }

    await agreement.update(dto as any);
    return agreement;
  }

  // ── SOFT DELETE ────────────────────────────────────────
  async remove(id: string): Promise<{ message: string }> {
    const agreement = await this.findOne(id);
    await agreement.destroy(); // paranoid soft delete
    return { message: `Agreement "${agreement.agreementCode}" deleted` };
  }

  // ── FORCE DELETE (permanent) ───────────────────────────
  async forceRemove(id: string): Promise<{ message: string }> {
    const agreement = await this.agreementModel.findByPk(id, {
      paranoid: false,
    });
    if (!agreement) {
      throw new NotFoundException(`Agreement with ID "${id}" not found`);
    }
    await agreement.destroy({ force: true });
    return { message: `Agreement permanently deleted` };
  }

  // ── RESTORE ────────────────────────────────────────────
  async restore(dto: RestoreAgreementDto): Promise<Agreement> {
    const agreement = await this.agreementModel.findByPk(dto.uuid, {
      paranoid: false,
    });
    if (!agreement) {
      throw new NotFoundException(`Agreement with UUID "${dto.uuid}" not found`);
    }
    if (!agreement.deletedAt) {
      throw new BadRequestException('Agreement is not deleted');
    }
    await agreement.restore();
    return agreement;
  }

  // ── RESTORE ALL ────────────────────────────────────────
  async restoreAll(): Promise<{ restored: number }> {
    const count = await this.agreementModel.restore({
      where: { deletedAt: { [Op.ne]: null } } as any,
    });
    return { restored: Number(count ?? 0) };
  }

  // ── TRASH LIST ─────────────────────────────────────────
  async findDeleted() {
    return this.agreementModel.findAll({
      where: { deletedAt: { [Op.ne]: null } } as any,
      paranoid: false,
    });
  }
}
