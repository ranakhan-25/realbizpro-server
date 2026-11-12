import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { BookingCreate as Booking, BookingStatus } from '../../../database/models/sales_management/sm_booking_create_model';
import { Cancellation, CancellationStatus } from '../../../database/models/sales_management/sm_cencellationview.model';
import {
  CreateCancellationDto,
} from './dto/create-cencellationview.dto';
import { QueryCancellationDto } from './dto/query-cencellationview.dto';
import { UpdateCancellationDto } from './dto/update-cencellationview.dto';
import { RestoreCancellationDto } from './dto/restore-cencellationview.dto';

@Injectable()
export class CencellationviewService {
  constructor(
    @InjectModel(Cancellation)
    private readonly cancellationModel: typeof Cancellation,
    @InjectModel(Booking)
    private readonly bookingModel: typeof Booking,
  ) {}

  // ── helper: generate next code like CAN-2024-0001 ─────
  private async generateCode(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.cancellationModel.count({
      where: { cancellationCode: { [Op.like]: `CAN-${year}-%` } } as any,
      paranoid: false,
    });
    const seq = String(count + 1).padStart(4, '0');
    return `CAN-${year}-${seq}`;
  }

  // ── CREATE ────────────────────────────────────────────
  async create(dto: CreateCancellationDto): Promise<Cancellation> {
    // 1. Validate booking exists & is active
    const booking = await this.bookingModel.findOne({
      where: { uuid: dto.bookingId },
    });
    if (!booking) {
      throw new NotFoundException(`Booking "${dto.bookingId}" not found`);
    }
    if (booking.status === BookingStatus.CANCELLED) {
      throw new ConflictException('Booking is already cancelled');
    }

    // 2. Acknowledgement guard — matches UI checkbox
    if (!dto.isAcknowledged) {
      throw new BadRequestException(
        'You must acknowledge the financial impact before submitting.',
      );
    }

    // 3. Business rule: refund + penalty must equal paid amount
    const paid = Number((booking as any).paidAmount ?? 0);
    if (Number(dto.refundAmount) + Number(dto.penaltyFee) > paid) {
      throw new BadRequestException(
        'Refund + penalty cannot exceed the total paid amount',
      );
    }
    if (Number(dto.refundAmount) > paid) {
      throw new BadRequestException('Refund cannot exceed total paid amount');
    }

    // 4. Prevent duplicate cancellation for same booking
    const existing = await this.cancellationModel.findOne({
      where: { bookingId: booking.id },
      paranoid: false,
    });
    if (existing) {
      throw new ConflictException(
        'A cancellation record already exists for this booking',
      );
    }

    // 5. Create cancellation
    const cancellationCode = await this.generateCode();
    const cancellation = await this.cancellationModel.create({
      ...dto,
      bookingId: booking.id,
      cancellationCode,
      paidAmount: paid,
      status: dto.status ?? CancellationStatus.PENDING,
      processedAt: dto.status === CancellationStatus.COMPLETED ? new Date() : null,
    } as any);

    // 6. Update booking status atomically-ish
    await booking.update({ status: BookingStatus.CANCELLED });

    return this.findOne(cancellation.id);
  }

  // ── FIND ALL ──────────────────────────────────────────
  async findAll(query: QueryCancellationDto) {
    const {
      search,
      status,
      reason,
      bookingId,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'DESC',
      includeDeleted = false,
    } = query;

    const where: WhereOptions = {};
    if (status) where['status'] = status;
    if (reason) where['reason'] = reason;
    if (bookingId) where['bookingId'] = bookingId;

    if (search) {
      Object.assign(where, {
        [Op.or]: [
          { cancellationCode: { [Op.iLike]: `%${search}%` } },
          { notes: { [Op.iLike]: `%${search}%` } },
          { '$booking.buyer$': { [Op.iLike]: `%${search}%` } },
          { '$booking.property$': { [Op.iLike]: `%${search}%` } },
        ],
      });
    }

    const { rows, count } = await this.cancellationModel.findAndCountAll({
      where,
    
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
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        hasNext: page * limit < count,
        hasPrev: page > 1,
      },
    };
  }

  // ── STATS (dash card) ─────────────────────────────────
  async getStats() {
    const [total, pending, completed, refundSum, penaltySum] =
      await Promise.all([
        this.cancellationModel.count(),
        this.cancellationModel.count({
          where: { status: CancellationStatus.PENDING },
        }),
        this.cancellationModel.count({
          where: { status: CancellationStatus.COMPLETED },
        }),
        this.cancellationModel.sum('refundAmount'),
        this.cancellationModel.sum('penaltyFee'),
      ]);

    return {
      total,
      pending,
      completed,
      totalRefunded: Number(refundSum || 0),
      totalPenalty: Number(penaltySum || 0),
    };
  }

  // ── ACTIVE BOOKINGS (form picker) ─────────────────────
  async findActiveBookings(search?: string) {
    const where: WhereOptions = { status: BookingStatus.CONFIRMED };
    if (search) {
      Object.assign(where, {
        [Op.or]: [
          { bookingCode: { [Op.iLike]: `%${search}%` } },
          { buyer: { [Op.iLike]: `%${search}%` } },
          { property: { [Op.iLike]: `%${search}%` } },
        ],
      });
    }
    return this.bookingModel.findAll({
      where,
      order: [['bookingDate', 'DESC']],
    });
  }

  // ── FIND ONE ──────────────────────────────────────────
  async findOne(id: string): Promise<Cancellation> {
    const cancellation = await this.cancellationModel.findByPk(id, {
      include: [{ model: Booking, as: 'booking' }],
    });
    if (!cancellation) {
      throw new NotFoundException(`Cancellation "${id}" not found`);
    }
    return cancellation;
  }

  // ── UPDATE ────────────────────────────────────────────
  async update(
    id: string,
    dto: UpdateCancellationDto,
  ): Promise<Cancellation> {
    const cancellation = await this.findOne(id);

    if (dto.isAcknowledged === false) {
      throw new BadRequestException(
        'Acknowledgement cannot be revoked after creation',
      );
    }

    if (
      dto.refundAmount != null &&
      dto.penaltyFee != null &&
      Number(dto.refundAmount) + Number(dto.penaltyFee) >
        Number(cancellation.paidAmount)
    ) {
      throw new BadRequestException(
        'Refund + penalty cannot exceed the total paid amount',
      );
    }

    await cancellation.update({
      ...dto,
      processedAt:
        dto.status === CancellationStatus.COMPLETED
          ? new Date()
          : cancellation.processedAt,
    } as any);

    return this.findOne(id);
  }

  // ── SOFT DELETE ───────────────────────────────────────
  async remove(id: string): Promise<{ message: string }> {
    const cancellation = await this.findOne(id);
    await cancellation.destroy();
    return { message: `Cancellation "${cancellation.cancellationCode}" deleted` };
  }

  // ── FORCE DELETE ──────────────────────────────────────
  async forceRemove(id: string): Promise<{ message: string }> {
    const cancellation = await this.cancellationModel.findByPk(id, {
      paranoid: false,
    });
    if (!cancellation) {
      throw new NotFoundException(`Cancellation "${id}" not found`);
    }
    await cancellation.destroy({ force: true });
    return { message: 'Cancellation permanently deleted' };
  }

  // ── RESTORE ───────────────────────────────────────────
  async restore(dto: RestoreCancellationDto): Promise<Cancellation> {
    const cancellation = await this.cancellationModel.findByPk(dto.uuid, {
      paranoid: false,
    });
    if (!cancellation) {
      throw new NotFoundException(`Cancellation "${dto.uuid}" not found`);
    }
    if (!cancellation.deletedAt) {
      throw new BadRequestException('Cancellation is not deleted');
    }
    await cancellation.restore();
    return this.findOne(dto.uuid);
  }

  // ── RESTORE ALL ───────────────────────────────────────
  async restoreAll(): Promise<{ restored: number }> {
    const count = await this.cancellationModel.restore({
      where: { deletedAt: { [Op.ne]: null } } as any,
    });
    return { restored: Number(count ?? 0) };
  }

  // ── TRASH ─────────────────────────────────────────────
  async findDeleted() {
    return this.cancellationModel.findAll({
      where: { deletedAt: { [Op.ne]: null } } as any,
      paranoid: false,
   
    });
  }
}
