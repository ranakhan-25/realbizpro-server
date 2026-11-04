import {
  structureDelimitedMenuNodes,
  convertAdminMenuToMenuNode,
  buildDynamicMenuTree,
  getModuleKey,
} from './user-access.service';
import type { MenuNode } from './module-menus';
import { AdminMenuItemDto } from '../admin-menu/dto/admin-menu.dto';

describe('UserAccessService menu structuring and tree conversion', () => {
  describe('structureDelimitedMenuNodes', () => {
    it('returns empty array when given empty nodes', () => {
      const result = structureDelimitedMenuNodes([]);
      expect(result).toEqual([]);
    });

    it('leaves flat items without delimiters unchanged', () => {
      const nodes: MenuNode[] = [
        { label: 'Overview', slug: 'overview', path: 'overview' },
        { label: 'Settings', slug: 'settings', path: 'settings' },
      ];
      const result = structureDelimitedMenuNodes(nodes);
      expect(result).toHaveLength(2);
      expect(result[0].label).toBe('Overview');
      expect(result[1].label).toBe('Settings');
    });

    it('groups delimited items by parent title into collapsible folder nodes', () => {
      const nodes: MenuNode[] = [
        {
          label: 'Fleet & Transport | Vehicle Registry',
          slug: 'vehicles',
          path: 'fleet/vehicles',
        },
        {
          label: 'Fleet & Transport | Live GPS Tracking',
          slug: 'live-tracking',
          path: 'fleet/live-tracking',
        },
        {
          label: 'Warehouse & Storage | Central Hub Bins',
          slug: 'central-hub',
          path: 'warehouse/central-hub',
        },
      ];

      const result = structureDelimitedMenuNodes(nodes);

      expect(result).toHaveLength(2);

      // First group
      const fleetGroup = result.find((n) => n.label === 'Fleet & Transport');
      expect(fleetGroup).toBeDefined();
      expect(fleetGroup?.children).toHaveLength(2);
      expect(fleetGroup?.children?.[0].label).toBe('Vehicle Registry');
      expect(fleetGroup?.children?.[0].path).toBe('fleet/vehicles');
      expect(fleetGroup?.children?.[1].label).toBe('Live GPS Tracking');

      // Second group
      const whGroup = result.find((n) => n.label === 'Warehouse & Storage');
      expect(whGroup).toBeDefined();
      expect(whGroup?.children).toHaveLength(1);
      expect(whGroup?.children?.[0].label).toBe('Central Hub Bins');
      expect(whGroup?.children?.[0].path).toBe('warehouse/central-hub');
    });

    it('supports alternative delimiters like > and ::', () => {
      const nodes: MenuNode[] = [
        {
          label: 'Logistics > Inbound Cargo',
          slug: 'inbound',
          path: 'logistics/inbound',
        },
        {
          label: 'Finance :: Tax Vouchers',
          slug: 'tax',
          path: 'finance/tax',
        },
      ];

      const result = structureDelimitedMenuNodes(nodes);
      expect(result).toHaveLength(2);
      expect(result[0].label).toBe('Logistics');
      expect(result[0].children?.[0].label).toBe('Inbound Cargo');
      expect(result[1].label).toBe('Finance');
      expect(result[1].children?.[0].label).toBe('Tax Vouchers');
    });

    it('preserves existing parent nodes that already contain children', () => {
      const existingParent: MenuNode = {
        label: 'Existing Parent',
        slug: 'existing',
        path: 'existing',
        children: [
          {
            label: 'Delimited Child | Sub Child',
            slug: 'sub',
            path: 'existing/sub',
          },
        ],
      };

      const result = structureDelimitedMenuNodes([existingParent]);
      expect(result).toHaveLength(1);
      expect(result[0].label).toBe('Existing Parent');
      expect(result[0].children).toHaveLength(1);
      expect(result[0].children?.[0].label).toBe('Delimited Child');
      expect(result[0].children?.[0].children?.[0].label).toBe('Sub Child');
    });
  });

  describe('convertAdminMenuToMenuNode', () => {
    it('strips /dashboard/moduleKey prefix from URL', () => {
      const item: AdminMenuItemDto = {
        id: 101,
        title: 'Vehicle Registry',
        url: '/dashboard/supply-chain/fleet/vehicles',
        target: '_self',
        icon: 'Truck',
        order: 1,
        parentId: 99,
        moduleId: 35,
        isVisible: true,
        role: 'all',
      };

      const node = convertAdminMenuToMenuNode(item, 'supply-chain');
      expect(node.label).toBe('Vehicle Registry');
      expect(node.path).toBe('fleet/vehicles');
      expect(node.slug).toBe('vehicles');
    });
  });

  describe('buildDynamicMenuTree', () => {
    it('creates nested hierarchy from delimited features', () => {
      const features = [
        {
          name: 'Fleet & Transport | Vehicle Registry',
          code: 'FLEET_VEHICLES',
          routePath: '/dashboard/supply-chain/fleet/vehicles',
          isActive: true,
        },
        {
          name: 'Fleet & Transport | Live GPS Tracking',
          code: 'FLEET_GPS',
          routePath: '/dashboard/supply-chain/fleet/live-tracking',
          isActive: true,
        },
      ];

      const tree = buildDynamicMenuTree(features, 'supply-chain');
      expect(tree).toHaveLength(1);
      expect(tree[0].label).toBe('Fleet & Transport');
      expect(tree[0].children).toHaveLength(2);
      expect(tree[0].children?.[0].label).toBe('Vehicle Registry');
      expect(tree[0].children?.[1].label).toBe('Live GPS Tracking');
    });
  });

  describe('getModuleKey', () => {
    it('returns canonical key for core modules', () => {
      expect(getModuleKey({ id: 10 })).toBe('project');
      expect(getModuleKey({ id: 11 })).toBe('inventory');
      expect(getModuleKey({ id: 12 })).toBe('accounts');
    });

    it('slugifies pathRoute or code for custom modules', () => {
      expect(
        getModuleKey({
          id: 35,
          pathRoute: '/dashboard/supply-chain',
          name: 'Supply Chain & Logistics',
        }),
      ).toBe('supply-chain');
    });
  });
});
