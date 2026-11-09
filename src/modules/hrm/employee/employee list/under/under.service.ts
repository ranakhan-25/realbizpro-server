import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import {
  Under,
  UnderStatus,
} from 'src/database/models/hrm/employee/hrm_under_model';
import { CreateUnderDto } from './dto/create-under.dto';
import { UpdateUnderDto } from './dto/update-under.dto';
import { QueryUnderDto } from './dto/query-under.dto';

@Injectable()
export class UnderService {
  constructor(
    @InjectModel(Under)
    private readonly underModel: typeof Under,
  ) {}

  async create(
    dto: CreateUnderDto,
  ): Promise<Under> {
    // name column unique, tai soft-deleted gulo-o check kori
    const existing =
      await this.underModel.findOne({
        where: { name: dto.name } as any,
        paranoid: false,
      });

    if (existing) {
      throw new BadRequestException(
        existing.deletedAt
          ? `Under "${dto.name}" already exists in deleted records, please restore it`
          : `Under "${dto.name}" already exists`,
      );
    }

    const record = await this.underModel.create({
      ...dto,
      createdBy: dto.createdBy ?? dto.addedById,
      status: dto.status ?? UnderStatus.ACTIVE,
    });

    return this.findOne(record.uuid);
  }

  async findAll(query: QueryUnderDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      status,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;

    const offset =
      skip !== undefined && skip !== null
        ? skip
        : (page - 1) * limit;

    const where: any = {};
    if (query.orgId) {
      where.orgId = query.orgId;
    }
    if ((query as any).projectId) {
      where.projectId = (query as any).projectId;
    }

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    if (status) {
      where.status = status;
    }

    const { rows, count } =
      await this.underModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
        paranoid: !withDeleted,
      });

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

  async findOne(uuid: string): Promise<Under> {
    const record = await this.underModel.findOne({
      where: { uuid } as any,
    });

    if (!record) {
      throw new NotFoundException(
        `Under #${uuid} not found`,
      );
    }

    return record;
  }

  async update(
    uuid: string,
    dto: UpdateUnderDto,
  ): Promise<Under> {
    const record = await this.underModel.findOne({
      where: { uuid } as any,
    });

    if (!record) {
      throw new NotFoundException(
        `Under #${uuid} not found`,
      );
    }

    if (dto.name && dto.name !== record.name) {
      const exists =
        await this.underModel.findOne({
          where: {
            name: dto.name,
            uuid: { [Op.ne]: uuid },
          } as any,
          paranoid: false,
        });

      if (exists) {
        throw new BadRequestException(
          exists.deletedAt
            ? `Under "${dto.name}" already exists in deleted records`
            : `Under "${dto.name}" already exists`,
        );
      }
    }

    await record.update({
      ...dto,
      updatedBy:
        dto.addedById ?? record.updatedBy,
    });

    return this.findOne(uuid);
  }

  async remove(
    uuid: string,
  ): Promise<{ message: string }> {
    const record = await this.underModel.findOne({
      where: { uuid } as any,
    });

    if (!record) {
      throw new NotFoundException(
        `Under #${uuid} not found`,
      );
    }

    // status → inactive + soft delete
    await record.update({
      status: UnderStatus.INACTIVE,
    });

    await record.destroy();

    return {
      message: `Under #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string): Promise<Under> {
    const record = await this.underModel.findOne({
      where: { uuid } as any,
      paranoid: false,
    });

    if (!record) {
      throw new NotFoundException(
        `Under #${uuid} not found`,
      );
    }

    if (!record.deletedAt) {
      throw new BadRequestException(
        `Under #${uuid} is not deleted`,
      );
    }

    // status → active + restore
    await record.restore();
    await record.update({
      status: UnderStatus.ACTIVE,
    });

    return this.findOne(uuid);
  }
}
