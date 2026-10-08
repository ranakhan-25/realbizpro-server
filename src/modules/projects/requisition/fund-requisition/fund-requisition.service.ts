/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op, WhereOptions } from 'sequelize';

import { FundRequisitionAttributes } from 'src/database/types/fundrequisition.types';

import { CreateFundRequisitionDto } from './dto/create-fund-requisition.dto';
import { UpdateFundRequisitionDto } from './dto/update-fund-requisition.dto';
import { QueryFundRequisitionDto } from './dto/query-fund-requisition.dto';
import {
  ApproveStatus,
  FundRequisition,
  PaymentStatus,
} from 'src/database/models/projects/Requisition/pr_fund_requisition_model';

@Injectable()
export class FundRequisitionService {
  constructor(
    @InjectModel(FundRequisition)
    private readonly fundRequisitionModel: typeof FundRequisition,
  ) {}

  // CREATE
  async create(dto: CreateFundRequisitionDto) {
    const fundRequisition =
      await this.fundRequisitionModel.create({
        date: new Date(dto.date),

        projectType: dto.projectType,
        projectId: dto.projectId,
        taskId: dto.taskId,
        siteId: dto.siteId,
        fromUserId: dto.fromUserId,

        amount: dto.amount,
        approvedAmount: dto.approvedAmount ?? 0,
        paidAmount: dto.paidAmount ?? 0,

        purpose: dto.purpose,
        reference: dto.reference,

        approveStatus:
          dto.approveStatus ??
          ApproveStatus.PENDING,

        paymentStatus:
          dto.paymentStatus ??
          PaymentStatus.PAYMENT_LEFT,

        addedById: dto.addedById,
        createdBy: dto.createdBy,
        updatedBy: dto.updatedBy,
      });

    return await this.findOne(
      fundRequisition.uuid,
    );
  }

  // FIND ALL
  async findAll(query: QueryFundRequisitionDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      projectType,
      projectId,
      taskId,
      siteId,
      fromUserId,
      purpose,
      reference,
      approveStatus,
      paymentStatus,
      minAmount,
      maxAmount,
      fromDate,
      toDate,
      withDeleted = false,
    } = query;

    const calculatedSkip =
      skip ?? (page - 1) * limit;

    const where: WhereOptions<FundRequisitionAttributes> =
      {};

    if (search) {
      where[Op.or] = [
        {
          projectType: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          projectId: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          taskId: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          siteId: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          purpose: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          reference: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    if (projectType) {
      where.projectType = projectType;
    }

    if (projectId) {
      where.projectId = projectId;
    }

    if (taskId) {
      where.taskId = taskId;
    }

    if (siteId) {
      where.siteId = siteId;
    }

    if (fromUserId) {
      where.fromUserId = fromUserId;
    }

    if (purpose) {
      where.purpose = {
        [Op.iLike]: `%${purpose}%`,
      };
    }

    if (reference) {
      where.reference = {
        [Op.iLike]: `%${reference}%`,
      };
    }

    if (approveStatus) {
      where.approveStatus = approveStatus;
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    if (
      minAmount !== undefined ||
      maxAmount !== undefined
    ) {
      where.amount = {};

      if (minAmount !== undefined) {
        where.amount[Op.gte] = minAmount;
      }

      if (maxAmount !== undefined) {
        where.amount[Op.lte] = maxAmount;
      }
    }

    if (fromDate || toDate) {
      where.date = {};

      if (fromDate) {
        where.date[Op.gte] = new Date(fromDate);
      }

      if (toDate) {
        where.date[Op.lte] = new Date(toDate);
      }
    }

    const allowedSortFields = [
      'id',
      'date',
      'amount',
      'approvedAmount',
      'paidAmount',
      'projectType',
      'createdAt',
      'updatedAt',
    ];

    const sortBy = allowedSortFields.includes(
      query.sortBy ?? '',
    )
      ? query.sortBy
      : 'createdAt';

    const sortOrder =
      query.sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const { rows, count } =
      await this.fundRequisitionModel.findAndCountAll(
        {
          where,
          limit,
          offset: calculatedSkip,
          order: [
            [sortBy ?? 'createdAt', sortOrder],
          ],
          paranoid: !withDeleted,
        },
      );

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        skip: calculatedSkip,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  // FIND ONE
  async findOne(uuid: string) {
    const where = {
      uuid,
    } as WhereOptions<FundRequisitionAttributes>;

    const fundRequisition =
      await this.fundRequisitionModel.findOne({
        where,
        paranoid: false,
      });

    if (!fundRequisition) {
      throw new NotFoundException(
        `Fund Requisition with UUID "${uuid}" not found`,
      );
    }

    return fundRequisition;
  }

  // UPDATE
  async update(
    uuid: string,
    dto: UpdateFundRequisitionDto,
  ) {
    const where = {
      uuid,
    } as WhereOptions<FundRequisitionAttributes>;

    const fundRequisition =
      await this.fundRequisitionModel.findOne({
        where,
        paranoid: false,
      });

    if (!fundRequisition) {
      throw new NotFoundException(
        `Fund Requisition with UUID "${uuid}" not found`,
      );
    }

    if (fundRequisition.deletedAt) {
      throw new BadRequestException(
        'Cannot update a deleted Fund Requisition',
      );
    }

    await fundRequisition.update({
      ...(dto.date !== undefined && {
        date: new Date(dto.date),
      }),

      ...(dto.projectType !== undefined && {
        projectType: dto.projectType,
      }),

      ...(dto.projectId !== undefined && {
        projectId: dto.projectId,
      }),

      ...(dto.taskId !== undefined && {
        taskId: dto.taskId,
      }),

      ...(dto.siteId !== undefined && {
        siteId: dto.siteId,
      }),

      ...(dto.fromUserId !== undefined && {
        fromUserId: dto.fromUserId,
      }),

      ...(dto.amount !== undefined && {
        amount: dto.amount,
      }),

      ...(dto.approvedAmount !== undefined && {
        approvedAmount: dto.approvedAmount,
      }),

      ...(dto.paidAmount !== undefined && {
        paidAmount: dto.paidAmount,
      }),

      ...(dto.purpose !== undefined && {
        purpose: dto.purpose,
      }),

      ...(dto.reference !== undefined && {
        reference: dto.reference,
      }),

      ...(dto.approveStatus !== undefined && {
        approveStatus: dto.approveStatus,
      }),

      ...(dto.paymentStatus !== undefined && {
        paymentStatus: dto.paymentStatus,
      }),

      ...(dto.addedById !== undefined && {
        addedById: dto.addedById,
      }),

      ...(dto.updatedBy !== undefined && {
        updatedBy: dto.updatedBy,
      }),
    });

    return await this.findOne(uuid);
  }

  // DELETE
  async remove(uuid: string) {
    const where = {
      uuid,
    } as WhereOptions<FundRequisitionAttributes>;

    const fundRequisition =
      await this.fundRequisitionModel.findOne({
        where,
      });

    if (!fundRequisition) {
      throw new NotFoundException(
        `Fund Requisition with UUID "${uuid}" not found`,
      );
    }

    await fundRequisition.destroy();

    return {
      message:
        'Fund Requisition deleted successfully',
    };
  }

  // RESTORE
  async restore(uuid: string) {
    const where = {
      uuid,
    } as WhereOptions<FundRequisitionAttributes>;

    const fundRequisition =
      await this.fundRequisitionModel.findOne({
        where,
        paranoid: false,
      });

    if (!fundRequisition) {
      throw new NotFoundException(
        `Fund Requisition with UUID "${uuid}" not found`,
      );
    }

    if (!fundRequisition.deletedAt) {
      throw new BadRequestException(
        'Fund Requisition is not deleted',
      );
    }

    await fundRequisition.restore();

    return await this.findOne(uuid);
  }
}
