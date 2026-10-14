/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';

import { ServiceWorkRequisitionAttributes } from 'src/database/types/serviceworkrequisition.types';

import { ServiceWorkRequisition } from 'src/database/models/projects/Requisition/pr_service_work_requisition.model';

import { CreateServiceWorkRequisitionDto } from './dto/create-service-work-requisition.dto';
import { UpdateServiceWorkRequisitionDto } from './dto/update-service-work-requisition.dto';
import { QueryServiceWorkRequisitionDto } from './dto/query-service-work-requisition.dto';

@Injectable()
export class ServiceWorkRequisitionService {
  constructor(
    @InjectModel(ServiceWorkRequisition)
    private readonly serviceWorkRequisitionModel: typeof ServiceWorkRequisition,
  ) {}

  // =========================
  // CREATE
  // =========================

  async create(
    dto: CreateServiceWorkRequisitionDto,
  ) {
    const serviceWorkRequisition =
      await this.serviceWorkRequisitionModel.create(
        {
          requisitionDate: new Date(
            dto.requisitionDate,
          ),

          requisitionCode: dto.requisitionCode,

          projectType: dto.projectType,

          targetProjectId: dto.targetProjectId,

          titleOrWorkNameId:
            dto.titleOrWorkNameId,

          taskSubcategory: dto.taskSubcategory,

          constructionSiteId:
            dto.constructionSiteId,

          subtotalAmount: dto.subtotalAmount ?? 0,

          grandTotalPayable:
            dto.grandTotalPayable ?? 0,

          supportingAttachment:
            dto.supportingAttachment,

          addedById: dto.addedById,

          createdBy: dto.createdBy,

          updatedBy: dto.updatedBy,

          status: dto.status,
        },
      );

    return await this.findOne(
      serviceWorkRequisition.uuid,
    );
  }

  // =========================
  // FIND ALL
  // =========================

  async findAll(
    query: QueryServiceWorkRequisitionDto,
  ) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,

      requisitionDate,
      requisitionCode,
      projectType,
      targetProjectId,
      titleOrWorkNameId,
      taskSubcategory,
      constructionSiteId,

      status,
      addedById,
      createdBy,

      withDeleted = false,
    } = query;

    const calculatedSkip =
      skip ?? (page - 1) * limit;

    const where: WhereOptions<ServiceWorkRequisitionAttributes> =
      {};

    // =========================
    // SEARCH
    // =========================

    if (search) {
      where[Op.or] = [
        {
          requisitionCode: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          projectType: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          targetProjectId: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          titleOrWorkNameId: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          taskSubcategory: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          constructionSiteId: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    // =========================
    // FILTERS
    // =========================

    if (requisitionDate) {
      where.requisitionDate = new Date(
        requisitionDate,
      );
    }

    if (requisitionCode) {
      where.requisitionCode = {
        [Op.iLike]: `%${requisitionCode}%`,
      };
    }

    if (projectType) {
      where.projectType = projectType;
    }

    if (targetProjectId) {
      where.targetProjectId = targetProjectId;
    }

    if (titleOrWorkNameId) {
      where.titleOrWorkNameId = titleOrWorkNameId;
    }

    if (taskSubcategory) {
      where.taskSubcategory = taskSubcategory;
    }

    if (constructionSiteId) {
      where.constructionSiteId =
        constructionSiteId;
    }

    if (status) {
      where.status = status;
    }

    if (addedById) {
      where.addedById = addedById;
    }

    if (createdBy) {
      where.createdBy = createdBy;
    }

    // =========================
    // SORT
    // =========================

    const allowedSortFields = [
      'id',
      'requisitionDate',
      'requisitionCode',
      'projectType',
      'subtotalAmount',
      'grandTotalPayable',
      'status',
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
      await this.serviceWorkRequisitionModel.findAndCountAll(
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

  async findOne(uuid: string) {
    const where = {
      uuid,
    } as WhereOptions<ServiceWorkRequisitionAttributes>;

    const serviceWorkRequisition =
      await this.serviceWorkRequisitionModel.findOne(
        {
          where,

          paranoid: false,
        },
      );

    if (!serviceWorkRequisition) {
      throw new NotFoundException(
        `Service Work Requisition with UUID "${uuid}" not found`,
      );
    }

    return serviceWorkRequisition;
  }

  // =========================
  // UPDATE
  // =========================

  async update(
    uuid: string,
    dto: UpdateServiceWorkRequisitionDto,
  ) {
    const where = {
      uuid,
    } as WhereOptions<ServiceWorkRequisitionAttributes>;

    const serviceWorkRequisition =
      await this.serviceWorkRequisitionModel.findOne(
        {
          where,

          paranoid: false,
        },
      );

    if (!serviceWorkRequisition) {
      throw new NotFoundException(
        `Service Work Requisition with UUID "${uuid}" not found`,
      );
    }

    if (serviceWorkRequisition.deletedAt) {
      throw new BadRequestException(
        'Cannot update a deleted Service Work Requisition',
      );
    }

    await serviceWorkRequisition.update({
      ...(dto.requisitionDate !== undefined && {
        requisitionDate: new Date(
          dto.requisitionDate,
        ),
      }),

      ...(dto.requisitionCode !== undefined && {
        requisitionCode: dto.requisitionCode,
      }),

      ...(dto.projectType !== undefined && {
        projectType: dto.projectType,
      }),

      ...(dto.targetProjectId !== undefined && {
        targetProjectId: dto.targetProjectId,
      }),

      ...(dto.titleOrWorkNameId !== undefined && {
        titleOrWorkNameId: dto.titleOrWorkNameId,
      }),

      ...(dto.taskSubcategory !== undefined && {
        taskSubcategory: dto.taskSubcategory,
      }),

      ...(dto.constructionSiteId !==
        undefined && {
        constructionSiteId:
          dto.constructionSiteId,
      }),

      ...(dto.subtotalAmount !== undefined && {
        subtotalAmount: dto.subtotalAmount,
      }),

      ...(dto.grandTotalPayable !== undefined && {
        grandTotalPayable: dto.grandTotalPayable,
      }),

      ...(dto.supportingAttachment !==
        undefined && {
        supportingAttachment:
          dto.supportingAttachment,
      }),

      ...(dto.addedById !== undefined && {
        addedById: dto.addedById,
      }),

      ...(dto.updatedBy !== undefined && {
        updatedBy: dto.updatedBy,
      }),

      ...(dto.status !== undefined && {
        status: dto.status,
      }),
    });

    return await this.findOne(uuid);
  }

  // =========================
  // DELETE
  // =========================

  async remove(uuid: string) {
    const where = {
      uuid,
    } as WhereOptions<ServiceWorkRequisitionAttributes>;

    const serviceWorkRequisition =
      await this.serviceWorkRequisitionModel.findOne(
        {
          where,
        },
      );

    if (!serviceWorkRequisition) {
      throw new NotFoundException(
        `Service Work Requisition with UUID "${uuid}" not found`,
      );
    }

    await serviceWorkRequisition.destroy();

    return {
      message:
        'Service Work Requisition deleted successfully',
    };
  }

  // =========================
  // RESTORE
  // =========================

  async restore(uuid: string) {
    const where = {
      uuid,
    } as WhereOptions<ServiceWorkRequisitionAttributes>;

    const serviceWorkRequisition =
      await this.serviceWorkRequisitionModel.findOne(
        {
          where,

          paranoid: false,
        },
      );

    if (!serviceWorkRequisition) {
      throw new NotFoundException(
        `Service Work Requisition with UUID "${uuid}" not found`,
      );
    }

    if (!serviceWorkRequisition.deletedAt) {
      throw new BadRequestException(
        'Service Work Requisition is not deleted',
      );
    }

    await serviceWorkRequisition.restore();

    return await this.findOne(uuid);
  }
}
