import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CreatePermissionDto } from './dto/create.dto';
import { QueryPermissionDto } from './dto/filterList.dto';
import { UpdatePermissionDto } from './dto/update.dto';
import { SysPermission } from '../../../database/models/system/sys_permission.model';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(SysPermission)
    private permissionModel: typeof SysPermission,
  ) {}

  async create(
    createPermissionDto: CreatePermissionDto,
  ): Promise<SysPermission> {
    // Check if permission key already exists
    const existingPermission =
      await this.permissionModel.findOne({
        where: { key: createPermissionDto.key },
      });

    if (existingPermission) {
      throw new ConflictException(
        'Permission with this key already exists',
      );
    }

    try {
      return await this.permissionModel.create({
        key: createPermissionDto.key,
        name: createPermissionDto.name,
        description:
          createPermissionDto.description,
        resource: createPermissionDto.resource,
        action: createPermissionDto.action,
        context: createPermissionDto.context,
        featureId: createPermissionDto.featureId,
      });
    } catch (error) {
      throw new BadRequestException(
        'Failed to create permission',
      );
    }
  }

  async findAll(): Promise<SysPermission[]> {
    console.log({
      hh: '==================',
    });

    return this.permissionModel.findAll({
      include: [
        {
          association: 'feature',
          attributes: ['id', 'name'],
        },
      ],
      order: [['feature_id', 'ASC']],
    });
  }

  async findOne(
    id: string,
  ): Promise<SysPermission> {
    const permission =
      await this.permissionModel.findByPk(id);

    if (!permission) {
      throw new NotFoundException(
        `Permission with ID ${id} not found`,
      );
    }

    return permission;
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<SysPermission> {
    const permission =
      await this.permissionModel.findByPk(id);

    if (!permission) {
      throw new NotFoundException(
        `Permission with ID ${id} not found`,
      );
    }

    // Check key uniqueness if key is being updated
    if (
      updatePermissionDto.key &&
      updatePermissionDto.key !== permission.key
    ) {
      const existingPermission =
        await this.permissionModel.findOne({
          where: { key: updatePermissionDto.key },
        });

      if (existingPermission) {
        throw new ConflictException(
          'Permission with this key already exists',
        );
      }
    }

    await permission.update({
      key:
        updatePermissionDto.key ?? permission.key,
      name:
        updatePermissionDto.name ??
        permission.name,
      description:
        updatePermissionDto.description ??
        permission.description,
      resource:
        updatePermissionDto.resource ??
        permission.resource,
      action:
        updatePermissionDto.action ??
        permission.action,
      context:
        updatePermissionDto.context ??
        permission.context,
      featureId:
        updatePermissionDto.featureId ??
        permission.featureId,
    });

    return permission.reload();
  }

  async remove(id: string): Promise<void> {
    const permission =
      await this.permissionModel.findByPk(id);

    if (!permission) {
      throw new NotFoundException(
        `Permission with ID ${id} not found`,
      );
    }

    await permission.destroy();
  }

  async findByKey(
    key: string,
  ): Promise<SysPermission | null> {
    return this.permissionModel.findOne({
      where: { key },
    });
  }

  async createMany(
    permissions: CreatePermissionDto[],
  ): Promise<SysPermission[]> {
    const createdPermissions: SysPermission[] =
      [];

    for (const permissionDto of permissions) {
      // Skip if already exists
      const existing = await this.findByKey(
        permissionDto.key,
      );
      if (!existing) {
        const created = await this.create(
          permissionDto,
        );
        createdPermissions.push(created);
      }
    }

    return createdPermissions;
  }

  async findAndCount(
    params: QueryPermissionDto,
  ): Promise<[any[], number]> {
    const {
      search,
      page = 1,
      limit = 20,
      featureId,
      moduleId,
      resource,
      action,
      context,
      sortField,
      sortOrder,
    } = params;

    const whereClause: any = {};
    const featureWhereClause: any = {};

    if (search) {
      const searchTerm = search.trim();
      whereClause[Op.or] = [
        {
          name: { [Op.iLike]: `%${searchTerm}%` },
        },
        {
          key: { [Op.iLike]: `%${searchTerm}%` },
        },
        {
          resource: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
        {
          description: {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
      ];
    }

    if (featureId) {
      whereClause.featureId = featureId;
    }

    if (resource) {
      whereClause.resource = {
        [Op.iLike]: `%${resource.trim()}%`,
      };
    }

    if (action) {
      whereClause.action = action;
    }

    if (context) {
      whereClause.context = context;
    }

    if (moduleId) {
      featureWhereClause.moduleId = moduleId;
    }

    const order: any[] = [];
    if (sortField && sortOrder) {
      order.push([sortField, sortOrder]);
    }
    if (sortField !== 'id') {
      order.push(['id', 'ASC']);
    }

    const { rows, count } =
      await this.permissionModel.findAndCountAll({
        where: whereClause,
        include: [
          {
            association: 'feature',
            attributes: [
              'id',
              'name',
              'moduleId',
            ],
            where: featureWhereClause,
            required:
              Object.keys(featureWhereClause)
                .length > 0,
            include: [
              {
                association: 'module',
                attributes: ['id', 'name'],
                required: false,
              },
            ],
          },
        ],
        order:
          order.length > 0
            ? order
            : [['feature_id', 'DESC']],
        offset: (page - 1) * limit,
        limit: limit,
        distinct: true,
      });

    return [rows, count];
  }
}
