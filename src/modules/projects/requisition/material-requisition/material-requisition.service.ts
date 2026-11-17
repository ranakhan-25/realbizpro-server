import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { Site } from 'src/database/models/projects/project-site/pr_project_site.model';
import { BillingCategory } from 'src/database/models/projects/billing/pr_category.model';
import { MaterialRequisition } from 'src/database/models/projects/material-requisition/pr_material_requisition.model';
import { MaterialRequisitionItem } from 'src/database/models/projects/material-requisition-item/pr_material_requisition_item.model';
import { CreateMaterialRequisitionDto } from './dto/create-material-requisition.dto';
import { QueryMaterialRequisitionDto } from './dto/query-material-requisition.dto';
import { UpdateMaterialRequisitionDto } from './dto/update-material-requisition.dto';

@Injectable()
export class MaterialRequisitionService {
  constructor(
    @InjectModel(MaterialRequisition)
    private readonly requisitionModel: typeof MaterialRequisition,
    @InjectModel(MaterialRequisitionItem)
    private readonly itemModel: typeof MaterialRequisitionItem,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(Site)
    private readonly siteModel: typeof Site,
    @InjectModel(BillingCategory)
    private readonly categoryModel: typeof BillingCategory,
    private readonly sequelize: Sequelize,
  ) {}

  async create(
    dto: CreateMaterialRequisitionDto,
    userId?: number,
    currentUser?: any,
  ) {
    const uuid = await this.sequelize.transaction(
      async (transaction) => {
        const { items, ...requisitionData } = dto;
        const requisition =
          await this.requisitionModel.create(
              {
                ...requisitionData,
                createdBy: (currentUser?.email || (userId ? String(userId) : null)) as any,
                addedById: (userId ? String(userId) : null) as any,
              },
            { transaction },
          );

        if (items?.length) {
          await this.itemModel.bulkCreate(
            items.map((item: any) => ({
              ...item,
              materialRequisitionId:
                requisition.uuid,
              createdBy: (userId ? String(userId) : null) as any,
            })) as any,
            { transaction },
          );
        }

        return requisition.uuid;
      },
    );

    return this.findOne(uuid);
  }

  async findAll(
    query: QueryMaterialRequisitionDto,
    currentUser?: any,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const userConditions = currentUser ? [
      { createdBy: currentUser.email },
      { createdBy: String(currentUser.id) },
    ] : [];

    const where: any = {
      ...(userConditions.length > 0 ? { [Op.or]: userConditions } : {}),
      ...(query.orgId ? { orgId: query.orgId } : {}),
      ...(query.projectId ? { projectId: query.projectId } : {}),
      ...(query.search
        ? {
            [Op.or]: [
              { code: { [Op.iLike]: `%${query.search}%` } },
              { titleNameOfWork: { [Op.iLike]: `%${query.search}%` } },
              { ref: { [Op.iLike]: `%${query.search}%` } },
            ],
          }
        : {}),
    };

    const { rows, count } =
      await this.requisitionModel.findAndCountAll(
        {
          where: where as WhereOptions,
          include: [
            {
              model: this.projectModel,
              as: 'project',
            },
            {
              model: this.siteModel,
              as: 'site',
            },
            {
              model: this.categoryModel,
              as: 'category',
            },
            {
              model: this.itemModel,
              as: 'items',
            },
          ],
          limit,
          offset: (page - 1) * limit,
          order: [['createdAt', 'DESC']],
          distinct: true,
        },
      );

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findOne(uuid: string, currentUser?: any) {
    const requisition =
      await this.requisitionModel.findOne({
        where: { uuid } as WhereOptions,
        include: [
          {
            model: this.projectModel,
            as: 'project',
          },
          {
            model: this.siteModel,
            as: 'site',
          },
          {
            model: this.categoryModel,
            as: 'category',
          },
          {
            model: this.itemModel,
            as: 'items',
          },
        ],
      });

    if (!requisition) {
      throw new NotFoundException(
        `Material Requisition not found: ${uuid}`,
      );
    }

    return requisition;
  }

  async update(
    uuid: string,
    dto: UpdateMaterialRequisitionDto,
    userId?: number,
    currentUser?: any,
  ) {
    await this.sequelize.transaction(
      async (transaction) => {
        const where: WhereOptions<MaterialRequisition> =
          { uuid };
        const requisition =
          await this.requisitionModel.findOne({
            where: where as WhereOptions,
            transaction,
          });

        if (!requisition) {
          throw new NotFoundException(
            `Material Requisition not found: ${uuid}`,
          );
        }

        const { items, ...requisitionData } = dto;
        await requisition.update(
          {
            ...requisitionData,
            updatedBy: (userId ? String(userId) : null) as any,
          },
          { transaction },
        );

        if (items !== undefined) {
          const itemWhere: WhereOptions<MaterialRequisitionItem> =
            {
              materialRequisitionId: uuid,
            };
          await this.itemModel.destroy({
            where: itemWhere as WhereOptions,
            transaction,
          });

          if (items.length) {
            await this.itemModel.bulkCreate(
              items.map((item: any) => ({
                ...item,
                materialRequisitionId: uuid,
                createdBy: (userId ? String(userId) : null) as any,
              })) as any,
              { transaction },
            );
          }
        }
      },
    );

    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any) {
    await this.sequelize.transaction(
      async (transaction) => {
        const where: WhereOptions<MaterialRequisition> =
          { uuid };
        const requisition =
          await this.requisitionModel.findOne({
            where: where as WhereOptions,
            transaction,
          });

        if (!requisition) {
          throw new NotFoundException(
            `Material Requisition not found: ${uuid}`,
          );
        }

        await requisition.update(
          { deletedBy: userId ? String(userId) : null } as any,
          { transaction },
        );
        await requisition.destroy({
          transaction,
        });
      },
    );

    return {
      message:
        'Material Requisition deleted successfully',
    };
  }
}
