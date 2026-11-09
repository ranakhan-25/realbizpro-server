import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import {
  BonusGenerate,
  BonusGenerateStatus,
} from 'src/database/models/hrm/employee/hrm_bonus_generate_model';
import { Bonus } from 'src/database/models/hrm/employee/hrm_bonus_model';
// import { Employee } from 'src/database/models/hrm/employee/hrm_employee_model';
import { CreateBonusGenerateDto } from './dto/create-bonus-generate.dto';
import { UpdateBonusGenerateDto } from './dto/update-bonus-generate.dto';
import { QueryBonusGenerateDto } from './dto/query-bonus-generate.dto';
import { EmployeeList } from 'src/database/models/hrm/employee/hrm_employeeList_model';

@Injectable()
export class BonusGenerateService {
  constructor(
    @InjectModel(BonusGenerate)
    private readonly bonusGenerateModel: typeof BonusGenerate,
    @InjectModel(Bonus)
    private readonly bonusModel: typeof Bonus,
    @InjectModel(EmployeeList)
    private readonly employeeModel: typeof EmployeeList,
  ) {}

  // ---------- helpers ----------

  private async ensureBonusExists(
    bonusId: string,
  ): Promise<void> {
    const bonus = await this.bonusModel.findOne({
      where: { uuid: bonusId } as any,
    });

    if (!bonus) {
      throw new NotFoundException(
        `Bonus #${bonusId} not found`,
      );
    }
  }

  private async ensureEmployeeExists(
    employeeId: string,
  ): Promise<void> {
    const employee =
      await this.employeeModel.findOne({
        where: { uuid: employeeId } as any,
      });

    if (!employee) {
      throw new NotFoundException(
        `Employee #${employeeId} not found`,
      );
    }
  }

  // one employee can get one bonus only once
  private async ensureNotDuplicate(
    bonusId: string,
    employeeId: string,
    excludeUuid?: string,
  ): Promise<void> {
    const where: any = { bonusId, employeeId };

    if (excludeUuid) {
      where.uuid = { [Op.ne]: excludeUuid };
    }

    const existing =
      await this.bonusGenerateModel.findOne({
        where,
      });

    if (existing) {
      throw new BadRequestException(
        'Bonus already generated for this employee',
      );
    }
  }

  // ---------- CRUD ----------

  async create(
    dto: CreateBonusGenerateDto,
  ): Promise<BonusGenerate> {
    await this.ensureBonusExists(dto.bonusId);
    await this.ensureEmployeeExists(
      dto.employeeId,
    );
    await this.ensureNotDuplicate(
      dto.bonusId,
      dto.employeeId,
    );

    const record =
      await this.bonusGenerateModel.create({
        ...dto,
        createdBy: dto.createdBy ?? dto.addedById,
        status:
          dto.status ??
          BonusGenerateStatus.ACTIVE,
      });

    return this.findOne(record.uuid);
  }

  async findAll(query: QueryBonusGenerateDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      bonusId,
      employeeId,
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
    if (query.orgId) {
      where.orgId = query.orgId;
    }
    if ((query as any).projectId) {
      where.projectId = (query as any).projectId;
    }

    if (bonusId) {
      where.bonusId = bonusId;
    }

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (status) {
      where.status = status;
    }

    const { rows, count } =
      await this.bonusGenerateModel.findAndCountAll(
        {
          where,
          limit,
          offset,
          order: [[sortBy, sortOrder]],
          paranoid: !withDeleted,
        },
      );

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

  async findOne(
    uuid: string,
  ): Promise<BonusGenerate> {
    const record =
      await this.bonusGenerateModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Bonus generate #${uuid} not found`,
      );
    }

    return record;
  }

  async update(
    uuid: string,
    dto: UpdateBonusGenerateDto,
  ): Promise<BonusGenerate> {
    const record =
      await this.bonusGenerateModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Bonus generate #${uuid} not found`,
      );
    }

    const bonusChanged =
      !!dto.bonusId &&
      dto.bonusId !== record.bonusId;
    const employeeChanged =
      !!dto.employeeId &&
      dto.employeeId !== record.employeeId;

    if (bonusChanged) {
      await this.ensureBonusExists(dto.bonusId);
    }

    if (employeeChanged) {
      await this.ensureEmployeeExists(
        dto.employeeId,
      );
    }

    if (bonusChanged || employeeChanged) {
      await this.ensureNotDuplicate(
        dto.bonusId ?? record.bonusId,
        dto.employeeId ?? record.employeeId,
        uuid,
      );
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
      await this.bonusGenerateModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `Bonus generate #${uuid} not found`,
      );
    }

    // status → inactive + soft delete
    await record.update({
      status: BonusGenerateStatus.INACTIVE,
    });

    await record.destroy();

    return {
      message: `Bonus generate #${uuid} deleted successfully`,
    };
  }

  async restore(
    uuid: string,
  ): Promise<BonusGenerate> {
    const record =
      await this.bonusGenerateModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!record) {
      throw new NotFoundException(
        `Bonus generate #${uuid} not found`,
      );
    }

    if (!record.deletedAt) {
      throw new BadRequestException(
        `Bonus generate #${uuid} is not deleted`,
      );
    }

    // active duplicate thakle restore block
    await this.ensureNotDuplicate(
      record.bonusId,
      record.employeeId,
      uuid,
    );

    // status → active + restore
    await record.restore();
    await record.update({
      status: BonusGenerateStatus.ACTIVE,
    });

    return this.findOne(uuid);
  }
}
