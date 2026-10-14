import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { PaginateParams } from '../../../common/decorators/paginate.decorator';
import { UsersService } from '../users/users.service';
import { CreateFeatureDto } from './dto/create.dto';
import { UpdateFeatureDto } from './dto/update.dto';
import { SysFeatures } from '../../../database/models/system/sys_features.model';
import { SysPermission } from '../../../database/models/system/sys_permission.model';
import { SysModules } from '../../../database/models/system/sys_module.model';

// Export the interface and allow undefined values
export interface FeatureTreeNode {
  id: string;
  name: string;
  description: string | null | undefined;
  moduleId?: number;
  module?: {
    id?: string | undefined;
    name?: string | undefined;
    description: string | null | undefined;
  };
  permissions: {
    id: string;
    key: string;
    name?: string;
    description: string | null | undefined;
    resource: string;
    action: string;
    context: string;
  }[];
}

@Injectable()
export class FeaturesService {
  constructor(
    @InjectModel(SysFeatures)
    private readonly featuresModel: typeof SysFeatures,
    @InjectModel(SysPermission)
    private readonly permissionModel: typeof SysPermission,
    @InjectModel(SysModules)
    private readonly modulesModel: typeof SysModules,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateFeatureDto) {
    // Check if name already exists
    const existing =
      await this.featuresModel.findOne({
        where: { name: dto.name },
      });
    if (existing) {
      throw new ConflictException(
        'Feature with this name already exists',
      );
    }

    // Validate moduleId if provided
    if (dto.moduleId) {
      const moduleExists =
        await this.modulesModel.findByPk(
          dto.moduleId,
        );
      if (!moduleExists) {
        throw new NotFoundException(
          `Module with ID ${dto.moduleId} not found`,
        );
      }
    }

    return this.featuresModel.create(dto);
  }

  async findAll(moduleId?: number) {
    const whereClause = moduleId
      ? { moduleId }
      : {};

    return this.featuresModel.findAll({
      where: whereClause,
      include: [
        {
          association: 'module',
          attributes: [
            'id',
            'name',
            'description',
          ],
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number) {
    const feature =
      await this.featuresModel.findByPk(id, {
        include: [
          {
            association: 'permissions',
            attributes: [
              'id',
              'key',
              'name',
              'description',
            ],
          },
          {
            association: 'module',
            attributes: [
              'id',
              'name',
              'description',
            ],
            required: false,
          },
        ],
      });

    if (!feature) {
      throw new NotFoundException(
        'Feature not found',
      );
    }

    return feature;
  }

  async update(
    id: number,
    dto: UpdateFeatureDto,
  ) {
    const feature =
      await this.featuresModel.findByPk(id);
    if (!feature) {
      throw new NotFoundException(
        'Feature not found',
      );
    }

    // Check name uniqueness if name is being updated
    if (dto.name && dto.name !== feature.name) {
      const existing =
        await this.featuresModel.findOne({
          where: { name: dto.name },
        });
      if (existing) {
        throw new ConflictException(
          'Feature with this name already exists',
        );
      }
    }

    // Validate moduleId if provided
    if (dto.moduleId !== undefined) {
      if (dto.moduleId === null) {
        // Allow setting moduleId to null (removing module association)
      } else {
        const moduleExists =
          await this.modulesModel.findByPk(
            dto.moduleId,
          );
        if (!moduleExists) {
          throw new NotFoundException(
            `Module with ID ${dto.moduleId} not found`,
          );
        }
      }
    }

    await feature.update(dto);
    return feature;
  }

  async remove(id: number) {
    const feature =
      await this.featuresModel.findByPk(id);
    if (!feature) {
      throw new NotFoundException(
        'Feature not found',
      );
    }

    // Check if any permissions are linked to this feature
    const permissionCount =
      await this.permissionModel.count({
        where: { featureId: id },
      });
    if (permissionCount > 0) {
      throw new ConflictException(
        `Cannot delete feature. ${permissionCount} permission(s) are linked to this feature. Remove permissions first.`,
      );
    }

    await feature.destroy();
    return {
      message: 'Feature deleted successfully',
    };
  }

  async findAllTreeWithPermissions(
    moduleId?: number,
  ): Promise<FeatureTreeNode[]> {
    const whereClause = moduleId
      ? { moduleId }
      : {};

    const allFeatures =
      await this.featuresModel.findAll({
        where: whereClause,
        include: [
          {
            association: 'permissions',
            attributes: [
              'id',
              'key',
              'name',
              'description',
              'resource',
              'action',
              'context',
            ],
            order: [['createdAt', 'DESC']],
          },
          {
            association: 'module',
            attributes: [
              'id',
              'name',
              'description',
            ],
            required: false,
          },
        ],
        order: [['createdAt', 'DESC']],
      });

    return allFeatures.map((feature) => ({
      id: feature.id.toString(),
      name: feature.name,
      moduleId: feature?.moduleId,
      module: feature.module
        ? {
            id: feature.module.id.toString(),
            name: feature.module.name,
            description:
              feature.module.description ?? null,
          }
        : undefined,
      description: feature.description ?? null,
      permissions: (
        feature.permissions || []
      ).map((p) => ({
        id: p.id.toString(),
        key: p.key,
        name: p.name,
        description: p.description ?? null,
        resource: p.resource,
        action: p.action,
        context: p.context,
      })),
    }));
  }

  async findAndCount({
    skip,
    limit,
    search,
    moduleId,
  }: PaginateParams & {
    moduleId?: number;
  }): Promise<[any[], number]> {
    const whereClause: any = {};

    // Add search filter
    if (search) {
      whereClause.name = {
        [Op.like]: `%${search}%`,
      };
    }

    // Add moduleId filter
    if (moduleId) {
      whereClause.moduleId = moduleId;
    }

    const { rows, count } =
      await this.featuresModel.findAndCountAll({
        where: whereClause,
        include: [
          {
            association: 'module',
            attributes: [
              'id',
              'name',
              'description',
            ],
            required: false,
          },
        ],
        order: [['createdAt', 'DESC']],
        offset: skip,
        limit: limit,
      });

    return [rows, count];
  }

  async getFeatureDropdown(moduleId?: number) {
    const whereClause = moduleId
      ? { moduleId }
      : {};

    const features =
      await this.featuresModel.findAll({
        where: whereClause,
        attributes: ['id', 'name'],
        order: [['name', 'ASC']],
      });
    return features.map((f) => ({
      id: f.id.toString(),
      name: f.name,
    }));
  }
}
