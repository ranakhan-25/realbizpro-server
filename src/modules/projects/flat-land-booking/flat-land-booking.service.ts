import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { FlatLand, FlatLandStatus } from 'src/database/models/projects/flatland/pr_flatland.model';
import { FlatLandBooking } from 'src/database/models/projects/flat-land-booking/pr_flat_land_booking.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { CreateFlatLandBookingDto } from './dto/create-flat-land-booking.dto';
import { QueryFlatLandBookingDto } from './dto/query-flat-land-booking.dto';
import { UpdateFlatLandBookingDto } from './dto/update-flat-land-booking.dto';

@Injectable()
export class FlatLandBookingService {
  constructor(
    @InjectModel(FlatLandBooking)
    private readonly bookingModel: typeof FlatLandBooking,
    @InjectModel(FlatLand)
    private readonly flatLandModel: typeof FlatLand,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async create(dto: CreateFlatLandBookingDto, userId?: number) {
    const uuid = await this.sequelize.transaction(async (transaction) => {
      const project = await this.projectModel.findOne({
        where: { uuid: dto.projectId } as WhereOptions<Project>,
        transaction,
      });
      const property = await this.flatLandModel.findOne({
        where: { uuid: dto.flatLandId } as WhereOptions<FlatLand>,
        transaction,
      });
      if (!project || !property || property.projectId !== dto.projectId) {
        throw new BadRequestException(
          'Project and available flat/land selection do not match',
        );
      }
      if (property.status !== FlatLandStatus.AVAILABLE) {
        throw new ConflictException('Selected flat/land is not available');
      }
      const duplicate = await this.bookingModel.findOne({
        where: { code: dto.code } as WhereOptions<FlatLandBooking>,
        transaction,
      });
      if (duplicate) {
        throw new ConflictException(`Booking code "${dto.code}" already exists`);
      }
      const grandTotal = dto.grandTotal ?? 0;
      const booking = await this.bookingModel.create(
        {
          ...dto,
          bookingDate: new Date(dto.bookingDate),
          rate: dto.rate ?? 0,
          otherCost: dto.otherCost ?? 0,
          parking: dto.parking ?? 0,
          utilityCharge: dto.utilityCharge ?? 0,
          discount: dto.discount ?? 0,
          subtotal: dto.subtotal ?? 0,
          grandTotal,
          paid: dto.paid ?? 0,
          due: dto.due ?? Math.max(grandTotal - (dto.paid ?? 0), 0),
          status: dto.status ?? 'Pending',
          createdBy: userId === undefined ? undefined : String(userId),
        },
        { transaction },
      );
      await property.update(
        {
          status: FlatLandStatus.BOOKED,
          customerName: dto.customerName,
        },
        { transaction },
      );
      return booking.uuid;
    });
    return this.findOne(uuid);
  }

  async findAll(query: QueryFlatLandBookingDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search?.trim();
    const where: WhereOptions<FlatLandBooking> = search
      ? {
          [Op.or]: [
            { code: { [Op.iLike]: `%${search}%` } },
            { customerName: { [Op.iLike]: `%${search}%` } },
            { salesBy: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};
    const { rows, count } = await this.bookingModel.findAndCountAll({
      where: where as WhereOptions<FlatLandBooking>,
      include: [
        { model: this.projectModel, as: 'project', attributes: ['uuid', 'code', 'name'] },
        { model: this.flatLandModel, as: 'flatLand', attributes: ['uuid', 'flatLandNo', 'projectName'] },
      ],
      limit,
      offset: (page - 1) * limit,
      order: [['bookingDate', 'DESC']],
    });
    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  }

  async findReport(
    report: 'sales' | 'collection' | 'aging' | 'installments',
    query: QueryFlatLandBookingDto,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search?.trim();
    const reportWhere: WhereOptions<FlatLandBooking> =
      report === 'collection'
        ? { paid: { [Op.gt]: 0 } }
        : report === 'aging'
          ? { due: { [Op.gt]: 0 } }
          : report === 'installments'
            ? {
                [Op.or]: [
                  { due: { [Op.gt]: 0 } },
                  { grandTotal: { [Op.gt]: 0 } },
                ],
              }
            : {};
    const searchWhere: WhereOptions<FlatLandBooking> = search
      ? {
          [Op.or]: [
            { code: { [Op.iLike]: `%${search}%` } },
            { customerName: { [Op.iLike]: `%${search}%` } },
            { salesBy: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};
    const where: WhereOptions<FlatLandBooking> = {
      [Op.and]: [reportWhere, searchWhere],
    };
    const { rows, count } = await this.bookingModel.findAndCountAll({
      where: where as WhereOptions<FlatLandBooking>,
      include: [
        { model: this.projectModel, as: 'project', attributes: ['uuid', 'code', 'name'] },
        { model: this.flatLandModel, as: 'flatLand', attributes: ['uuid', 'flatLandNo', 'projectName'] },
      ],
      limit,
      offset: (page - 1) * limit,
      order: [['bookingDate', 'DESC']],
    });
    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  }

  async findPlotDistribution(query: QueryFlatLandBookingDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search?.trim();
    const where: WhereOptions<FlatLand> = {
      propertyType: 'land',
      ...(search
        ? {
            [Op.or]: [
              { flatLandNo: { [Op.iLike]: `%${search}%` } },
              { siteName: { [Op.iLike]: `%${search}%` } },
              { blockName: { [Op.iLike]: `%${search}%` } },
              { customerName: { [Op.iLike]: `%${search}%` } },
              { status: { [Op.iLike]: `%${search}%` } },
            ],
          }
        : {}),
    };
    const { rows, count } = await this.flatLandModel.findAndCountAll({
      where: where as WhereOptions<FlatLand>,
      include: [
        { model: this.projectModel, as: 'project', attributes: ['uuid', 'code', 'name'] },
      ],
      limit,
      offset: (page - 1) * limit,
      order: [['flatLandNo', 'ASC']],
    });
    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  }

  async findOne(uuid: string) {
    const booking = await this.bookingModel.findOne({
      where: { uuid } as WhereOptions<FlatLandBooking>,
      include: [
        { model: this.projectModel, as: 'project', attributes: ['uuid', 'code', 'name'] },
        { model: this.flatLandModel, as: 'flatLand', attributes: ['uuid', 'flatLandNo', 'projectName'] },
      ],
    });
    if (!booking) {
      throw new NotFoundException(`Flat/Land booking "${uuid}" not found`);
    }
    return booking;
  }

  async update(uuid: string, dto: UpdateFlatLandBookingDto, userId?: number) {
    await this.sequelize.transaction(async (transaction) => {
      const booking = await this.bookingModel.findOne({
        where: { uuid } as WhereOptions<FlatLandBooking>,
        transaction,
      });
      if (!booking) {
        throw new NotFoundException(`Flat/Land booking "${uuid}" not found`);
      }
      const projectId = dto.projectId ?? booking.projectId;
      const flatLandId = dto.flatLandId ?? booking.flatLandId;
      const property = await this.flatLandModel.findOne({
        where: { uuid: flatLandId } as WhereOptions<FlatLand>,
        transaction,
      });
      if (!property || property.projectId !== projectId) {
        throw new BadRequestException(
          'Project and flat/land selection do not match',
        );
      }
      if (flatLandId !== booking.flatLandId) {
        if (property.status !== FlatLandStatus.AVAILABLE) {
          throw new ConflictException('Selected flat/land is not available');
        }
        const previous = await this.flatLandModel.findOne({
          where: { uuid: booking.flatLandId } as WhereOptions<FlatLand>,
          transaction,
        });
        await previous?.update(
          { status: FlatLandStatus.AVAILABLE, customerName: null },
          { transaction },
        );
      }
      await property.update(
        {
          status: FlatLandStatus.BOOKED,
          customerName: dto.customerName ?? booking.customerName,
        },
        { transaction },
      );
      const { bookingDate, ...bookingFields } = dto;
      await booking.update(
        {
          ...bookingFields,
          ...(bookingDate ? { bookingDate: new Date(bookingDate) } : {}),
          updatedBy: userId === undefined ? undefined : String(userId),
        },
        { transaction },
      );
    });
    return this.findOne(uuid);
  }

  async remove(uuid: string) {
    await this.sequelize.transaction(async (transaction) => {
      const booking = await this.bookingModel.findOne({
        where: { uuid } as WhereOptions<FlatLandBooking>,
        transaction,
      });
      if (!booking) {
        throw new NotFoundException(`Flat/Land booking "${uuid}" not found`);
      }
      const property = await this.flatLandModel.findOne({
        where: { uuid: booking.flatLandId } as WhereOptions<FlatLand>,
        transaction,
      });
      if (property) {
        await property.update(
          { status: FlatLandStatus.AVAILABLE, customerName: null },
          { transaction },
        );
      }
      await booking.destroy({ transaction });
    });
    return { message: `Flat/Land booking "${uuid}" deleted successfully` };
  }
}
