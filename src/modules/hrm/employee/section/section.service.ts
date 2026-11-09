/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';
import {
  Section,
  SectionStatus,
} from 'src/database/models/hrm/employee/hrm_section_model';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { QuerySectionDto } from './dto/query-section.dto';

@Injectable()
export class SectionService {
  constructor(
    @InjectModel(Section)
    private readonly sectionModel: typeof Section,
  ) {}

  async create(
    dto: CreateSectionDto,
  ): Promise<Section> {
    // name column unique, tai soft-deleted gulo-o check kori
    const existing =
      await this.sectionModel.findOne({
        where: { name: dto.name } as any,
        paranoid: false,
      });

    if (existing) {
      throw new BadRequestException(
        existing.deletedAt
          ? `Section "${dto.name}" already exists in deleted sections, please restore it`
          : `Section "${dto.name}" already exists`,
      );
    }

    const section =
      await this.sectionModel.create({
        ...dto,
        createdBy: dto.createdBy ?? dto.addedById,
        status:
          dto.status ?? SectionStatus.ACTIVE,
      });

    return this.findOne(section.uuid);
  }

  async findAll(query: QuerySectionDto) {
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
      await this.sectionModel.findAndCountAll({
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

  async findOne(uuid: string): Promise<Section> {
    const section =
      await this.sectionModel.findOne({
        where: { uuid } as any,
      });

    if (!section) {
      throw new NotFoundException(
        `Section #${uuid} not found`,
      );
    }

    return section;
  }

  async update(
    uuid: string,
    dto: UpdateSectionDto,
  ): Promise<Section> {
    const section =
      await this.sectionModel.findOne({
        where: { uuid } as any,
      });

    if (!section) {
      throw new NotFoundException(
        `Section #${uuid} not found`,
      );
    }

    if (dto.name && dto.name !== section.name) {
      const exists =
        await this.sectionModel.findOne({
          where: {
            name: dto.name,
            uuid: { [Op.ne]: uuid },
          } as any,
          paranoid: false,
        });

      if (exists) {
        throw new BadRequestException(
          exists.deletedAt
            ? `Section "${dto.name}" already exists in deleted sections`
            : `Section "${dto.name}" already exists`,
        );
      }
    }

    await section.update({
      ...dto,
      updatedBy:
        dto.addedById ?? section.updatedBy,
    });

    return this.findOne(uuid);
  }

  async remove(
    uuid: string,
  ): Promise<{ message: string }> {
    const section =
      await this.sectionModel.findOne({
        where: { uuid } as any,
      });

    if (!section) {
      throw new NotFoundException(
        `Section #${uuid} not found`,
      );
    }

    // status → inactive + soft delete
    await section.update({
      status: SectionStatus.INACTIVE,
    });

    await section.destroy();

    return {
      message: `Section #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string): Promise<Section> {
    const section =
      await this.sectionModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!section) {
      throw new NotFoundException(
        `Section #${uuid} not found`,
      );
    }

    if (!section.deletedAt) {
      throw new BadRequestException(
        `Section #${uuid} is not deleted`,
      );
    }

    // status → active + restore
    await section.restore();
    await section.update({
      status: SectionStatus.ACTIVE,
    });

    return this.findOne(uuid);
  }
}
