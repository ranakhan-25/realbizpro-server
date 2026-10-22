import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ProcurementBrand } from 'src/database/models/procurement/configuration/products/pr_brand.model';
import { CreateProcurementBrandDto } from './dto/create-brand.dto';
import { QueryProcurementBrandDto } from './dto/query-brand.dto';
import { UpdateProcurementBrandDto } from './dto/update-brand.dto';

@Injectable()
export class ProcurementBrandService {
  constructor(
    @InjectModel(ProcurementBrand)
    private readonly brandModel: typeof ProcurementBrand,
  ) {}

  async create(dto: CreateProcurementBrandDto) {
    const duplicate = await this.brandModel.findOne({
      where: { code: dto.code } as any,
    });
    if (duplicate) {
      throw new BadRequestException(
        `Brand code "${dto.code}" already exists`,
      );
    }

    return this.brandModel.create(dto as any);
  }

  async findAll(query: QueryProcurementBrandDto) {
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

    if (search) {
      where[Op.or] = [
        { code: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.brandModel.findAndCountAll({
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
    const brand = await this.brandModel.findOne({
      where: { uuid } as any,
    });
    if (!brand) {
      throw new NotFoundException(`Brand #${uuid} not found`);
    }
    return brand;
  }

  async update(uuid: string, dto: UpdateProcurementBrandDto) {
    const brand = await this.findOne(uuid);
    if (dto.code && dto.code !== brand.code) {
      const duplicate = await this.brandModel.findOne({
        where: {
          code: dto.code,
          uuid: { [Op.ne]: uuid },
        } as any,
      });
      if (duplicate) {
        throw new BadRequestException(
          `Brand code "${dto.code}" already exists`,
        );
      }
    }

    await brand.update({
      ...dto,
      updatedBy: dto.createdBy ?? brand.updatedBy,
    } as any);
    return this.findOne(uuid);
  }

  async remove(uuid: string) {
    const brand = await this.findOne(uuid);
    await brand.destroy();
    return { message: `Brand #${uuid} deleted successfully` };
  }

  async restore(uuid: string) {
    const brand = await this.brandModel.findOne({
      where: { uuid } as any,
      paranoid: false,
    });
    if (!brand) {
      throw new NotFoundException(`Brand #${uuid} not found`);
    }
    if (!brand.deletedAt) {
      throw new BadRequestException(`Brand #${uuid} is not deleted`);
    }

    await brand.restore();
    return this.findOne(uuid);
  }
}
