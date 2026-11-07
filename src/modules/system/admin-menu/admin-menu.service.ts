import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { SysMenu, SysMenuLocation } from '../../../database/models/system/sys_menu.model';
import { SysModules } from '../../../database/models/system/sys_module.model';
import { SysFeatures } from '../../../database/models/system/sys_features.model';

export interface AdminMenuItemDto {
  id?: number;
  uuid?: string;
  title: string;
  url: string;
  target?: string;
  icon?: string;
  order?: number;
  parentId?: number | null;
  moduleId?: number | null;
  isVisible?: boolean;
  role?: 'super-admin' | 'org-admin' | 'all';
  children?: AdminMenuItemDto[];
}

export interface ReorderAdminMenuItemDto {
  id: number;
  parentId?: number | null;
  order: number;
}

const DEFAULT_SUPER_ADMIN_MENUS: AdminMenuItemDto[] = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: 'LayoutDashboard',
    order: 1,
    role: 'all',
  },
  {
    title: 'System Management',
    url: '',
    icon: 'Boxes',
    order: 2,
    role: 'super-admin',
    children: [
      { title: 'Organization', url: '/admin/orgs', icon: 'Building2', order: 1, role: 'super-admin' },
      { title: 'Plans & Subscriptions', url: '/admin/plans', icon: 'CreditCard', order: 2, role: 'super-admin' },
      { title: 'Menu Management', url: '/admin/menus', icon: 'Menu', order: 3, role: 'super-admin' },
      { title: 'Web Management', url: '/admin/web-settings', icon: 'Settings', order: 4, role: 'all' },
      { title: 'User Organization', url: '/admin/organization', icon: 'User', order: 5, role: 'all' },
      { title: 'Permissions', url: '/admin/permissions', icon: 'KeyRound', order: 6, role: 'super-admin' },
      { title: 'Features', url: '/admin/features', icon: 'FileCog', order: 7, role: 'super-admin' },
      { title: 'Modules', url: '/admin/modules', icon: 'Boxes', order: 8, role: 'super-admin' },
    ],
  },
  {
    title: 'Authentication & Access',
    url: '',
    icon: 'ShieldCheck',
    order: 3,
    role: 'all',
    children: [
      { title: 'Users', url: '/admin/users', icon: 'Users', order: 1, role: 'all' },
      { title: 'Roles', url: '/admin/roles', icon: 'ShieldCheck', order: 2, role: 'all' },
    ],
  },
  {
    title: 'Reports & Logs',
    url: '',
    icon: 'History',
    order: 4,
    role: 'super-admin',
    children: [
      { title: 'Audit Logs', url: '/admin/audit', icon: 'History', order: 1, role: 'super-admin' },
      { title: 'Usage & Limits', url: '/admin/usage', icon: 'Gauge', order: 2, role: 'super-admin' },
    ],
  },
  {
    title: 'System Settings',
    url: '',
    icon: 'Settings2',
    order: 5,
    role: 'super-admin',
    children: [
      { title: 'Agreements', url: '/admin/agreements', icon: 'FileText', order: 1, role: 'super-admin' },
      { title: 'System Config', url: '/admin/config', icon: 'Settings2', order: 2, role: 'super-admin' },
    ],
  },
];

@Injectable()
export class AdminMenuService {
  private hasCheckedSeed = false;
  private readonly menuCache = new Map<string, { data: AdminMenuItemDto[]; expiresAt: number }>();

  constructor(
    @InjectModel(SysMenu)
    private readonly menuModel: typeof SysMenu,
    @InjectModel(SysModules)
    private readonly moduleModel: typeof SysModules,
    @InjectModel(SysFeatures)
    private readonly featureModel: typeof SysFeatures,
  ) {}

  private async seedDefaultAdminMenus(): Promise<void> {
    if (this.hasCheckedSeed) return;
    this.hasCheckedSeed = true;

    const existing = await this.menuModel.count();
    if (existing > 0) return;

    for (const group of DEFAULT_SUPER_ADMIN_MENUS) {
      const parent = await this.menuModel.create({
        title: group.title,
        url: group.url || null,
        target: '_self',
        location: [SysMenuLocation.SIDEBAR],
        icon: group.icon || 'LayoutDashboard',
        order: group.order || 1,
        elementClass: group.role || 'all',
        isVisible: true,
      } as any);

      if (group.children && group.children.length > 0) {
        for (const child of group.children) {
          await this.menuModel.create({
            title: child.title,
            url: child.url,
            target: '_self',
            location: [SysMenuLocation.SIDEBAR],
            icon: child.icon || 'FileText',
            order: child.order || 1,
            parentId: parent.id,
            elementClass: child.role || 'all',
            isVisible: true,
          } as any);
        }
      }
    }
  }

  async getMenuTree(role?: string, moduleId?: string): Promise<AdminMenuItemDto[]> {
    const normalizedRole = (role || 'super-admin').toLowerCase();
    const cacheKey = `${normalizedRole}:${moduleId || 'admin'}`;

    // Check high-speed cache (TTL: 5 minutes)
    const cached = this.menuCache.get(cacheKey);
    if (cached) {
      if (Date.now() < cached.expiresAt) {
        return cached.data;
      }
      this.menuCache.delete(cacheKey);
    }

    await this.seedDefaultAdminMenus();

    const whereClause: any = {
      isVisible: true,
    };

    if (moduleId === 'admin' || !moduleId) {
      // Admin dashboard menus (null moduleId or /admin/... URLs)
      whereClause[Op.or] = [
        { moduleId: null },
        { url: { [Op.like]: '/admin/%' } },
      ];
    } else if (moduleId === 'all') {
      // Explicitly return all menus
    } else {
      // Scope to specific module
      whereClause.moduleId = Number(moduleId);
    }

    const allMenus = await this.menuModel.findAll({
      where: whereClause,
      order: [
        ['order', 'ASC'],
        ['id', 'ASC'],
      ],
    });

    // Filter by role if specified
    const filtered = allMenus.filter((m) => {
      const targetRole = (m.elementClass || 'all').toLowerCase();
      if (normalizedRole === 'super-admin') return true;
      return targetRole === 'all' || targetRole === normalizedRole;
    });

    // Build hierarchy
    const itemMap = new Map<number, AdminMenuItemDto>();
    const roots: AdminMenuItemDto[] = [];

    for (const m of filtered) {
      itemMap.set(Number(m.id), {
        id: Number(m.id),
        uuid: m.uuid,
        title: m.title,
        url: m.url || '',
        target: m.target || '_self',
        icon: m.icon || 'LayoutDashboard',
        order: m.order || 1,
        parentId: m.parentId ? Number(m.parentId) : null,
        moduleId: m.moduleId ? Number(m.moduleId) : null,
        isVisible: m.isVisible,
        role: (m.elementClass as any) || 'all',
        children: [],
      });
    }

    for (const m of filtered) {
      const node = itemMap.get(Number(m.id));
      if (!node) continue;

      if (m.parentId && itemMap.has(Number(m.parentId))) {
        itemMap.get(Number(m.parentId))!.children!.push(node);
      } else {
        roots.push(node);
      }
    }

    // Cache tree for 5 minutes
    this.menuCache.set(cacheKey, {
      data: roots,
      expiresAt: Date.now() + 300000,
    });

    return roots;
  }

  async createMenuItem(dto: AdminMenuItemDto): Promise<AdminMenuItemDto> {
    this.menuCache.clear();
    const created = await this.menuModel.create({
      title: dto.title,
      url: dto.url || null,
      target: dto.target || '_self',
      location: [SysMenuLocation.SIDEBAR],
      icon: dto.icon || 'LayoutDashboard',
      order: dto.order ?? 99,
      parentId: dto.parentId || null,
      moduleId: dto.moduleId !== undefined && dto.moduleId !== null ? Number(dto.moduleId) : null,
      elementClass: dto.role || 'all',
      isVisible: dto.isVisible ?? true,
    } as any);

    return {
      id: Number(created.id),
      uuid: created.uuid,
      title: created.title,
      url: created.url || '',
      target: created.target || '_self',
      icon: created.icon || 'LayoutDashboard',
      order: created.order,
      parentId: created.parentId ? Number(created.parentId) : null,
      moduleId: created.moduleId ? Number(created.moduleId) : null,
      isVisible: created.isVisible,
      role: (created.elementClass as any) || 'all',
      children: [],
    };
  }

  async updateMenuItem(id: number, dto: Partial<AdminMenuItemDto>): Promise<AdminMenuItemDto> {
    this.menuCache.clear();
    const item = await this.menuModel.findByPk(id);
    if (!item) throw new NotFoundException('Menu item not found');

    const updatePayload: any = {};
    if (dto.title !== undefined) updatePayload.title = dto.title;
    if (dto.url !== undefined) updatePayload.url = dto.url || null;
    if (dto.target !== undefined) updatePayload.target = dto.target;
    if (dto.icon !== undefined) updatePayload.icon = dto.icon;
    if (dto.order !== undefined) updatePayload.order = dto.order;
    if (dto.parentId !== undefined) updatePayload.parentId = dto.parentId || null;
    if (dto.moduleId !== undefined) {
      updatePayload.moduleId = dto.moduleId !== null ? Number(dto.moduleId) : null;
    }
    if (dto.isVisible !== undefined) updatePayload.isVisible = dto.isVisible;
    if (dto.role !== undefined) updatePayload.elementClass = dto.role;

    await item.update(updatePayload);

    return {
      id: Number(item.id),
      uuid: item.uuid,
      title: item.title,
      url: item.url || '',
      target: item.target || '_self',
      icon: item.icon || 'LayoutDashboard',
      order: item.order,
      parentId: item.parentId ? Number(item.parentId) : null,
      moduleId: item.moduleId ? Number(item.moduleId) : null,
      isVisible: item.isVisible,
      role: (item.elementClass as any) || 'all',
    };
  }

  async reorderTree(reorderList: ReorderAdminMenuItemDto[]): Promise<{ success: boolean; count: number }> {
    this.menuCache.clear();
    if (!reorderList || reorderList.length === 0) {
      return { success: true, count: 0 };
    }

    if (reorderList.length <= 2) {
      for (const item of reorderList) {
        await this.menuModel.update(
          {
            order: item.order,
            parentId: item.parentId || null,
          },
          {
            where: { id: item.id },
          },
        );
      }
      return { success: true, count: reorderList.length };
    }

    const placeholders: string[] = [];
    const replacements: Record<string, any> = {};
    reorderList.forEach((item, idx) => {
      placeholders.push(`(:id_${idx}::bigint, :order_${idx}::int, :parentId_${idx}::bigint)`);
      replacements[`id_${idx}`] = item.id;
      replacements[`order_${idx}`] = item.order ?? 0;
      replacements[`parentId_${idx}`] = item.parentId ? Number(item.parentId) : null;
    });

    const sql = `
      UPDATE sys_menus AS m
      SET
        "order" = v.order,
        parent_id = v.parent_id,
        updated_at = NOW()
      FROM (VALUES ${placeholders.join(', ')}) AS v(id, "order", parent_id)
      WHERE m.id = v.id
    `;

    await this.menuModel.sequelize!.query(sql, { replacements });
    return { success: true, count: reorderList.length };
  }

  async deleteMenuItem(id: number): Promise<{ success: boolean; message: string }> {
    this.menuCache.clear();
    const item = await this.menuModel.findByPk(id);
    if (!item) throw new NotFoundException('Menu item not found');

    // Move any children to root level before deleting
    await this.menuModel.update(
      { parentId: null },
      { where: { parentId: id } },
    );

    await item.destroy();
    return { success: true, message: 'Menu item deleted successfully' };
  }

  async syncFromModules(targetModuleId?: string | number): Promise<{
    success: boolean;
    syncedModules: number;
    createdCount: number;
    updatedCount: number;
    message: string;
  }> {
    this.menuCache.clear();

    const moduleWhere: any = {};
    if (targetModuleId && targetModuleId !== 'admin' && targetModuleId !== 'all') {
      moduleWhere.id = Number(targetModuleId);
    }

    const modules = await this.moduleModel.findAll({
      where: moduleWhere,
      include: [
        {
          model: this.featureModel,
          as: 'features',
          required: false,
        },
      ],
      order: [['id', 'ASC']],
    });

    const moduleIds = modules.map((m) => m.id);
    if (moduleIds.length === 0) {
      return {
        success: true,
        syncedModules: 0,
        createdCount: 0,
        updatedCount: 0,
        message: 'No modules found to synchronize.',
      };
    }

    // 1. Fetch all existing menus for these modules in 1 fast query
    const existingMenus = await this.menuModel.findAll({
      where: {
        moduleId: moduleIds,
      },
    });

    // 2. Build fast in-memory lookup indexes
    const urlMap = new Map<string, SysMenu>();
    const titleMap = new Map<string, SysMenu>();

    for (const menu of existingMenus) {
      if (menu.url) {
        urlMap.set(`${menu.moduleId}:${menu.url.trim().toLowerCase()}`, menu);
      }
      if (menu.title) {
        titleMap.set(`${menu.moduleId}:${menu.title.trim().toLowerCase()}`, menu);
      }
    }

    const toCreate: any[] = [];
    const menusToUpdate: SysMenu[] = [];

    for (const mod of modules) {
      const features = (mod as any).features || [];
      for (const feat of features) {
        if (!feat.routePath || !feat.routePath.trim()) continue;
        const trimmedUrl = feat.routePath.trim();
        const trimmedTitle = (feat.name || '').trim();

        const existing =
          urlMap.get(`${mod.id}:${trimmedUrl.toLowerCase()}`) ||
          titleMap.get(`${mod.id}:${trimmedTitle.toLowerCase()}`);

        if (existing) {
          let needsUpdate = false;
          if (existing.title !== feat.name) {
            existing.title = feat.name;
            needsUpdate = true;
          }
          if (existing.url !== trimmedUrl) {
            existing.url = trimmedUrl;
            needsUpdate = true;
          }
          if (existing.isVisible !== (feat.isActive ?? true)) {
            existing.isVisible = feat.isActive ?? true;
            needsUpdate = true;
          }
          if (needsUpdate) {
            menusToUpdate.push(existing);
          }
        } else {
          toCreate.push({
            moduleId: mod.id,
            title: feat.name,
            url: trimmedUrl,
            target: '_self',
            location: [SysMenuLocation.SIDEBAR],
            icon: mod.icon || 'LayoutDashboard',
            order: feat.displayOrder || 1,
            isVisible: feat.isActive ?? true,
            elementClass: 'all',
          });
          // Track in map so duplicate features within same sync don't create multiple menus
          titleMap.set(`${mod.id}:${trimmedTitle.toLowerCase()}`, {} as any);
          urlMap.set(`${mod.id}:${trimmedUrl.toLowerCase()}`, {} as any);
        }
      }
    }

    if (toCreate.length > 0) {
      await this.menuModel.bulkCreate(toCreate);
    }

    if (menusToUpdate.length > 0) {
      if (menusToUpdate.length <= 2) {
        for (const item of menusToUpdate) {
          await item.save();
        }
      } else {
        const placeholders: string[] = [];
        const replacements: Record<string, any> = {};
        menusToUpdate.forEach((menu, idx) => {
          placeholders.push(
            `(:id_${idx}::bigint, :title_${idx}::varchar, :url_${idx}::varchar, :isVisible_${idx}::boolean)`,
          );
          replacements[`id_${idx}`] = menu.id;
          replacements[`title_${idx}`] = menu.title;
          replacements[`url_${idx}`] = menu.url || null;
          replacements[`isVisible_${idx}`] = menu.isVisible ?? true;
        });

        const sql = `
          UPDATE sys_menus AS m
          SET
            title = v.title,
            url = v.url,
            is_visible = v.is_visible,
            updated_at = NOW()
          FROM (VALUES ${placeholders.join(', ')}) AS v(id, title, url, is_visible)
          WHERE m.id = v.id
        `;
        await this.menuModel.sequelize!.query(sql, { replacements });
      }
    }

    const updatedCount = menusToUpdate.length;

    return {
      success: true,
      syncedModules: modules.length,
      createdCount: toCreate.length,
      updatedCount,
      message: `Successfully synchronized ${modules.length} module(s): ${toCreate.length} created, ${updatedCount} updated.`,
    };
  }
}
