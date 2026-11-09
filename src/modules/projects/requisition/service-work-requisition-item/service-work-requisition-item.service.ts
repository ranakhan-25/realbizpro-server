/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';

import { ServiceWorkRequisitionItemAttributes } from 'src/database/types/serviceworkrequisitionitem.types';

import { ServiceWorkRequisitionItem } from 'src/database/models/projects/service-work-requisition-item/pr_service_work_requisition_item.model';

import { CreateServiceWorkRequisitionItemDto } from './dto/create-service-work-requisition-item.dto';
import { UpdateServiceWorkRequisitionItemDto } from './dto/update-service-work-requisition-item.dto';
import { QueryServiceWorkRequisitionItemDto } from './dto/query-service-work-requisition-item.dto';

@Injectable()
export class ServiceWorkRequisitionItemService {
  constructor(
    @InjectModel(ServiceWorkRequisitionItem)
    private readonly serviceWorkRequisitionItemModel: typeof ServiceWorkRequisitionItem,
  ) {}

  // =========================
  // CREATE
  // =========================

  async create(
    dto: CreateServiceWorkRequisitionItemDto,
    userId?: number,
    currentUser?: any,
  ) {
    const serviceWorkRequisitionItem =
      await this.serviceWorkRequisitionItemModel.create(
        {
          serviceWorkRequisitionId:
            dto.serviceWorkRequisitionId,

          date: new Date(dto.date),

          code: dto.code,

          serviceItemName: dto.serviceItemName,

          unitType: dto.unitType,

          qtyDays: dto.qtyDays ?? 1,

          rate: dto.rate ?? 0,

          scopeDetailsOrRemarks:
            dto.scopeDetailsOrRemarks,

          amount: dto.amount ?? 0,

          createdBy: dto.createdBy,

          updatedBy: dto.updatedBy,

          deletedBy: dto.deletedBy,
        },
      );

    return await this.findOne(
      serviceWorkRequisitionItem.uuid,
    );
  }

  // =========================
  // FIND ALL
  // =========================

  async findAll(
    query: QueryServiceWorkRequisitionItemDto,
    currentUser?: any,
  ) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,

      serviceWorkRequisitionId,

      date,
      code,
      serviceItemName,
      unitType,

      withDeleted = false,
    } = query;

    const calculatedSkip =
      skip ?? (page - 1) * limit;

    const where: any =
      {};
    if ((query as any)?.orgId) {
      where.orgId = (query as any).orgId;
    }

    // =========================
    // SEARCH
    // =========================

    if (search) {
      where[Op.or] = [
        {
          code: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          serviceItemName: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          unitType: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          scopeDetailsOrRemarks: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    // =========================
    // FILTERS
    // =========================

    if (serviceWorkRequisitionId) {
      where.serviceWorkRequisitionId =
        serviceWorkRequisitionId;
    }

    if (date) {
      where.date = new Date(date);
    }

    if (code) {
      where.code = {
        [Op.iLike]: `%${code}%`,
      };
    }

    if (serviceItemName) {
      where.serviceItemName = {
        [Op.iLike]: `%${serviceItemName}%`,
      };
    }

    if (unitType) {
      where.unitType = unitType;
    }

    // =========================
    // SORT
    // =========================

    const allowedSortFields = [
      'id',
      'date',
      'code',
      'serviceItemName',
      'unitType',
      'qtyDays',
      'rate',
      'amount',
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

    // =========================
    // QUERY
    // =========================

    const { rows, count } =
      await this.serviceWorkRequisitionItemModel.findAndCountAll(
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

  // =========================
  // FIND ONE
  // =========================

  async findOne(uuid: string, currentUser?: any) {
    const where = {
      uuid,
    } as WhereOptions<ServiceWorkRequisitionItemAttributes>;

    const serviceWorkRequisitionItem =
      await this.serviceWorkRequisitionItemModel.findOne(
        {
          where,

          paranoid: false,
        },
      );

    if (!serviceWorkRequisitionItem) {
      throw new NotFoundException(
        `Service Work Requisition Item with UUID "${uuid}" not found`,
      );
    }

    return serviceWorkRequisitionItem;
  }

  // =========================
  // UPDATE
  // =========================

  async update(
    uuid: string,
    dto: UpdateServiceWorkRequisitionItemDto,
    userId?: number,
    currentUser?: any,
  ) {
    const where = {
      uuid,
    } as WhereOptions<ServiceWorkRequisitionItemAttributes>;

    const serviceWorkRequisitionItem =
      await this.serviceWorkRequisitionItemModel.findOne(
        {
          where,

          paranoid: false,
        },
      );

    if (!serviceWorkRequisitionItem) {
      throw new NotFoundException(
        `Service Work Requisition Item with UUID "${uuid}" not found`,
      );
    }

    if (serviceWorkRequisitionItem.deletedAt) {
      throw new BadRequestException(
        'Cannot update a deleted Service Work Requisition Item',
      );
    }

    await serviceWorkRequisitionItem.update(({
      ...(dto.serviceWorkRequisitionId !==
        undefined && {
        serviceWorkRequisitionId:
          dto.serviceWorkRequisitionId,
      }),

      ...(dto.date !== undefined && {
        date: new Date(dto.date),
      }),

      ...(dto.code !== undefined && {
        code: dto.code,
      }),

      ...(dto.serviceItemName !== undefined && {
        serviceItemName: dto.serviceItemName,
      }),

      ...(dto.unitType !== undefined && {
        unitType: dto.unitType,
      }),

      ...(dto.qtyDays !== undefined && {
        qtyDays: dto.qtyDays,
      }),

      ...(dto.rate !== undefined && {
        rate: dto.rate,
      }),

      ...(dto.scopeDetailsOrRemarks !==
        undefined && {
        scopeDetailsOrRemarks:
          dto.scopeDetailsOrRemarks,
      }),

      ...(dto.amount !== undefined && {
        amount: dto.amount,
      }),

      ...(dto.updatedBy !== undefined && {
        updatedBy: dto.updatedBy,
      }),

      ...(dto.deletedBy !== undefined && {
        deletedBy: dto.deletedBy,
      }),
    }) as any);

    return await this.findOne(uuid);
  }

  // =========================
  // DELETE
  // =========================

  async remove(uuid: string, userId?: number, currentUser?: any) {
    const where = {
      uuid,
    } as WhereOptions<ServiceWorkRequisitionItemAttributes>;

    const serviceWorkRequisitionItem =
      await this.serviceWorkRequisitionItemModel.findOne(
        {
          where,
        },
      );

    if (!serviceWorkRequisitionItem) {
      throw new NotFoundException(
        `Service Work Requisition Item with UUID "${uuid}" not found`,
      );
    }

    await serviceWorkRequisitionItem.destroy();

    return {
      message:
        'Service Work Requisition Item deleted successfully',
    };
  }

  // =========================
  // RESTORE
  // =========================

  async restore(uuid: string, userId?: number, currentUser?: any) {
    const where = {
      uuid,
    } as WhereOptions<ServiceWorkRequisitionItemAttributes>;

    const serviceWorkRequisitionItem =
      await this.serviceWorkRequisitionItemModel.findOne(
        {
          where,

          paranoid: false,
        },
      );

    if (!serviceWorkRequisitionItem) {
      throw new NotFoundException(
        `Service Work Requisition Item with UUID "${uuid}" not found`,
      );
    }

    if (!serviceWorkRequisitionItem.deletedAt) {
      throw new BadRequestException(
        'Service Work Requisition Item is not deleted',
      );
    }

    await serviceWorkRequisitionItem.restore();

    return await this.findOne(uuid);
  }
}
