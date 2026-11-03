import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysModules } from '../../../database/models/system/sys_module.model';
import { SysOrgEntitlement } from '../../../database/models/system/sys_org_entitlement.model';
import { SysFeatures } from '../../../database/models/system/sys_features.model';
import { SysUserRole } from '../../../database/models/system/sys_user_role.model';
import { SysRole } from '../../../database/models/system/sys_role.model';
import { SysRoleFeature } from '../../../database/models/system/sys_role_feature.model';
import { SysRolePermission } from '../../../database/models/system/sys_role_permission.model';
import { SysPermission } from '../../../database/models/system/sys_permission.model';
import { SysUser } from '../../../database/models/system/sys_user.model';
import { SysOrganization } from '../../../database/models/system/sys_organization.model';
import { getModuleMenuTree, MenuNode } from './module-menus';
import { AdminMenuService, AdminMenuItemDto } from '../admin-menu/admin-menu.service';

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

function slugify(text?: string): string {
  return (text || '')
    .toLowerCase()
    .trim()
    .replace(/^\/dashboard\/?/i, '')
    .replace(/^\//, '')
    .replace(/\/dashboard$/i, '')
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function titleCase(text: string): string {
  return text
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export const CORE_MODULE_KEYS: Record<number, string> = {
  10: 'project',
  11: 'inventory',
  12: 'accounts',
  13: 'hrm',
  14: 'crm',
  15: 'cr',
  16: 'lams',
  17: 'procurement',
};

// Map duplicate module IDs to their canonical core module ID
export const MODULE_CANONICAL_ID_MAP: Record<number, number> = {
  19: 14, // CRM -> Customer Relationship Management
  23: 10, // Project -> Project Management
  24: 17, // Procurement -> Procurement Management
  27: 13, // HRM -> Human Resource Management
  28: 10, // Projects -> Project Management
  29: 10, // Project Billing -> Project Management
};

export function getCanonicalModuleId(id: number): number {
  return MODULE_CANONICAL_ID_MAP[id] || id;
}

export function getModuleKey(mod: { id: number; code?: string; name?: string; pathRoute?: string }): string {
  const canonicalId = getCanonicalModuleId(Number(mod.id));
  if (CORE_MODULE_KEYS[canonicalId]) {
    return CORE_MODULE_KEYS[canonicalId];
  }
  let base = '';
  if (mod.pathRoute) base = slugify(mod.pathRoute);
  if (!base && mod.code) base = slugify(mod.code);
  if (!base && mod.name) base = slugify(mod.name);
  if (!base) base = 'module';
  if (base === 'projects') base = 'project';
  return base;
}

export function convertAdminMenuToMenuNode(
  item: AdminMenuItemDto,
  moduleKey: string,
): MenuNode {
  let path = (item.url || '').trim();
  const modPrefix = `/dashboard/${moduleKey}`;
  if (path.startsWith(modPrefix)) {
    path = path.slice(modPrefix.length).replace(/^\/+/, '');
  } else if (path.startsWith('/dashboard/')) {
    const segments = path.replace(/^\/dashboard\//, '').split('/');
    segments.shift();
    path = segments.join('/');
  } else if (path.startsWith('/')) {
    path = path.replace(/^\/+/, '');
  }

  const slug =
    path.split('/').filter(Boolean).pop() ||
    slugify(item.title) ||
    'item';

  return {
    label: item.title,
    slug,
    path: path || slug,
    children:
      item.children && item.children.length > 0
        ? item.children.map((child) =>
            convertAdminMenuToMenuNode(child, moduleKey),
          )
        : undefined,
  };
}

export function pruneMenuTree(nodes: MenuNode[], allowedRoutes: string[]): MenuNode[] {
  if (!allowedRoutes || allowedRoutes.includes('*')) return nodes;
  const allowedSet = new Set(allowedRoutes.map((r) => r.toLowerCase().replace(/^\/+|\/+$/g, '')));
  const result: MenuNode[] = [];

  for (const n of nodes) {
    const kids = n.children ? pruneMenuTree(n.children, allowedRoutes) : undefined;
    const cleanPath = n.path.toLowerCase().replace(/^\/+|\/+$/g, '');
    const isSelfAllowed =
      allowedSet.has(cleanPath) ||
      Array.from(allowedSet).some((allowed) => cleanPath.startsWith(`${allowed}/`) || cleanPath === allowed);

    if (isSelfAllowed || (kids && kids.length > 0)) {
      result.push({
        ...n,
        children: kids,
      });
    }
  }
  return result;
}

function cleanTree(nodes: MenuNode[]): MenuNode[] {
  const seenPaths = new Set<string>();
  const result: MenuNode[] = [];

  for (const node of nodes) {
    if (seenPaths.has(node.path)) continue;
    seenPaths.add(node.path);

    if (node.children && node.children.length > 0) {
      node.children = cleanTree(node.children);
    }
    result.push(node);
  }
  return result;
}

export function buildDynamicMenuTree(
  features: SysFeatures[] | any[],
  moduleKey: string,
  allowedRoutes: string[] = ['*'],
): MenuNode[] {
  if (!features || features.length === 0) {
    return getModuleMenuTree(moduleKey, allowedRoutes);
  }

  const isAllAllowed = allowedRoutes.includes('*');
  const allowedSet = new Set(allowedRoutes.map((r) => r.toLowerCase().replace(/^\/+|\/+$/g, '')));

  const rootNodes: MenuNode[] = [];
  const nodeMap = new Map<string, MenuNode>();
  const leafPathSet = new Set<string>();

  for (const feat of features) {
    if (feat.isActive === false || feat.is_active === false) continue;

    const rawName = (feat.name || '').trim();
    const routePath = feat.routePath || feat.route_path;
    if (!rawName && !routePath && !feat.code) continue;

    let parts: string[] = [];

    // 1. Delimited name takes precedence (e.g. "Call Center | Follow Up" or "Billing | Category | Item")
    if (rawName.includes('|') || rawName.includes('>') || rawName.includes('::')) {
      parts = rawName.split(/\s*\|\s*|\s*>\s*|\s*::\s*/).filter(Boolean);
    } else if (routePath) {
      // 2. Route path hierarchy (e.g. "/dashboard/procurement/configuration/products/brand")
      const clean = routePath
        .replace(new RegExp(`^/dashboard/[^/]+/?`, 'i'), '')
        .replace(/^\//, '')
        .replace(/\/$/, '');
      const segments = clean.split('/').filter(Boolean);
      if (segments.length > 1) {
        parts = segments.map((seg, i) => (i === segments.length - 1 ? (rawName || titleCase(seg)) : titleCase(seg)));
      } else {
        parts = [rawName || titleCase(segments[0] || feat.code || 'Item')];
      }
    } else {
      // 3. Flat feature name
      parts = [rawName || feat.code || 'Item'];
    }

    if (parts.length === 0) continue;

    let finalLeafPath = '';
    if (routePath) {
      finalLeafPath = routePath
        .replace(new RegExp(`^/dashboard/[^/]+/?`, 'i'), '')
        .replace(/^\//, '')
        .replace(/\/$/, '');
    }
    if (!finalLeafPath) {
      finalLeafPath = parts.map((p) => slugify(p)).join('/');
    }

    if (!isAllAllowed) {
      const cleanCheck = finalLeafPath.toLowerCase();
      const isPermitted =
        allowedSet.has(cleanCheck) ||
        (feat.code && allowedSet.has(feat.code.toLowerCase())) ||
        Array.from(allowedSet).some((allowed) => cleanCheck.startsWith(`${allowed}/`) || cleanCheck === allowed);
      if (!isPermitted) continue;
    }

    let currentPath = '';
    let parentChildren = rootNodes;

    for (let i = 0; i < parts.length; i++) {
      const isLeaf = i === parts.length - 1;
      const partLabel = parts[i];
      const partSlug = slugify(partLabel) || `item-${i}`;
      currentPath = currentPath ? `${currentPath}/${partSlug}` : partSlug;

      if (!isLeaf) {
        let existingNode = nodeMap.get(currentPath);
        if (!existingNode) {
          existingNode = {
            label: partLabel,
            slug: partSlug,
            path: currentPath,
            children: [],
          };
          nodeMap.set(currentPath, existingNode);
          parentChildren.push(existingNode);
        } else if (!existingNode.children) {
          existingNode.children = [];
        }
        parentChildren = existingNode.children;
      } else {
        let existingNode = nodeMap.get(currentPath);
        if (existingNode && existingNode.children && existingNode.children.length > 0) {
          continue;
        }

        let uniqueLeafPath = finalLeafPath || currentPath;
        if (leafPathSet.has(uniqueLeafPath)) {
          uniqueLeafPath = `${uniqueLeafPath}-${feat.id || Math.random().toString(36).slice(2, 6)}`;
        }
        leafPathSet.add(uniqueLeafPath);

        const leafNode: MenuNode = {
          label: partLabel,
          slug: partSlug,
          path: uniqueLeafPath,
        };
        nodeMap.set(currentPath, leafNode);
        parentChildren.push(leafNode);
      }
    }
  }

  const cleaned = cleanTree(rootNodes);
  if (cleaned.length === 0) {
    return getModuleMenuTree(moduleKey, allowedRoutes);
  }
  return cleaned;
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
    @InjectModel(SysRolePermission)
    private readonly rolePermissionModel: typeof SysRolePermission,
    @InjectModel(SysPermission)
    private readonly permissionModel: typeof SysPermission,
    @InjectModel(SysUser)
    private readonly userModel: typeof SysUser,
    @InjectModel(SysOrganization)
    private readonly orgModel: typeof SysOrganization,
    private readonly adminMenuService: AdminMenuService,
  ) {}

  private async resolveModuleMenuTree(
    modId: number,
    moduleKey: string,
    roleSlug: string,
    featList: SysFeatures[],
    allowedRoutes: string[] = ['*'],
  ): Promise<MenuNode[]> {
    const canonicalId = getCanonicalModuleId(modId);

    try {
      const adminMenus = await this.adminMenuService.getMenuTree(
        roleSlug,
        String(canonicalId),
      );
      if (adminMenus && adminMenus.length > 0) {
        let tree = adminMenus.map((item) =>
          convertAdminMenuToMenuNode(item, moduleKey),
        );
        if (!allowedRoutes.includes('*')) {
          tree = pruneMenuTree(tree, allowedRoutes);
        }
        if (tree && tree.length > 0) {
          return tree;
        }
      }
    } catch (err) {
      console.warn(`Could not load sys_menus for module ${canonicalId}:`, err);
    }

    return buildDynamicMenuTree(featList, moduleKey, allowedRoutes);
  }

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
        where: { isActive: true },
        include: [
          {
            model: this.featureModel,
            as: 'features',
            required: false,
          },
        ],
        order: [
          ['displayOrder', 'ASC'],
          ['id', 'ASC'],
          [{ model: this.featureModel, as: 'features' }, 'displayOrder', 'ASC'],
          [{ model: this.featureModel, as: 'features' }, 'id', 'ASC'],
        ],
      });

      // Sort so that canonical core modules (10-17) come first
      allModules.sort((a, b) => {
        const aCore = CORE_MODULE_KEYS[Number(a.id)] ? 0 : 1;
        const bCore = CORE_MODULE_KEYS[Number(b.id)] ? 0 : 1;
        return aCore - bCore;
      });

      const seenKeys = new Set<string>();
      for (const mod of allModules) {
        const key = getModuleKey(mod);
        if (seenKeys.has(key)) continue;
        seenKeys.add(key);

        const featList = (mod.features || []).filter((f) => f.isActive !== false);
        const menuTree = await this.resolveModuleMenuTree(
          Number(mod.id),
          key,
          roleSlug,
          featList,
          ['*'],
        );
        const featCodes = featList.map((f) => f.code || `FEAT_${f.id}`).filter(Boolean);

        accessibleModules.push({
          id: mod.id,
          key,
          name: mod.name,
          code: mod.code || key.toUpperCase(),
          route: `/dashboard/${key}`,
          features: featCodes.length > 0 ? featCodes : ['*'],
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

      const moduleMap = new Map<number, { mod: SysModules; features: SysFeatures[]; codes: string[]; routes: string[] }>();
      for (const ent of entitlements) {
        if (!ent.module || ent.module.isActive === false) continue;
        if (!moduleMap.has(ent.moduleId)) {
          moduleMap.set(ent.moduleId, { mod: ent.module, features: [], codes: [], routes: [] });
        }
        if (ent.feature) {
          moduleMap.get(ent.moduleId)!.features.push(ent.feature);
          if (ent.feature.code) {
            moduleMap.get(ent.moduleId)!.codes.push(ent.feature.code);
          }
          if (ent.feature.routePath) {
            const clean = ent.feature.routePath.replace(new RegExp(`^/dashboard/[^/]+/?`, 'i'), '');
            if (clean) moduleMap.get(ent.moduleId)!.routes.push(clean);
          }
        }
      }

      const seenKeys = new Set<string>();
      for (const { mod, features, codes, routes } of moduleMap.values()) {
        const key = getModuleKey(mod);
        if (seenKeys.has(key)) continue;
        seenKeys.add(key);

        const allowedRoutes = routes.length > 0 ? routes : ['*'];

        let featList = features;
        if (featList.length === 0) {
          featList = await this.featureModel.findAll({
            where: { moduleId: mod.id, isActive: true },
            order: [['displayOrder', 'ASC'], ['id', 'ASC']],
          });
        }

        const menuTree = await this.resolveModuleMenuTree(
          Number(mod.id),
          key,
          roleSlug,
          featList,
          allowedRoutes,
        );
        accessibleModules.push({
          id: mod.id,
          key,
          name: mod.name,
          code: mod.code || key.toUpperCase(),
          route: `/dashboard/${key}`,
          features: codes.length > 0 ? codes : ['*'],
          allowedRoutes,
          menuTree,
        });
      }
    } else if (user.orgId) {
      // 3. Sub-Role User: Intersection of Org Entitlements & Role Permissions/Features
      const entitlements = await this.entitlementModel.findAll({
        where: { orgId: user.orgId, isEnabled: true },
        attributes: ['moduleId', 'featureId'],
      });
      const entitledModuleIds = new Set(entitlements.map((e) => Number(e.moduleId)));
      const entitledFeatureIds = new Set(entitlements.map((e) => Number(e.featureId)));

      const userRoleIds = (user.roles || []).map((r) => r.id);

      // Collect features assigned via sys_role_permissions
      const rolePermissions = userRoleIds.length
        ? await this.rolePermissionModel.findAll({
            where: { roleId: userRoleIds },
            include: [
              {
                model: this.permissionModel,
                include: [{ model: this.featureModel }],
              },
            ],
          })
        : [];

      // Also collect features assigned via sys_role_features (if any)
      const roleFeatures = userRoleIds.length
        ? await this.roleFeatureModel.findAll({
            where: { roleId: userRoleIds },
            include: [{ model: this.featureModel }],
          })
        : [];

      const featuresById = new Map<number, SysFeatures>();
      for (const rp of rolePermissions) {
        const feat = rp.permission?.feature;
        if (feat && feat.id) {
          featuresById.set(Number(feat.id), feat);
        }
      }
      for (const rf of roleFeatures) {
        const feat = rf.feature;
        if (feat && feat.id) {
          featuresById.set(Number(feat.id), feat);
        }
      }

      // Intersect with Organization Entitlements
      const activeFeatureMap = new Map<number, { features: SysFeatures[]; codes: string[]; routes: string[] }>();
      for (const feat of featuresById.values()) {
        const mId = Number(feat.moduleId);
        const fId = Number(feat.id);
        const isOrgAllowed =
          entitledFeatureIds.size === 0 ||
          entitledFeatureIds.has(fId) ||
          entitledModuleIds.has(mId);

        if (isOrgAllowed) {
          if (!activeFeatureMap.has(mId)) {
            activeFeatureMap.set(mId, { features: [], codes: [], routes: [] });
          }
          activeFeatureMap.get(mId)!.features.push(feat);
          if (feat.code) activeFeatureMap.get(mId)!.codes.push(feat.code);
          if (feat.routePath) {
            const clean = feat.routePath.replace(new RegExp(`^/dashboard/[^/]+/?`, 'i'), '');
            if (clean) activeFeatureMap.get(mId)!.routes.push(clean);
          }
        }
      }

      if (activeFeatureMap.size > 0) {
        const modules = await this.moduleModel.findAll({
          where: { id: Array.from(activeFeatureMap.keys()), isActive: true },
          order: [['displayOrder', 'ASC'], ['id', 'ASC']],
        });

        const seenKeys = new Set<string>();
        for (const mod of modules) {
          const key = getModuleKey(mod);
          if (seenKeys.has(key)) continue;
          seenKeys.add(key);

          const fData = activeFeatureMap.get(Number(mod.id)) || { features: [], codes: [], routes: [] };
          const allowedRoutes = fData.routes.length > 0 ? fData.routes : fData.codes.map((f) => f.toLowerCase().replace(/_/g, '-'));
          const menuTree = await this.resolveModuleMenuTree(
            Number(mod.id),
            key,
            roleSlug,
            fData.features,
            allowedRoutes,
          );
          accessibleModules.push({
            id: mod.id,
            key,
            name: mod.name,
            code: mod.code || key.toUpperCase(),
            route: `/dashboard/${key}`,
            features: fData.codes,
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
      allAllowedPaths.push(`/dashboard/${m.key}/*`);
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
