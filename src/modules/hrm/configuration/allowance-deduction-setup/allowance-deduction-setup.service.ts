import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreateAllowanceDeductionSetupDto } from './dto/create-allowance-deduction-setup.dto';
import { UpdateAllowanceDeductionSetupDto } from './dto/update-allowance-deduction-setup.dto';
import { QueryAllowanceDeductionSetupDto } from './dto/query-allowance-deduction-setup.dto';
import { AllowanceDeductionSetup } from 'src/database/models/hrm/configuration/allowance_deducation_setup';

@Injectable()
export class AllowanceDeductionSetupService {
  constructor(
    @InjectModel(AllowanceDeductionSetup)
    private readonly allowanceDeductionSetupModel: typeof AllowanceDeductionSetup,
  ) {}

  async create(
    dto: CreateAllowanceDeductionSetupDto,
  ): Promise<AllowanceDeductionSetup> {
    const { addedById, ...data } = dto;

    const record =
      await this.allowanceDeductionSetupModel.create(
        {
          ...data,
          createdBy: addedById,
        },
      );

    return this.findOne(record.uuid);
  }

  async findAll(
    query: QueryAllowanceDeductionSetupDto,
  ) {
    const {
      page = 1,
      limit = 10,
      skip,
      type,
      paymentType,
      search,
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

    if (type) {
      where.type = type;
    }

    if (paymentType) {
      where.paymentType = paymentType;
    }

    if (search?.trim()) {
      where.name = {
        [Op.iLike]: `%${search.trim()}%`,
      };
    }

    const { rows, count } =
      await this.allowanceDeductionSetupModel.findAndCountAll(
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

    return {
      data: rows,
      meta: {
        page: currentPage,
        pageNo: currentPage,
        nextPage:
          currentPage < totalPages
            ? currentPage + 1
            : null,
        previousPage:
          currentPage > 1
            ? currentPage - 1
            : null,
        limit,
        skip: offset,
        total: count,
        totalPages,
      },
    };
  }

  async findOne(
    uuid: string,
  ): Promise<AllowanceDeductionSetup> {
    const record =
      await this.allowanceDeductionSetupModel.findOne(
        {
          where: { uuid } as any,
        },
      );

    if (!record) {
      throw new NotFoundException(
        `AllowanceDeductionSetup #${uuid} not found`,
      );
    }

    return record;
  }

  async update(
    uuid: string,
    dto: UpdateAllowanceDeductionSetupDto,
  ): Promise<AllowanceDeductionSetup> {
    const record =
      await this.allowanceDeductionSetupModel.findOne(
        {
          where: { uuid } as any,
        },
      );

    if (!record) {
      throw new NotFoundException(
        `AllowanceDeductionSetup #${uuid} not found`,
      );
    }

    const { addedById, ...updateData } = dto;
    await record.update({
      ...updateData,
      updatedBy: addedById ?? record.updatedBy,
    });

    return this.findOne(uuid);
  }

  async remove(
    uuid: string,
  ): Promise<{ message: string }> {
    const record =
      await this.allowanceDeductionSetupModel.findOne(
        {
          where: { uuid } as any,
        },
      );

    if (!record) {
      throw new NotFoundException(
        `AllowanceDeductionSetup #${uuid} not found`,
      );
    }

    await record.destroy();
    return {
      message: `AllowanceDeductionSetup #${uuid} deleted successfully`,
    };
  }

  async restore(
    uuid: string,
  ): Promise<AllowanceDeductionSetup> {
    const record =
      await this.allowanceDeductionSetupModel.findOne(
        {
          where: { uuid } as any,
          paranoid: false,
        },
      );

    if (!record) {
      throw new NotFoundException(
        `AllowanceDeductionSetup #${uuid} not found`,
      );
    }

    if (!record.deletedAt) {
      throw new BadRequestException(
        `AllowanceDeductionSetup #${uuid} is not deleted`,
      );
    }

    await record.restore();
    return this.findOne(uuid);
  }
}
