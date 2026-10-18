/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { ServiceWorkRequisitionAttributes } from 'src/database/types/serviceworkrequisition.types';

import { ServiceWorkRequisition } from 'src/database/models/projects/service-work-requisition/pr_service_work_requisition.model';
import { ServiceWorkRequisitionItem } from 'src/database/models/projects/service-work-requisition-item/pr_service_work_requisition_item.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { Site } from 'src/database/models/projects/project-site/pr_project_site.model';
import { BillingCategory } from 'src/database/models/projects/billing/pr_category.model';
import { BillingSubCategory } from 'src/database/models/projects/billing/pr_sub_category.model';

import { CreateServiceWorkRequisitionDto } from './dto/create-service-work-requisition.dto';
import { UpdateServiceWorkRequisitionDto } from './dto/update-service-work-requisition.dto';
import { QueryServiceWorkRequisitionDto } from './dto/query-service-work-requisition.dto';

// ─── helpers ─────────────────────────────────────────────────────────────────
const INCLUDE_RELATIONS = (
  projectModel: typeof Project,
  siteModel: typeof Site,
  categoryModel: typeof BillingCategory,
  subCategoryModel: typeof BillingSubCategory,
  itemModel: typeof ServiceWorkRequisitionItem,
) => [
  { model: projectModel,     as: 'project',              attributes: ['uuid', 'name', 'code'] },
  { model: siteModel,        as: 'constructionSite',     attributes: ['uuid', 'name', 'code'] },
  { model: categoryModel,    as: 'titleOrWorkName',      attributes: ['uuid', 'name', 'code'] },
  { model: subCategoryModel, as: 'taskSubcategoryItem',  attributes: ['uuid', 'name', 'code'] },
  { model: itemModel,        as: 'items' },
];

@Injectable()
export class ServiceWorkRequisitionService {
  constructor(
    @InjectModel(ServiceWorkRequisition)
    private readonly serviceWorkRequisitionModel: typeof ServiceWorkRequisition,

    @InjectModel(ServiceWorkRequisitionItem)
    private readonly itemModel: typeof ServiceWorkRequisitionItem,

    @InjectModel(Project)
    private readonly projectModel: typeof Project,

    @InjectModel(Site)
    private readonly siteModel: typeof Site,

    @InjectModel(BillingCategory)
    private readonly categoryModel: typeof BillingCategory,

    @InjectModel(BillingSubCategory)
    private readonly subCategoryModel: typeof BillingSubCategory,

    private readonly sequelize: Sequelize,
  ) {}

  // =========================
  // CREATE
  // =========================

  async create(dto: CreateServiceWorkRequisitionDto) {
    const uuid = await this.sequelize.transaction(async (transaction) => {
      const { items, ...requisitionData } = dto as any;

      const requisition = await this.serviceWorkRequisitionModel.create(
        {
          requisitionDate:   new Date(dto.requisitionDate),
          requisitionCode:   dto.requisitionCode,
          projectType:       dto.projectType,
          targetProjectId:   dto.targetProjectId,
          titleOrWorkNameId: dto.titleOrWorkNameId,
          taskSubcategory:   dto.taskSubcategory,
          constructionSiteId: dto.constructionSiteId,
          subtotalAmount:    dto.subtotalAmount    ?? 0,
          grandTotalPayable: dto.grandTotalPayable ?? 0,
          supportingAttachment: dto.supportingAttachment,
          addedById:  dto.addedById,
          createdBy:  dto.createdBy,
          updatedBy:  dto.updatedBy,
          status:     dto.status,
        },
        { transaction },
      );

      if (items?.length) {
        await this.itemModel.bulkCreate(
          items.map((item: any) => ({
            ...item,
            serviceWorkRequisitionId: requisition.uuid,
            createdBy: dto.createdBy,
          })),
          { transaction },
        );
      }

      return requisition.uuid;
    });

    return this.findOne(uuid);
  }

  // =========================
  // FIND ALL
  // =========================

  async findAll(query: QueryServiceWorkRequisitionDto) {
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

    const calculatedSkip = skip ?? (page - 1) * limit;

    const where: WhereOptions<ServiceWorkRequisitionAttributes> = {};

    if (search) {
      where[Op.or] = [
        { requisitionCode:   { [Op.iLike]: `%${search}%` } },
        { projectType:       { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (requisitionDate)  where.requisitionDate   = new Date(requisitionDate);
    if (requisitionCode)  where.requisitionCode   = { [Op.iLike]: `%${requisitionCode}%` };
    if (projectType)      where.projectType        = projectType;
    if (targetProjectId)  where.targetProjectId    = targetProjectId;
    if (titleOrWorkNameId) where.titleOrWorkNameId = titleOrWorkNameId;
    if (taskSubcategory)  where.taskSubcategory    = taskSubcategory;
    if (constructionSiteId) where.constructionSiteId = constructionSiteId;
    if (status)           where.status             = status;
    if (addedById)        where.addedById          = addedById;
    if (createdBy)        where.createdBy          = createdBy;

    const allowedSortFields = [
      'id', 'requisitionDate', 'requisitionCode',
      'projectType', 'subtotalAmount', 'grandTotalPayable',
      'status', 'createdAt', 'updatedAt',
    ];

    const sortBy    = allowedSortFields.includes(query.sortBy ?? '') ? query.sortBy : 'createdAt';
    const sortOrder = query.sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const { rows, count } = await this.serviceWorkRequisitionModel.findAndCountAll({
      where,
      include: INCLUDE_RELATIONS(
        this.projectModel,
        this.siteModel,
        this.categoryModel,
        this.subCategoryModel,
        this.itemModel,
      ),
      limit,
      offset: calculatedSkip,
      order: [[sortBy ?? 'createdAt', sortOrder]],
      paranoid: !withDeleted,
      distinct: true,
    });

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
    const requisition = await this.serviceWorkRequisitionModel.findOne({
      where: { uuid } as WhereOptions<ServiceWorkRequisitionAttributes>,
      include: INCLUDE_RELATIONS(
        this.projectModel,
        this.siteModel,
        this.categoryModel,
        this.subCategoryModel,
        this.itemModel,
      ),
      paranoid: false,
    });

    if (!requisition) {
      throw new NotFoundException(
        `Service Work Requisition with UUID "${uuid}" not found`,
      );
    }

    return requisition;
  }

  // =========================
  // UPDATE
  // =========================

  async update(uuid: string, dto: UpdateServiceWorkRequisitionDto) {
    await this.sequelize.transaction(async (transaction) => {
      const requisition = await this.serviceWorkRequisitionModel.findOne({
        where: { uuid } as WhereOptions<ServiceWorkRequisitionAttributes>,
        paranoid: false,
        transaction,
      });

      if (!requisition) {
        throw new NotFoundException(
          `Service Work Requisition with UUID "${uuid}" not found`,
        );
      }

      if (requisition.deletedAt) {
        throw new BadRequestException(
          'Cannot update a deleted Service Work Requisition',
        );
      }

      const { items, ...rest } = dto as any;

      await requisition.update(
        {
          ...(rest.requisitionDate   !== undefined && { requisitionDate:   new Date(rest.requisitionDate) }),
          ...(rest.requisitionCode   !== undefined && { requisitionCode:   rest.requisitionCode }),
          ...(rest.projectType       !== undefined && { projectType:       rest.projectType }),
          ...(rest.targetProjectId   !== undefined && { targetProjectId:   rest.targetProjectId }),
          ...(rest.titleOrWorkNameId !== undefined && { titleOrWorkNameId: rest.titleOrWorkNameId }),
          ...(rest.taskSubcategory   !== undefined && { taskSubcategory:   rest.taskSubcategory }),
          ...(rest.constructionSiteId !== undefined && { constructionSiteId: rest.constructionSiteId }),
          ...(rest.subtotalAmount    !== undefined && { subtotalAmount:    rest.subtotalAmount }),
          ...(rest.grandTotalPayable !== undefined && { grandTotalPayable: rest.grandTotalPayable }),
          ...(rest.supportingAttachment !== undefined && { supportingAttachment: rest.supportingAttachment }),
          ...(rest.addedById         !== undefined && { addedById:         rest.addedById }),
          ...(rest.updatedBy         !== undefined && { updatedBy:         rest.updatedBy }),
          ...(rest.status            !== undefined && { status:            rest.status }),
        },
        { transaction },
      );

      if (items !== undefined) {
        await this.itemModel.destroy({
          where: { serviceWorkRequisitionId: uuid } as any,
          transaction,
        });

        if (items.length) {
          await this.itemModel.bulkCreate(
            items.map((item: any) => ({
              ...item,
              serviceWorkRequisitionId: uuid,
              updatedBy: rest.updatedBy,
            })),
            { transaction },
          );
        }
      }
    });

    return this.findOne(uuid);
  }

  // =========================
  // DELETE
  // =========================

  async remove(uuid: string) {
    const requisition = await this.serviceWorkRequisitionModel.findOne({
      where: { uuid } as WhereOptions<ServiceWorkRequisitionAttributes>,
    });

    if (!requisition) {
      throw new NotFoundException(
        `Service Work Requisition with UUID "${uuid}" not found`,
      );
    }

    await requisition.destroy();

    return { message: 'Service Work Requisition deleted successfully' };
  }

  // =========================
  // RESTORE
  // =========================

  async restore(uuid: string) {
    const requisition = await this.serviceWorkRequisitionModel.findOne({
      where: { uuid } as WhereOptions<ServiceWorkRequisitionAttributes>,
      paranoid: false,
    });

    if (!requisition) {
      throw new NotFoundException(
        `Service Work Requisition with UUID "${uuid}" not found`,
      );
    }

    if (!requisition.deletedAt) {
      throw new BadRequestException('Service Work Requisition is not deleted');
    }

    await requisition.restore();

    return this.findOne(uuid);
  }
}
