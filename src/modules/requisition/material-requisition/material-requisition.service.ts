import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import {
  ApprovalStatusEnum,
  Requisition,
  RequisitionStatusEnum,
} from 'src/database/models/Requisition/re_material_requisition_model';

import { CreateMaterialRequisitionDto } from './dto/create-material-requisition.dto';
import { UpdateMaterialRequisitionDto } from './dto/update-material-requisition.dto';
import { QueryRequisitionDto } from './dto/query-material-requisition.dto';

@Injectable()
export class RequisitionService {
  constructor(
    @InjectModel(Requisition)
    private readonly requisitionModel: typeof Requisition,
  ) {}

  async create(dto: CreateMaterialRequisitionDto): Promise<Requisition> {
    const existing = await this.requisitionModel.findOne({
      where: { requisitionNo: dto.requisitionNo },
    });

    if (existing) {
      throw new BadRequestException(
        `Requisition number "${dto.requisitionNo}" already exists`,
      );
    }

    const requisition = await this.requisitionModel.create({
      ...dto,
      status: dto.status ?? RequisitionStatusEnum.DRAFT,
      approvalStatus: dto.approvalStatus ?? ApprovalStatusEnum.PENDING,
      requisitionDate: dto.requisitionDate ?? new Date(),
    });

    return this.findOne(requisition.id);
  }

  async findAll(query: QueryRequisitionDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      approvalStatus,
      projectId,
      companyId,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;

    const where: any = {};

    if (search) {
      where[Op.or] = [
        { requisitionNo: { [Op.iLike]: `%${search}%` } },
        { titleOfWork: { [Op.iLike]: `%${search}%` } },
        { referenceNo: { [Op.iLike]: `%${search}%` } },
        { department: { [Op.iLike]: `%${search}%` } },
        { remarks: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status) where.status = status;
    if (approvalStatus) where.approvalStatus = approvalStatus;
    if (projectId) where.projectId = projectId;
    if (companyId) where.companyId = companyId;

    const { rows, count } = await this.requisitionModel.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [[sortBy, sortOrder]],
      paranoid: !withDeleted,
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

  async findOne(id: string | number): Promise<Requisition> {
    const requisition = await this.requisitionModel.findByPk(id);

    if (!requisition) {
      throw new NotFoundException(`Requisition #${id} not found`);
    }

    return requisition;
  }

  async update(
    id: string | number,
    dto: UpdateMaterialRequisitionDto,
  ): Promise<Requisition> {
    const requisition = await this.requisitionModel.findByPk(id);

    if (!requisition) {
      throw new NotFoundException(`Requisition #${id} not found`);
    }

    if (dto.requisitionNo && dto.requisitionNo !== requisition.requisitionNo) {
      const exists = await this.requisitionModel.findOne({
        where: { requisitionNo: dto.requisitionNo },
      });

      if (exists) {
        throw new BadRequestException(
          `Requisition number "${dto.requisitionNo}" already exists`,
        );
      }
    }

    await requisition.update(dto);
    return this.findOne(id);
  }

  async remove(id: string | number): Promise<{ message: string }> {
    const requisition = await this.requisitionModel.findByPk(id);

    if (!requisition) {
      throw new NotFoundException(`Requisition #${id} not found`);
    }

    await requisition.destroy();

    return {
      message: `Requisition #${id} deleted successfully`,
    };
  }

  async restore(id: string | number): Promise<Requisition> {
    const requisition = await this.requisitionModel.findByPk(id, {
      paranoid: false,
    });

    if (!requisition) {
      throw new NotFoundException(`Requisition #${id} not found`);
    }

    if (!requisition.deletedAt) {
      throw new BadRequestException(`Requisition #${id} is not deleted`);
    }

    await requisition.restore();
    return this.findOne(id);
  }
}