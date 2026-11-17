import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ProcurementUnit } from 'src/database/models/procurement/configuration/products/pr_unit.model';
import { CreateProcurementUnitDto } from './dto/create-unit.dto';
import { QueryProcurementUnitDto } from './dto/query-unit.dto';
import { UpdateProcurementUnitDto } from './dto/update-unit.dto';

@Injectable()
export class ProcurementUnitService {
  constructor(
    @InjectModel(ProcurementUnit)
    private readonly unitModel: typeof ProcurementUnit,
  ) {}

  async create(dto: CreateProcurementUnitDto) {
    const duplicate = await this.unitModel.findOne({
      where: { code: dto.code } as any,
    });
    if (duplicate) {
      throw new BadRequestException(
        `Unit code "${dto.code}" already exists`,
      );
    }

    return this.unitModel.create(dto as any);
  }

  async findAll(query: QueryProcurementUnitDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;
    const offset = skip ?? (page - 1) * limit;
    const where: any = {};
    if ((query as any)?.orgId) where.orgId = (query as any).orgId;
    if ((query as any)?.projectId) where.projectId = (query as any).projectId;

    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
        { conversionUnit: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.unitModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      paranoid: !withDeleted,
    });
    const currentPage = skip !== undefined
      ? Math.floor(offset / limit) + 1
      : page;
    const totalPages = Math.ceil(count / limit) || 1;

    return {
      data: rows,
      meta: {
        total: count,
        page: currentPage,
        pageNo: currentPage,
        limit,
        skip: offset,
        totalPages,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        previousPage: currentPage > 1 ? currentPage - 1 : null,
      },
    };
  }

  async findOne(uuid: string) {
    const unit = await this.unitModel.findOne({
      where: { uuid } as any,
    });
    if (!unit) {
      throw new NotFoundException(`Unit #${uuid} not found`);
    }
    return unit;
  }

  async update(uuid: string, dto: UpdateProcurementUnitDto) {
    const unit = await this.findOne(uuid);
    if (dto.code && dto.code !== unit.code) {
      const duplicate = await this.unitModel.findOne({
        where: {
          code: dto.code,
          uuid: { [Op.ne]: uuid },
        } as any,
      });
      if (duplicate) {
        throw new BadRequestException(
          `Unit code "${dto.code}" already exists`,
        );
      }
    }

    await unit.update({
      ...dto,
      updatedBy: dto.createdBy ?? unit.updatedBy,
    } as any);
    return this.findOne(uuid);
  }

  async remove(uuid: string) {
    const unit = await this.findOne(uuid);
    await unit.destroy();
    return { message: `Unit #${uuid} deleted successfully` };
  }

  async restore(uuid: string) {
    const unit = await this.unitModel.findOne({
      where: { uuid } as any,
      paranoid: false,
    });
    if (!unit) {
      throw new NotFoundException(`Unit #${uuid} not found`);
    }
    if (!unit.deletedAt) {
      throw new BadRequestException(`Unit #${uuid} is not deleted`);
    }

    await unit.restore();
    return this.findOne(uuid);
  }
}
