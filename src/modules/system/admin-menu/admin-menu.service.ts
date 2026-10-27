import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { SysMenu, SysMenuLocation } from '../../../database/models/system/sys_menu.model';

export interface AdminMenuItemDto {
  id?: number;
  uuid?: string;
  title: string;
  url: string;
  target?: string;
  icon?: string;
  order?: number;
  parentId?: number | null;
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
      { title: 'Permissions', url: '/admin/permissions', icon: 'KeyRound', order: 3, role: 'super-admin' },
      { title: 'Features', url: '/admin/features', icon: 'FileCog', order: 4, role: 'super-admin' },
      { title: 'Modules', url: '/admin/modules', icon: 'Boxes', order: 5, role: 'super-admin' },
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
  constructor(
    @InjectModel(SysMenu)
    private readonly menuModel: typeof SysMenu,
  ) {}

  private async seedDefaultAdminMenus(): Promise<void> {
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

  async getMenuTree(role?: string): Promise<AdminMenuItemDto[]> {
    await this.seedDefaultAdminMenus();

    const normalizedRole = (role || 'super-admin').toLowerCase();

    const allMenus = await this.menuModel.findAll({
      where: {
        isVisible: true,
      },
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

    return roots;
  }

  async createMenuItem(dto: AdminMenuItemDto): Promise<AdminMenuItemDto> {
    const created = await this.menuModel.create({
      title: dto.title,
      url: dto.url || null,
      target: dto.target || '_self',
      location: [SysMenuLocation.SIDEBAR],
      icon: dto.icon || 'LayoutDashboard',
      order: dto.order ?? 99,
      parentId: dto.parentId || null,
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
      isVisible: created.isVisible,
      role: (created.elementClass as any) || 'all',
      children: [],
    };
  }

  async updateMenuItem(id: number, dto: Partial<AdminMenuItemDto>): Promise<AdminMenuItemDto> {
    const item = await this.menuModel.findByPk(id);
    if (!item) throw new NotFoundException('Menu item not found');

    const updatePayload: any = {};
    if (dto.title !== undefined) updatePayload.title = dto.title;
    if (dto.url !== undefined) updatePayload.url = dto.url || null;
    if (dto.target !== undefined) updatePayload.target = dto.target;
    if (dto.icon !== undefined) updatePayload.icon = dto.icon;
    if (dto.order !== undefined) updatePayload.order = dto.order;
    if (dto.parentId !== undefined) updatePayload.parentId = dto.parentId || null;
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
      isVisible: item.isVisible,
      role: (item.elementClass as any) || 'all',
    };
  }

  async reorderTree(reorderList: ReorderAdminMenuItemDto[]): Promise<{ success: boolean; count: number }> {
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

  async deleteMenuItem(id: number): Promise<{ success: boolean; message: string }> {
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
}
