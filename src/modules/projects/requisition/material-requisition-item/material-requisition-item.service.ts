import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { MaterialRequisition } from 'src/database/models/projects/material-requisition/pr_material_requisition.model';
import { MaterialRequisitionItem } from 'src/database/models/projects/material-requisition-item/pr_material_requisition_item.model';
import { CreateMaterialRequisitionItemDto } from './dto/create-material-requisition-item.dto';
import { QueryMaterialRequisitionItemDto } from './dto/query-material-requisition-item.dto';
import { UpdateMaterialRequisitionItemDto } from './dto/update-material-requisition-item.dto';

@Injectable()
export class MaterialRequisitionItemService {
  constructor(
    @InjectModel(MaterialRequisitionItem)
    private readonly itemModel: typeof MaterialRequisitionItem,
    @InjectModel(MaterialRequisition)
    private readonly requisitionModel: typeof MaterialRequisition,
  ) {}

  async create(
    dto: CreateMaterialRequisitionItemDto,
    userId?: string,
  ) {
    const parentWhere: WhereOptions<MaterialRequisition> =
      {
        uuid: dto.materialRequisitionId,
      };
    const requisition =
      await this.requisitionModel.findOne({
        where: parentWhere as WhereOptions,
      });
    if (!requisition) {
      throw new NotFoundException(
        `Material Requisition not found: ${dto.materialRequisitionId}`,
      );
    }

    return this.itemModel.create({
      ...dto,
      createdBy: userId,
    });
  }

  async findAll(
    query: QueryMaterialRequisitionItemDto,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: WhereOptions<MaterialRequisitionItem> =
      query.search
        ? {
            [Op.or]: [
              {
                itemCode: {
                  [Op.iLike]: `%${query.search}%`,
                },
              },
              {
                itemName: {
                  [Op.iLike]: `%${query.search}%`,
                },
              },
            ],
          }
        : {};

    const filters = {
      ...where,
      ...(query.materialRequisitionId
        ? {
            materialRequisitionId:
              query.materialRequisitionId,
          }
        : {}),
    } as WhereOptions<MaterialRequisitionItem>;

    const { rows, count } =
      await this.itemModel.findAndCountAll({
        where: filters as WhereOptions,
        include: [
          {
            model: this.requisitionModel,
            as: 'materialRequisition',
          },
        ],
        limit,
        offset: (page - 1) * limit,
        order: [['createdAt', 'DESC']],
        distinct: true,
      });

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

  async findOne(uuid: string) {
    const where: WhereOptions<MaterialRequisitionItem> =
      { uuid };
    const item = await this.itemModel.findOne({
      where: where as WhereOptions,
      include: [
        {
          model: this.requisitionModel,
          as: 'materialRequisition',
        },
      ],
    });
    if (!item) {
      throw new NotFoundException(
        `Material Requisition Item not found: ${uuid}`,
      );
    }
    return item;
  }

  async update(
    uuid: string,
    dto: UpdateMaterialRequisitionItemDto,
    userId?: string,
  ) {
    const item = await this.findOne(uuid);

    if (dto.materialRequisitionId !== undefined) {
      const parentWhere: WhereOptions<MaterialRequisition> =
        {
          uuid: dto.materialRequisitionId,
        };
      const requisition =
        await this.requisitionModel.findOne({
          where: parentWhere as WhereOptions,
        });
      if (!requisition) {
        throw new NotFoundException(
          `Material Requisition not found: ${dto.materialRequisitionId}`,
        );
      }
    }

    return item.update({
      ...dto,
      updatedBy: userId,
    });
  }

  async remove(uuid: string, userId?: string) {
    const item = await this.findOne(uuid);
    await item.update({ deletedBy: userId });
    await item.destroy();
    return {
      message:
        'Material Requisition Item deleted successfully',
    };
  }
}
