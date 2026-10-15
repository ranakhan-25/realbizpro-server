import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import {
  HrmShift,
  HrmShiftStatus,
} from 'src/database/models/hrm/employee/hrm_hrm_shift_model';
import { CreateHrmShiftDto } from './dto/create-hrm-shift.dto';
import { UpdateHrmShiftDto } from './dto/update-hrm-shift.dto';
import { QueryHrmShiftDto } from './dto/query-hrm-shift.dto';

@Injectable()
export class HrmShiftService {
  constructor(
    @InjectModel(HrmShift)
    private readonly hrmShiftModel: typeof HrmShift,
  ) {}

  async create(
    dto: CreateHrmShiftDto,
  ): Promise<HrmShift> {
    // name column unique, tai soft-deleted gulo-o check kori
    const existing =
      await this.hrmShiftModel.findOne({
        where: { name: dto.name } as any,
        paranoid: false,
      });

    if (existing) {
      throw new BadRequestException(
        existing.deletedAt
          ? `Shift "${dto.name}" already exists in deleted records, please restore it`
          : `Shift "${dto.name}" already exists`,
      );
    }

    const record =
      await this.hrmShiftModel.create({
        ...dto,
        createdBy: dto.addedById,
        status:
          dto.status ?? HrmShiftStatus.ACTIVE,
      });

    return this.findOne(record.uuid);
  }

  async findAll(query: QueryHrmShiftDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      status,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;

    const offset =
      skip !== undefined && skip !== null
        ? skip
        : (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (status) {
      where.status = status;
    }

    const { rows, count } =
      await this.hrmShiftModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
        paranoid: !withDeleted,
      });

    const totalPages =
      Math.ceil(count / limit) || 1;
    const currentPage =
      skip !== undefined && skip !== null
        ? Math.floor(skip / limit) + 1
        : page;

    const nextPage =
      currentPage < totalPages
        ? currentPage + 1
        : null;

    const previousPage =
      currentPage > 1 ? currentPage - 1 : null;

    return {
      data: rows,
      meta: {
        page: currentPage,
        pageNo: currentPage,
        nextPage,
        previousPage,
        limit,
        skip: offset,
        total: count,
        totalPages,
      },
    };
  }

  async findOne(uuid: string): Promise<HrmShift> {
    const record =
      await this.hrmShiftModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Shift #${uuid} not found`,
      );
    }

    return record;
  }

  async update(
    uuid: string,
    dto: UpdateHrmShiftDto,
  ): Promise<HrmShift> {
    const record =
      await this.hrmShiftModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Shift #${uuid} not found`,
      );
    }

    if (dto.name && dto.name !== record.name) {
      const exists =
        await this.hrmShiftModel.findOne({
          where: {
            name: dto.name,
            uuid: { [Op.ne]: uuid },
          } as any,
          paranoid: false,
        });

      if (exists) {
        throw new BadRequestException(
          exists.deletedAt
            ? `Shift "${dto.name}" already exists in deleted records`
            : `Shift "${dto.name}" already exists`,
        );
      }
    }

    await record.update({
      ...dto,
      updatedBy:
        dto.addedById ?? record.updatedBy,
    });

    return this.findOne(uuid);
  }

  async remove(
    uuid: string,
  ): Promise<{ message: string }> {
    const record =
      await this.hrmShiftModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Shift #${uuid} not found`,
      );
    }

    // status → inactive + soft delete
    await record.update({
      status: HrmShiftStatus.INACTIVE,
    });

    await record.destroy();

    return {
      message: `Shift #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string): Promise<HrmShift> {
    const record =
      await this.hrmShiftModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!record) {
      throw new NotFoundException(
        `Shift #${uuid} not found`,
      );
    }

    if (!record.deletedAt) {
      throw new BadRequestException(
        `Shift #${uuid} is not deleted`,
      );
    }

    // status → active + restore
    await record.restore();
    await record.update({
      status: HrmShiftStatus.ACTIVE,
    });

    return this.findOne(uuid);
  }
}
