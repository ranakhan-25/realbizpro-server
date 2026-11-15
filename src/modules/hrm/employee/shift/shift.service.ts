import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import {
  Shift,
  ShiftStatus,
} from 'src/database/models/hrm/employee/hrm_shift_model';
import { ShiftSchedule } from 'src/database/models/hrm/employee/hrm_shift_schedule_model';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { QueryShiftDto } from './dto/query-shift.dto';

@Injectable()
export class ShiftService {
  constructor(
    @InjectModel(Shift)
    private readonly shiftModel: typeof Shift,
    // relation: nested schedule read/write er jonno
    @InjectModel(ShiftSchedule)
    private readonly scheduleModel: typeof ShiftSchedule,
    private sequelize: Sequelize,
  ) {}

  // relation: ek shift e ek day ekbar e thakbe
  private assertUniqueDays(
    schedules?: { day: string }[],
  ) {
    if (!schedules?.length) {
      return;
    }

    const days = schedules.map(
      (schedule) => schedule.day,
    );

    if (new Set(days).size !== days.length) {
      throw new BadRequestException(
        'Duplicate day found in schedules',
      );
    }
  }

  async create(
    dto: CreateShiftDto,
    userId?: number,
    currentUser?: any,
  ): Promise<Shift> {
    const { schedules, ...rest } = dto;

    const existing =
      await this.shiftModel.findOne({
        where: {
          name: rest.name,
        },
      });

    if (existing) {
      throw new BadRequestException(
        `Shift "${rest.name}" already exists`,
      );
    }

    this.assertUniqueDays(schedules);

    const transaction =
      await this.sequelize.transaction();

    try {
      const shift = await this.shiftModel.create(
        {
          ...rest,
          status:
            rest.status ?? ShiftStatus.ACTIVE,
        },
        { transaction },
      );

      // relation: shift er schedule gulo ekshathe insert
      if (schedules?.length) {
        await this.scheduleModel.bulkCreate(
          schedules.map((schedule) => ({
            ...schedule,
            shiftId: shift.uuid,
            createdBy: rest.addedById,
          })),
          { transaction },
        );
      }

      await transaction.commit();

      return this.findOne(shift.uuid);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findAll(query: QueryShiftDto, currentUser?: any) {
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
    const effectiveOrgId = (query as any)?.orgId ?? currentUser?.orgId;
    if (effectiveOrgId) {
      where.orgId = effectiveOrgId;
    }
    const effectiveProjectId = (query as any)?.projectId ?? currentUser?.projectId;
    if (effectiveProjectId) {
      where.projectId = effectiveProjectId;
    }

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    if (status) {
      where.status = status;
    }

    const { rows, count } =
      await this.shiftModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
        paranoid: !withDeleted,
        // relation: injected model + alias
        include: [
          {
            model: this.scheduleModel,
            as: 'schedules',
            required: false,
          },
        ],
        // relation: hasMany include-e row duplicate hoy,
        // tai distinct na dile count fulli jai
        distinct: true,
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

  async findOne(uuid: string, currentUser?: any): Promise<Shift> {
    const shift = await this.shiftModel.findOne({
      where: { uuid } as any,
      // relation: single shift er schedule
      include: [
        {
          model: this.scheduleModel,
          as: 'schedules',
          required: false,
        },
      ],
    });

    if (!shift) {
      throw new NotFoundException(
        `Shift #${uuid} not found`,
      );
    }

    return shift;
  }

  async update(uuid: string, dto: UpdateShiftDto, userId?: number, currentUser?: any): Promise<Shift> {
    const shift = await this.shiftModel.findOne({
      where: { uuid } as any,
    });

    if (!shift) {
      throw new NotFoundException(
        `Shift #${uuid} not found`,
      );
    }

    const { schedules, ...rest } = dto;

    if (rest.name && rest.name !== shift.name) {
      const exists =
        await this.shiftModel.findOne({
          where: {
            name: rest.name,
          },
        });

      if (exists && exists.uuid !== uuid) {
        throw new BadRequestException(
          `Shift "${rest.name}" already exists`,
        );
      }
    }

    this.assertUniqueDays(schedules);

    const transaction =
      await this.sequelize.transaction();

    try {
      await shift.update({ ...rest } as any, {
        transaction,
      });

      // relation: schedule pathale purono gulo replace kora hoy
      // force: true — purono row gulo permanent delete, karon
      // update-e replace hoye jai; soft delete rakhle restore-e
      // purono version gulo abar fire ashto
      if (schedules) {
        await this.scheduleModel.destroy({
          where: { shiftId: uuid } as any,
          force: true,
          transaction,
        });

        if (schedules.length) {
          await this.scheduleModel.bulkCreate(
            schedules.map((schedule) => ({
              ...schedule,
              shiftId: uuid,
              createdBy: rest.addedById,
            })),
            { transaction },
          );
        }
      }

      await transaction.commit();

      return this.findOne(uuid);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const shift = await this.shiftModel.findOne({
      where: { uuid } as any,
    });

    if (!shift) {
      throw new NotFoundException(
        `Shift #${uuid} not found`,
      );
    }

    const transaction =
      await this.sequelize.transaction();

    try {
      // status → inactive + soft delete
      await shift.update(
        {
          status: ShiftStatus.INACTIVE,
      deletedBy: userId ? String(userId) : null,
        },
        { transaction },
      );

      await shift.destroy({ transaction });

      // relation: shift er schedule guloo soft delete
      await this.scheduleModel.destroy({
        where: { shiftId: uuid } as any,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }

    return {
      message: `Shift #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<Shift> {
    const shift = await this.shiftModel.findOne({
      where: { uuid } as any,
      paranoid: false,
    });

    if (!shift) {
      throw new NotFoundException(
        `Shift #${uuid} not found`,
      );
    }

    if (!shift.deletedAt) {
      throw new BadRequestException(
        `Shift #${uuid} is not deleted`,
      );
    }

    const transaction =
      await this.sequelize.transaction();

    try {
      // status → active + restore
      await shift.restore({ transaction });
      await shift.update(
        {
          status: ShiftStatus.ACTIVE,
      deletedBy: null,
      updatedBy: userId ? String(userId) : null,
        },
        { transaction },
      );

      // relation: schedule guloo abar restore
      await this.scheduleModel.restore({
        where: { shiftId: uuid } as any,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }

    return this.findOne(uuid);
  }
}
