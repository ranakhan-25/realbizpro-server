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
import { SysOrgEntitlement } from '../../../database/models/system/sys_org_entitlement.model';
import { SysOrganization } from '../../../database/models/system/sys_organization.model';
import { SysPlan } from '../../../database/models/system/sys_plan.model';

const MODULE_KEY_MAP: Record<string, string> = {
  PROJECTS: 'project',
  PROJECT: 'project',
  CRM: 'crm',
  PROCUREMENT: 'procurement',
  FINANCE: 'accounts',
  ACCOUNTS: 'accounts',
  HRM: 'hrm',
  SCM: 'inventory',
  INVENTORY: 'inventory',
  CR: 'cr',
  CREDIT: 'cr',
  CREDIT_REALIZATION: 'cr',
  LAMS: 'lams',
};

function matchesPlanFeature(mod: SysModules, planFeatures: string[]): boolean {
  if (planFeatures.includes('all_features')) return true;
  const modCode = (mod.code || '').toUpperCase().trim();
  const modKey = (MODULE_KEY_MAP[modCode] || modCode.toLowerCase()).trim();
  const modName = (mod.name || '').toLowerCase().trim();

  return planFeatures.some((pf) => {
    const p = pf.toLowerCase().trim();
    if (p === modKey) return true;
    if (p === modCode.toLowerCase()) return true;
    if (modName.includes(p) || p.includes(modName)) return true;
    if (p === 'projects' && modKey === 'project') return true;
    if (p === 'project' && modKey === 'project') return true;
    if (p === 'finance' && modKey === 'accounts') return true;
    return false;
  });
}

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
    @InjectModel(SysOrgEntitlement)
    private readonly entitlementModel: typeof SysOrgEntitlement,
    @InjectModel(SysOrganization)
    private readonly orgModel: typeof SysOrganization,
    @InjectModel(SysPlan)
    private readonly planModel: typeof SysPlan,
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
    currentUser?: any,
    targetOrgId?: number,
  ): Promise<FeatureTreeNode[]> {
    let effectiveOrgId: number | undefined;

    if (currentUser && !currentUser.isSuperUser) {
      effectiveOrgId = currentUser.orgId ? Number(currentUser.orgId) : undefined;
    } else if (currentUser && currentUser.isSuperUser && targetOrgId) {
      effectiveOrgId = Number(targetOrgId);
    }

    const whereConditions: any[] = [];

    if (effectiveOrgId) {
      // 1. Check direct org entitlements
      const entitlements = await this.entitlementModel.findAll({
        where: { orgId: effectiveOrgId, isEnabled: true },
        attributes: ['moduleId', 'featureId'],
      });

      if (entitlements.length > 0) {
        const entitledModuleIds = Array.from(
          new Set(
            entitlements
              .map((e) => (e.moduleId ? Number(e.moduleId) : null))
              .filter((id): id is number => id !== null),
          ),
        );
        const entitledFeatureIds = Array.from(
          new Set(
            entitlements
              .map((e) => (e.featureId ? Number(e.featureId) : null))
              .filter((id): id is number => id !== null),
          ),
        );

        if (entitledModuleIds.length === 0) {
          return [];
        }

        if (moduleId) {
          if (!entitledModuleIds.includes(moduleId)) {
            return [];
          }
          whereConditions.push({ moduleId });
        } else {
          whereConditions.push({ moduleId: { [Op.in]: entitledModuleIds } });
        }

        if (entitledFeatureIds.length > 0) {
          whereConditions.push({ id: { [Op.in]: entitledFeatureIds } });
        }
      } else {
        // 2. Fallback to organization plan
        const org = await this.orgModel.findByPk(effectiveOrgId, {
          include: [
            {
              model: this.planModel,
              as: 'plan',
            },
          ],
        });

        const planFeatures: string[] = Array.isArray(org?.plan?.features)
          ? org!.plan!.features
          : [];

        if (planFeatures.includes('all_features')) {
          if (moduleId) {
            whereConditions.push({ moduleId });
          }
        } else if (planFeatures.length > 0) {
          const allModules = await this.modulesModel.findAll();
          const matchedModuleIds = allModules
            .filter((mod) => matchesPlanFeature(mod, planFeatures))
            .map((mod) => Number(mod.id));

          if (matchedModuleIds.length === 0) {
            return [];
          }

          if (moduleId) {
            if (!matchedModuleIds.includes(moduleId)) {
              return [];
            }
            whereConditions.push({ moduleId });
          } else {
            whereConditions.push({ moduleId: { [Op.in]: matchedModuleIds } });
          }
        } else {
          return [];
        }
      }
    } else {
      if (moduleId) {
        whereConditions.push({ moduleId });
      }
    }

    const whereClause =
      whereConditions.length > 0 ? { [Op.and]: whereConditions } : {};

    const allFeatures = await this.featuresModel.findAll({
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
      code: feature.code ?? null,
      routePath: feature.routePath ?? null,
      actionType: feature.actionType ?? 'read',
      displayOrder: feature.displayOrder ?? 0,
      moduleId: feature?.moduleId,
      module: feature.module
        ? {
            id: feature.module.id.toString(),
            name: feature.module.name,
            description: feature.module.description ?? null,
          }
        : undefined,
      description: feature.description ?? null,
      permissions: (feature.permissions || []).map((p) => ({
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
