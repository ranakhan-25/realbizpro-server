import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Quotation } from 'src/database/models/projects/quatation/pr_quotation.model';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { QueryQuotationDto } from './dto/query-quotation.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';

@Injectable()
export class QuotationService {
  constructor(
    @InjectModel(Quotation)
    private readonly quotationModel: typeof Quotation,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async create(
    dto: CreateQuotationDto,
    userId?: number,
    currentUser?: any,
  ): Promise<Quotation> {
    const existing = await this.quotationModel.findOne({
      where: { code: dto.code } as WhereOptions<Quotation>,
    });
    if (existing) {
      throw new ConflictException(
        `Quotation code "${dto.code}" already exists`,
      );
    }

    const uuid = await this.sequelize.transaction(async (transaction) => {
      const quotation = await this.quotationModel.create(
        {
          ...dto,
          date: new Date(dto.date),
          createdBy: userId ? String(userId) : null as any,
          addedById: userId ? String(userId) : null as any,
        },
        { transaction },
      );
      return quotation.uuid;
    });

    return this.findOne(uuid);
  }

  async findAll(
    query: QueryQuotationDto,
    currentUser?: any,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: WhereOptions<Quotation> = {};
    if ((query as any)?.orgId) {
      where.orgId = (query as any).orgId;
    }
    if ((query as any)?.projectId) {
      where.projectId = (query as any).projectId;
    }

    if (query.search?.trim()) {
      const search = `%${query.search.trim()}%`;
      where[Op.or] = [
        { code: { [Op.iLike]: search } },
        { customer: { [Op.iLike]: search } },
        { project: { [Op.iLike]: search } },
        { employeeName: { [Op.iLike]: search } },
      ];
    }
    if (query.projectType) where.projectType = query.projectType;
    if (query.project) where.project = query.project;
    if (query.customer) where.customer = query.customer;
    if (query.approveStatus) where.approveStatus = query.approveStatus;
    if (query.startDate || query.endDate) {
      where.date = {
        ...(query.startDate ? { [Op.gte]: query.startDate } : {}),
        ...(query.endDate ? { [Op.lte]: query.endDate } : {}),
      };
    }

    const { rows, count } = await this.quotationModel.findAndCountAll({
      where: where as WhereOptions<Quotation>,
      limit,
      offset:
        query.skip !== undefined
          ? query.skip
          : (page - 1) * limit,
      order: [[query.sortBy ?? 'createdAt', query.sortOrder ?? 'DESC']],
      paranoid: !query.withDeleted,
    });

    const offset =
      query.skip !== undefined ? query.skip : (page - 1) * limit;
    const currentPage =
      query.skip !== undefined
        ? Math.floor(query.skip / limit) + 1
        : page;
    const totalPages = Math.ceil(count / limit);

    return {
      data: rows,
      meta: {
        total: count,
        page: currentPage,
        limit,
        skip: offset,
        totalPages,
      },
    };
  }

  async findOne(uuid: string, currentUser?: any): Promise<Quotation> {
    const quotation = await this.quotationModel.findOne({
      where: { uuid } as WhereOptions<Quotation>,
    });
    if (!quotation) {
      throw new NotFoundException(
        `Quotation with UUID ${uuid} not found`,
      );
    }
    return quotation;
  }

  async update(
    uuid: string,
    dto: UpdateQuotationDto,
    userId?: number,
    currentUser?: any,
  ): Promise<Quotation> {
    await this.sequelize.transaction(async (transaction) => {
      const quotation = await this.quotationModel.findOne({
        where: { uuid } as WhereOptions<Quotation>,
        transaction,
      });
      if (!quotation) {
        throw new NotFoundException(
          `Quotation with UUID ${uuid} not found`,
        );
      }

      if (dto.code && dto.code !== quotation.code) {
        const duplicate = await this.quotationModel.findOne({
          where: {
            code: dto.code,
            uuid: { [Op.ne]: uuid },
          } as WhereOptions<Quotation>,
          transaction,
        });
        if (duplicate) {
          throw new ConflictException(
            `Quotation code "${dto.code}" already exists`,
          );
        }
      }

      const { date, ...quotationFields } = dto;
      await quotation.update(
        {
          ...quotationFields,
          ...(date !== undefined ? { date: new Date(date) } : {}),
          updatedBy: userId ? String(userId) : null as any,
        },
        { transaction },
      );
    });

    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any) {
    await this.sequelize.transaction(async (transaction) => {
      const quotation = await this.quotationModel.findOne({
        where: { uuid } as WhereOptions<Quotation>,
        transaction,
      });
      if (!quotation) {
        throw new NotFoundException(
          `Quotation with UUID ${uuid} not found`,
        );
      }

      await quotation.update(
        { deletedBy: userId ? String(userId) : null } as any,
        { transaction },
      );
      await quotation.destroy({ transaction });
    });

    return { message: 'Quotation soft deleted successfully' };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<Quotation> {
    await this.sequelize.transaction(async (transaction) => {
      const quotation = await this.quotationModel.findOne({
        where: { uuid } as WhereOptions<Quotation>,
        paranoid: false,
        transaction,
      });
      if (!quotation) {
        throw new NotFoundException(
          `Quotation with UUID ${uuid} not found`,
        );
      }
      if (!quotation.deletedAt) {
        throw new ConflictException('Quotation is not deleted');
      }

      await quotation.restore({ transaction });
      await quotation.update(
        { deletedBy: null, updatedBy: userId ? String(userId) : null } as any,
        { transaction },
      );
    });

    return this.findOne(uuid);
  }
}
