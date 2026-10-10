/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';

import { CreateMaterialRequisitionDto } from './dto/create-material-requisition.dto';
import { QueryMaterialRequisitionDto } from './dto/query-material-requisition.dto';
import { UpdateMaterialRequisitionDto } from './dto/update-material-requisition.dto';
import { MaterialRequisition } from 'src/database/models/projects/Requisition/pr_material_requisition_model';

@Injectable()
export class MaterialRequisitionService {
  constructor(
    @InjectModel(MaterialRequisition)
    private readonly materialRequisitionModel: typeof MaterialRequisition,
  ) {}

  async create(
    dto: CreateMaterialRequisitionDto,
  ): Promise<MaterialRequisition> {
    const existing =
      await this.materialRequisitionModel.findOne(
        {
          where: {
            code: dto.code,
          },
        },
      );

    if (existing) {
      throw new BadRequestException(
        `Material requisition code "${dto.code}" already exists`,
      );
    }

    const materialRequisition =
      await this.materialRequisitionModel.create({
        ...dto,
        demandDate: new Date(dto.demandDate),
      });

    return this.findOne(materialRequisition.uuid);
  }

  async findAll(
    query: QueryMaterialRequisitionDto,
  ) {
    const {
      page = 1,
      limit = 20,
      skip,
      search,
      code,
      referenceNumber,
      projectName,
      projectType,
      company,
      supplier,
      titleOrNameOfWork,
      addedBy,
      approvalLayer,
      status,
      fromDate,
      toDate,
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
      where[Op.or] = [
        {
          code: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          referenceNumber: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          projectType: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          projectName: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          titleOrNameOfWork: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          company: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          supplier: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          addedBy: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    if (code) {
      where.code = code;
    }

    if (referenceNumber) {
      where.referenceNumber = referenceNumber;
    }

    if (projectName) {
      where.projectName = projectName;
    }

    if (projectType) {
      where.projectType = projectType;
    }

    if (company) {
      where.company = company;
    }

    if (supplier) {
      where.supplier = supplier;
    }

    if (titleOrNameOfWork) {
      where.titleOrNameOfWork = titleOrNameOfWork;
    }

    if (addedBy) {
      where.addedBy = addedBy;
    }

    if (approvalLayer) {
      where.approvalLayer = approvalLayer;
    }

    if (status) {
      where.status = status;
    }

    if (fromDate || toDate) {
      where.demandDate = {};

      if (fromDate) {
        where.demandDate[Op.gte] = new Date(
          `${fromDate}T00:00:00.000Z`,
        );
      }

      if (toDate) {
        where.demandDate[Op.lte] = new Date(
          `${toDate}T23:59:59.999Z`,
        );
      }
    }

    const { rows, count } =
      await this.materialRequisitionModel.findAndCountAll(
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
  ): Promise<MaterialRequisition> {
    const materialRequisition =
      await this.materialRequisitionModel.findOne(
        {
          where: {
            uuid,
          } as any,
        },
      );

    if (!materialRequisition) {
      throw new NotFoundException(
        `Material requisition #${uuid} not found`,
      );
    }

    return materialRequisition;
  }

  async update(
    uuid: string,
    dto: UpdateMaterialRequisitionDto,
  ): Promise<MaterialRequisition> {
    const materialRequisition =
      await this.materialRequisitionModel.findOne(
        {
          where: {
            uuid,
          } as any,
        },
      );

    if (!materialRequisition) {
      throw new NotFoundException(
        `Material requisition #${uuid} not found`,
      );
    }

    if (
      dto.code &&
      dto.code !== materialRequisition.code
    ) {
      const exists =
        await this.materialRequisitionModel.findOne(
          {
            where: {
              code: dto.code,
            },
          },
        );

      if (exists) {
        throw new BadRequestException(
          `Material requisition code "${dto.code}" already exists`,
        );
      }
    }

    const updateData: any = {
      ...dto,
    };

    if (dto.demandDate) {
      updateData.demandDate = new Date(
        dto.demandDate,
      );
    }

    await materialRequisition.update(updateData);

    return this.findOne(uuid);
  }

  async remove(
    uuid: string,
  ): Promise<{ message: string }> {
    const materialRequisition =
      await this.materialRequisitionModel.findOne(
        {
          where: {
            uuid,
          } as any,
        },
      );

    if (!materialRequisition) {
      throw new NotFoundException(
        `Material requisition #${uuid} not found`,
      );
    }

    await materialRequisition.destroy();

    return {
      message: `Material requisition #${uuid} deleted successfully`,
    };
  }

  async restore(
    uuid: string,
  ): Promise<MaterialRequisition> {
    const materialRequisition =
      await this.materialRequisitionModel.findOne(
        {
          where: {
            uuid,
          } as any,
          paranoid: false,
        },
      );

    if (!materialRequisition) {
      throw new NotFoundException(
        `Material requisition #${uuid} not found`,
      );
    }

    if (!materialRequisition.deletedAt) {
      throw new BadRequestException(
        `Material requisition #${uuid} is not deleted`,
      );
    }

    await materialRequisition.restore();

    return this.findOne(uuid);
  }
}
