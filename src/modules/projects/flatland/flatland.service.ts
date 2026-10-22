import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  InjectConnection,
  InjectModel,
} from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import {
  FlatLand,
  FlatLandStatus,
} from 'src/database/models/projects/flatland/pr_flatland.model';
import { CreateFlatLandDto } from './dto/create-flatland.dto';
import { QueryFlatLandDto } from './dto/query-flatland.dto';
import { UpdateFlatLandDto } from './dto/update-flatland.dto';

@Injectable()
export class FlatLandService {
  constructor(
    @InjectModel(FlatLand)
    private readonly flatLandModel: typeof FlatLand,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async create(dto: CreateFlatLandDto, userId?: number) {
    const uuid = await this.sequelize.transaction(async (transaction) => {
      let project = dto.projectId
        ? await this.projectModel.findOne({
            where: { uuid: dto.projectId } as WhereOptions<Project>,
            transaction,
          })
        : await this.projectModel.findOne({ transaction });

      if (!project) {
        project = await this.projectModel.create(
          {
            code: 'PRJ-MAIN',
            name: dto.projectName || 'Main Real Estate Project',
            status: 'ACTIVE',
          } as any,
          { transaction },
        );
      }

      const flatLand = await this.flatLandModel.create(
        {
          ...dto,
          projectId: project.uuid,
          projectName: dto.projectName ?? project.name,
          propertyType: dto.propertyType ?? 'flat',
          status: dto.status ?? FlatLandStatus.AVAILABLE,
          createdBy: userId === undefined ? undefined : String(userId),
        },
        { transaction },
      );
      return flatLand.uuid;
    });
    return this.findOne(uuid);
  }

  async findAll(query: QueryFlatLandDto, propertyType?: 'flat' | 'land') {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search?.trim();
    const where: WhereOptions<FlatLand> = {
      ...(propertyType ? { propertyType } : {}),
      ...(search
        ? {
          [Op.or]: [
            { projectName: { [Op.iLike]: `%${search}%` } },
            { flatLandNo: { [Op.iLike]: `%${search}%` } },
            { customerName: { [Op.iLike]: `%${search}%` } },
            { uid: { [Op.iLike]: `%${search}%` } },
            { blockName: { [Op.iLike]: `%${search}%` } },
            { roadNo: { [Op.iLike]: `%${search}%` } },
          ],
        }
        : {}),
    };
    const { rows, count } = await this.flatLandModel.findAndCountAll({
      where: where as WhereOptions<FlatLand>,
      include: [
        {
          model: this.projectModel,
          as: 'project',
          attributes: ['uuid', 'code', 'name'],
        },
      ],
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
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

  async findOne(
    uuid: string,
    propertyType?: 'flat' | 'land',
  ): Promise<FlatLand> {
    const flatLand = await this.flatLandModel.findOne({
      where: { uuid, ...(propertyType ? { propertyType } : {}) } as WhereOptions<FlatLand>,
      include: [
        {
          model: this.projectModel,
          as: 'project',
          attributes: ['uuid', 'code', 'name'],
        },
      ],
    });
    if (!flatLand) {
      throw new NotFoundException(`Flat/Land "${uuid}" not found`);
    }
    return flatLand;
  }

  async update(
    uuid: string,
    dto: UpdateFlatLandDto,
    userId?: number,
    propertyType?: 'flat' | 'land',
  ) {
    await this.sequelize.transaction(async (transaction) => {
      const flatLand = await this.flatLandModel.findOne({
        where: { uuid, ...(propertyType ? { propertyType } : {}) } as WhereOptions<FlatLand>,
        transaction,
      });
      if (!flatLand) {
        throw new NotFoundException(`Flat/Land "${uuid}" not found`);
      }
      if (dto.projectId) {
        const project = await this.projectModel.findOne({
          where: { uuid: dto.projectId } as WhereOptions<Project>,
          transaction,
        });
        if (!project) {
          throw new BadRequestException(`Project "${dto.projectId}" not found`);
        }
        if (!dto.projectName) {
          dto.projectName = project.name;
        }
      }
      await flatLand.update(
        {
          ...dto,
          ...(propertyType ? { propertyType } : {}),
          updatedBy: userId === undefined ? undefined : String(userId),
        },
        { transaction },
      );
    });
    return this.findOne(uuid, propertyType);
  }

  async remove(uuid: string, propertyType?: 'flat' | 'land') {
    const flatLand = await this.flatLandModel.findOne({
      where: { uuid, ...(propertyType ? { propertyType } : {}) } as WhereOptions<FlatLand>,
    });
    if (!flatLand) {
      throw new NotFoundException(`Flat/Land "${uuid}" not found`);
    }
    await flatLand.destroy();
    return { message: `Flat/Land "${uuid}" deleted successfully` };
  }

  async restore(uuid: string, propertyType?: 'flat' | 'land') {
    const flatLand = await this.flatLandModel.findOne({
      where: { uuid, ...(propertyType ? { propertyType } : {}) } as WhereOptions<FlatLand>,
      paranoid: false,
    });
    if (!flatLand) {
      throw new NotFoundException(`Flat/Land "${uuid}" not found`);
    }
    if (!flatLand.deletedAt) {
      throw new BadRequestException(`Flat/Land "${uuid}" is not deleted`);
    }
    await flatLand.restore();
    return this.findOne(uuid, propertyType);
  }
}
