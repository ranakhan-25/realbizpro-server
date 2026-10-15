import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import {
  LandInfrastructure,
  LandInfrastructureKind,
} from 'src/database/models/projects/land-infrastructure/pr_land_infrastructure.model';
import { CreateLandInfrastructureDto } from './dto/create-land-infrastructure.dto';
import { QueryLandInfrastructureDto } from './dto/query-land-infrastructure.dto';
import { UpdateLandInfrastructureDto } from './dto/update-land-infrastructure.dto';

@Injectable()
export class LandInfrastructureService {
  constructor(
    @InjectModel(LandInfrastructure)
    private readonly infrastructureModel: typeof LandInfrastructure,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async create(dto: CreateLandInfrastructureDto, userId?: number) {
    const uuid = await this.sequelize.transaction(async (transaction) => {
      const project = await this.projectModel.findOne({
        where: { uuid: dto.projectId } as WhereOptions<Project>,
        transaction,
      });
      if (!project) {
        throw new BadRequestException(`Project "${dto.projectId}" not found`);
      }
      const item = await this.infrastructureModel.create(
        {
          ...dto,
          createdBy: userId === undefined ? undefined : String(userId),
        },
        { transaction },
      );
      return item.uuid;
    });
    return this.findOne(uuid);
  }

  async findAll(
    query: QueryLandInfrastructureDto,
    kind?: LandInfrastructureKind,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search?.trim();
    const where: WhereOptions<LandInfrastructure> = {
      ...(kind ? { kind } : {}),
      ...(search
        ? {
            [Op.or]: [
              { name: { [Op.iLike]: `%${search}%` } },
              { size: { [Op.iLike]: `%${search}%` } },
              { details: { [Op.iLike]: `%${search}%` } },
            ],
          }
        : {}),
    };
    const { rows, count } = await this.infrastructureModel.findAndCountAll({
      where: where as WhereOptions<LandInfrastructure>,
      include: [{ model: this.projectModel, as: 'project', attributes: ['uuid', 'code', 'name'] }],
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });
    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  }

  async findOne(uuid: string) {
    const item = await this.infrastructureModel.findOne({
      where: { uuid } as WhereOptions<LandInfrastructure>,
      include: [{ model: this.projectModel, as: 'project', attributes: ['uuid', 'code', 'name'] }],
    });
    if (!item) {
      throw new NotFoundException(`Land infrastructure "${uuid}" not found`);
    }
    return item;
  }

  async findOneByKind(uuid: string, kind: LandInfrastructureKind) {
    const item = await this.infrastructureModel.findOne({
      where: { uuid, kind } as WhereOptions<LandInfrastructure>,
      include: [{ model: this.projectModel, as: 'project', attributes: ['uuid', 'code', 'name'] }],
    });
    if (!item) {
      throw new NotFoundException(`Land infrastructure "${uuid}" not found`);
    }
    return item;
  }

  async update(
    uuid: string,
    dto: UpdateLandInfrastructureDto,
    userId?: number,
    kind?: LandInfrastructureKind,
  ) {
    await this.sequelize.transaction(async (transaction) => {
      const item = await this.infrastructureModel.findOne({
        where: { uuid, ...(kind ? { kind } : {}) } as WhereOptions<LandInfrastructure>,
        transaction,
      });
      if (!item) {
        throw new NotFoundException(`Land infrastructure "${uuid}" not found`);
      }
      if (dto.projectId) {
        const project = await this.projectModel.findOne({
          where: { uuid: dto.projectId } as WhereOptions<Project>,
          transaction,
        });
        if (!project) {
          throw new BadRequestException(`Project "${dto.projectId}" not found`);
        }
      }
      await item.update(
        {
          ...dto,
          ...(kind ? { kind } : {}),
          updatedBy: userId === undefined ? undefined : String(userId),
        },
        { transaction },
      );
    });
    return kind ? this.findOneByKind(uuid, kind) : this.findOne(uuid);
  }

  async remove(uuid: string, kind?: LandInfrastructureKind) {
    const item = await this.infrastructureModel.findOne({
      where: { uuid, ...(kind ? { kind } : {}) } as WhereOptions<LandInfrastructure>,
    });
    if (!item) {
      throw new NotFoundException(`Land infrastructure "${uuid}" not found`);
    }
    await item.destroy();
    return { message: `Land infrastructure "${uuid}" deleted successfully` };
  }
}
