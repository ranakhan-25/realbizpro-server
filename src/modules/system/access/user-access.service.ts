import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysModules } from '../../../database/models/system/sys_module.model';
import { SysOrgEntitlement } from '../../../database/models/system/sys_org_entitlement.model';
import { SysFeatures } from '../../../database/models/system/sys_features.model';
import { SysUserRole } from '../../../database/models/system/sys_user_role.model';
import { SysRole } from '../../../database/models/system/sys_role.model';
import { SysRoleFeature } from '../../../database/models/system/sys_role_feature.model';
import { SysUser } from '../../../database/models/system/sys_user.model';
import { SysOrganization } from '../../../database/models/system/sys_organization.model';
import { getModuleMenuTree, MenuNode } from './module-menus';

export interface AccessibleModuleItem {
  id: number;
  key: string;
  name: string;
  code: string;
  route: string;
  features: string[];
  allowedRoutes: string[];
  menuTree?: MenuNode[];
}

export interface UserAccessResponse {
  user: {
    id: number;
    uuid?: string;
    name: string;
    email: string;
    username?: string;
    orgId: number | null;
    orgName?: string;
    isSuperUser: boolean;
    isOrgAdmin: boolean;
    role: string;
    roleLevel: number;
  };
  accessibleModules: AccessibleModuleItem[];
  entitledModuleKeys: string[];
  allAllowedPaths: string[];
}

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
  LAMS: 'lams',
};

function normalizeModuleKey(code?: string, name?: string): string {
  const upperCode = (code || '').toUpperCase().trim();
  if (MODULE_KEY_MAP[upperCode]) {
    return MODULE_KEY_MAP[upperCode];
  }
  const lowerName = (name || '').toLowerCase();
  if (lowerName.includes('project')) return 'project';
  if (lowerName.includes('crm')) return 'crm';
  if (lowerName.includes('procure')) return 'procurement';
  if (lowerName.includes('account') || lowerName.includes('financ')) return 'accounts';
  if (lowerName.includes('hrm') || lowerName.includes('human')) return 'hrm';
  if (lowerName.includes('invent') || lowerName.includes('supply')) return 'inventory';
  if (lowerName.includes('credit')) return 'cr';
  if (lowerName.includes('lams')) return 'lams';
  return (code || 'module').toLowerCase().replace(/[^a-z0-9]/g, '');
}

@Injectable()
export class UserAccessService {
  constructor(
    @InjectModel(SysModules)
    private readonly moduleModel: typeof SysModules,
    @InjectModel(SysOrgEntitlement)
    private readonly entitlementModel: typeof SysOrgEntitlement,
    @InjectModel(SysFeatures)
    private readonly featureModel: typeof SysFeatures,
    @InjectModel(SysUserRole)
    private readonly userRoleModel: typeof SysUserRole,
    @InjectModel(SysRole)
    private readonly roleModel: typeof SysRole,
    @InjectModel(SysRoleFeature)
    private readonly roleFeatureModel: typeof SysRoleFeature,
    @InjectModel(SysUser)
    private readonly userModel: typeof SysUser,
    @InjectModel(SysOrganization)
    private readonly orgModel: typeof SysOrganization,
  ) {}

  async getUserAccess(currentUser: any): Promise<UserAccessResponse> {
    if (!currentUser || !currentUser.id) {
      throw new UnauthorizedException('Authentication token required');
    }

    const user = await this.userModel.findByPk(currentUser.id, {
      attributes: ['id', 'uuid', 'name', 'email', 'username', 'orgId', 'orgUuid', 'isSuperUser', 'isOrgAdmin'],
      include: [
        {
          model: this.roleModel,
          as: 'roles',
          attributes: ['id', 'name', 'slug', 'roleLevel'],
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      throw new UnauthorizedException('User profile not found');
    }

    let orgName = '';
    if (user.orgId) {
      const org = await this.orgModel.findByPk(user.orgId, { attributes: ['id', 'name'] });
      if (org) orgName = org.name;
    }

    const isSuperUser = Boolean(user.isSuperUser || currentUser.isSuperUser);
    const isOrgAdmin = Boolean(user.isOrgAdmin || currentUser.isOrgAdmin);
    const userRoleObj = user.roles && user.roles.length ? user.roles[0] : null;
    const roleSlug = isSuperUser ? 'super-admin' : isOrgAdmin ? 'org-admin' : (userRoleObj?.slug || 'user');
    const roleLevel = isSuperUser ? 1 : isOrgAdmin ? 2 : (userRoleObj?.roleLevel || 4);

    const accessibleModules: AccessibleModuleItem[] = [];

    if (isSuperUser) {
      // 1. Super Admin: full unrestricted access to all modules and routes
      const allModules = await this.moduleModel.findAll({
        order: [['id', 'ASC']],
      });

      for (const mod of allModules) {
        const key = normalizeModuleKey(mod.code, mod.name);
        const menuTree = getModuleMenuTree(key, ['*']);
        accessibleModules.push({
          id: mod.id,
          key,
          name: mod.name,
          code: mod.code || key.toUpperCase(),
          route: `/dashboard/${key}`,
          features: ['*'],
          allowedRoutes: ['*'],
          menuTree,
        });
      }
    } else if (isOrgAdmin && user.orgId) {
      // 2. Org Admin: all modules and features entitled to their organization
      const entitlements = await this.entitlementModel.findAll({
        where: { orgId: user.orgId, isEnabled: true },
        include: [
          { model: this.moduleModel },
          { model: this.featureModel },
        ],
      });

      const moduleMap = new Map<number, { mod: SysModules; features: string[] }>();
      for (const ent of entitlements) {
        if (!ent.module) continue;
        if (!moduleMap.has(ent.moduleId)) {
          moduleMap.set(ent.moduleId, { mod: ent.module, features: [] });
        }
        if (ent.feature?.code) {
          moduleMap.get(ent.moduleId)!.features.push(ent.feature.code);
        }
      }

      for (const { mod, features } of moduleMap.values()) {
        const key = normalizeModuleKey(mod.code, mod.name);
        const menuTree = getModuleMenuTree(key, ['*']);
        accessibleModules.push({
          id: mod.id,
          key,
          name: mod.name,
          code: mod.code || key.toUpperCase(),
          route: `/dashboard/${key}`,
          features,
          allowedRoutes: ['*'],
          menuTree,
        });
      }
    } else if (user.orgId) {
      // 3. Sub-Role User: Intersection of Org Entitlements & Role Features
      const entitlements = await this.entitlementModel.findAll({
        where: { orgId: user.orgId, isEnabled: true },
        attributes: ['moduleId', 'featureId'],
      });
      const entitledModuleIds = new Set(entitlements.map((e) => Number(e.moduleId)));
      const entitledFeatureIds = new Set(entitlements.map((e) => Number(e.featureId)));

      const userRoleIds = (user.roles || []).map((r) => r.id);
      const roleFeatures = userRoleIds.length
        ? await this.roleFeatureModel.findAll({
            where: { roleId: userRoleIds },
            include: [{ model: this.featureModel }],
          })
        : [];

      // Intersect
      const activeFeatureMap = new Map<number, string[]>(); // moduleId -> feature codes
      for (const rf of roleFeatures) {
        if (!rf.feature) continue;
        const feat = rf.feature;
        if (entitledFeatureIds.has(Number(feat.id)) && entitledModuleIds.has(Number(feat.moduleId))) {
          if (!activeFeatureMap.has(Number(feat.moduleId))) {
            activeFeatureMap.set(Number(feat.moduleId), []);
          }
          if (feat.code) activeFeatureMap.get(Number(feat.moduleId))!.push(feat.code);
        }
      }

      if (activeFeatureMap.size > 0) {
        const modules = await this.moduleModel.findAll({
          where: { id: Array.from(activeFeatureMap.keys()) },
        });

        for (const mod of modules) {
          const key = normalizeModuleKey(mod.code, mod.name);
          const features = activeFeatureMap.get(Number(mod.id)) || [];
          const allowedRoutes = features.map((f) => f.toLowerCase().replace(/_/g, '-'));
          const menuTree = getModuleMenuTree(key, allowedRoutes);
          accessibleModules.push({
            id: mod.id,
            key,
            name: mod.name,
            code: mod.code || key.toUpperCase(),
            route: `/dashboard/${key}`,
            features,
            allowedRoutes,
            menuTree,
          });
        }
      }
    }

    const entitledModuleKeys = accessibleModules.map((m) => m.key);
    const allAllowedPaths: string[] = [];

    for (const m of accessibleModules) {
      allAllowedPaths.push(`/dashboard/${m.key}`);
      allAllowedPaths.push(`/dashboard/${m.key}/dashboard`);
    }

    return {
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        username: user.username,
        orgId: user.orgId || null,
        orgName,
        isSuperUser,
        isOrgAdmin,
        role: roleSlug,
        roleLevel,
      },
      accessibleModules,
      entitledModuleKeys,
      allAllowedPaths,
    };
  }
}
