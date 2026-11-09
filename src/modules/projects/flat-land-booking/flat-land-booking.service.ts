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
import { ProjectTeamMember } from 'src/database/models/projects/project-team-member/pr_project_team_member.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
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
    @InjectModel(ProjectTeamMember) private readonly teamMembers: typeof ProjectTeamMember,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async create(dto: CreateFlatLandBookingDto, userId?: number, currentUser?: any) {
    const uuid = await this.sequelize.transaction(async (transaction) => {
      let project = dto.projectId
        ? await this.projectModel.findOne({
            where: { uuid: dto.projectId } as WhereOptions<Project>,
            transaction,
          })
        : await this.projectModel.findOne({ transaction });

      if (!project) {
        project = await this.projectModel.create(
          {
            code: 'PRJ-MAIN',
            name: 'Main Real Estate Project',
            status: 'ACTIVE',
          } as any,
          { transaction },
        );
      }

      let property = dto.flatLandId
        ? await this.flatLandModel.findOne({
            where: { uuid: dto.flatLandId } as WhereOptions<FlatLand>,
            transaction,
          })
        : await this.flatLandModel.findOne({ transaction });

      if (!property) {
        property = await this.flatLandModel.create(
          {
            projectId: project.uuid,
            flatLandNo: 'UNIT-AUTO',
            propertyType: 'flat',
            status: FlatLandStatus.AVAILABLE,
          } as any,
          { transaction },
        );
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
          projectId: project.uuid,
          flatLandId: property.uuid,
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

  async findAll(
    query: QueryFlatLandBookingDto,
    currentUser?: any,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search?.trim();
    const where: WhereOptions<FlatLandBooking> = {
      ...(query.projectId ? { projectId: query.projectId } : {}),
      ...(query.salesBy ? { salesBy: { [Op.iLike]: `%${query.salesBy.trim()}%` } } : {}),
      ...(query.dateFrom || query.dateTo ? { bookingDate: { ...(query.dateFrom ? { [Op.gte]: query.dateFrom } : {}), ...(query.dateTo ? { [Op.lte]: query.dateTo } : {}) } } : {}),
      ...(search ? { [Op.or]: [
            { code: { [Op.iLike]: `%${search}%` } },
            { customerName: { [Op.iLike]: `%${search}%` } },
            { salesBy: { [Op.iLike]: `%${search}%` } },
          ] } : {}),
    } as WhereOptions<FlatLandBooking>;
    if (query.teamId) {
      const teamMember = await this.teamMembers.findOne({ where: { uuid: query.teamId } as WhereOptions<ProjectTeamMember>, attributes: ['projectId'] });
      if (!teamMember) return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
      Object.assign(where, { projectId: teamMember.projectId });
    }
    const { rows, count } = await this.bookingModel.findAndCountAll({
      where: where as WhereOptions<FlatLandBooking>,
      include: [
        { model: this.projectModel, as: 'project', attributes: ['uuid', 'code', 'name'], include: [{ association: 'sites', attributes: ['uuid', 'code', 'name'], required: false }] },
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

  async dropdowns() {
    const [projects, properties, statuses, teams, salesPeople] = await Promise.all([
      this.projectModel.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.flatLandModel.findAll({ where: { status: FlatLandStatus.AVAILABLE }, attributes: ['uuid', 'flatLandNo', 'propertyType', 'projectId', 'projectName', 'siteName'], order: [['flatLandNo', 'ASC']] }),
      this.bookingModel.findAll({ attributes: ['status'], group: ['status'], order: [['status', 'ASC']] }),
      this.teamMembers.findAll({ attributes: ['uuid', 'name', 'email', 'projectId'], order: [['name', 'ASC']] }),
      this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'userCode', 'name'], order: [['name', 'ASC']] }),
    ]);
    return { projects, properties, teams, salesPeople, statuses: statuses.map(row => ({ value: row.status, name: row.status })) };
  }

  async findReport(
    report: 'sales' | 'collection' | 'aging' | 'installments',
    query: QueryFlatLandBookingDto,
    currentUser?: any,
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
    const where: any = {
      [Op.and]: [reportWhere, searchWhere],
    };
    const effectiveOrgId = (query as any)?.orgId ?? currentUser?.orgId;
    if (effectiveOrgId) {
      where.orgId = effectiveOrgId;
    }
    const effectiveProjectId = (query as any)?.projectId ?? currentUser?.projectId;
    if (effectiveProjectId) {
      where.projectId = effectiveProjectId;
    }
    const { rows, count } = await this.bookingModel.findAndCountAll({
      where: where as WhereOptions<FlatLandBooking>,
      include: [
        { model: this.projectModel, as: 'project', attributes: ['uuid', 'code', 'name'], include: [{ association: 'sites', attributes: ['uuid', 'code', 'name'], required: false }] },
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

  async findPlotDistribution(query: QueryFlatLandBookingDto, currentUser?: any) {
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
        { model: this.projectModel, as: 'project', attributes: ['uuid', 'code', 'name'], include: [{ association: 'sites', attributes: ['uuid', 'code', 'name'], required: false }] },
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

  async findOne(uuid: string, currentUser?: any) {
    const booking = await this.bookingModel.findOne({
      where: { uuid } as WhereOptions<FlatLandBooking>,
      include: [
        { model: this.projectModel, as: 'project', attributes: ['uuid', 'code', 'name'], include: [{ association: 'sites', attributes: ['uuid', 'code', 'name'], required: false }] },
        { model: this.flatLandModel, as: 'flatLand', attributes: ['uuid', 'flatLandNo', 'projectName'] },
      ],
    });
    if (!booking) {
      throw new NotFoundException(`Flat/Land booking "${uuid}" not found`);
    }
    return booking;
  }

  async update(uuid: string, dto: UpdateFlatLandBookingDto, userId?: number, currentUser?: any) {
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

  async remove(uuid: string, userId?: number, currentUser?: any) {
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

  async restore(uuid: string, userId?: number, currentUser?: any) {
    await this.sequelize.transaction(async transaction => {
      const booking = await this.bookingModel.findOne({ where: { uuid } as WhereOptions<FlatLandBooking>, paranoid: false, transaction });
      if (!booking) throw new NotFoundException(`Flat/Land booking "${uuid}" not found`);
      if (!booking.deletedAt) throw new BadRequestException(`Flat/Land booking "${uuid}" is not deleted`);
      const property = await this.flatLandModel.findOne({ where: { uuid: booking.flatLandId } as WhereOptions<FlatLand>, transaction });
      if (!property) throw new NotFoundException(`Booked property "${booking.flatLandId}" not found`);
      if (property.status !== FlatLandStatus.AVAILABLE) throw new ConflictException('The property is no longer available for this booking');
      await booking.restore({ transaction });
      await property.update({ status: FlatLandStatus.BOOKED, customerName: booking.customerName } as any, { transaction });
    });
    return this.findOne(uuid);
  }
}
