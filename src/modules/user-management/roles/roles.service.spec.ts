import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { RolesService } from './roles.service';
import { SysRole } from '../../../database/models/system/sys_role.model';
import { SysRolePermission } from '../../../database/models/system/sys_role_permission.model';
import { SysPermission } from '../../../database/models/system/sys_permission.model';
import { SysUserPermission } from '../../../database/models/system/sys_user_permission.model';
import { SysUserRole } from '../../../database/models/system/sys_user_role.model';
import { Op } from 'sequelize';

describe('RolesService Tenant Isolation Unit Tests', () => {
  let service: RolesService;
  let mockRoleModel: any;
  let mockRolePermissionModel: any;
  let mockPermissionModel: any;
  let mockUserPermissionModel: any;
  let mockUserRoleModel: any;

  beforeEach(async () => {
    mockRoleModel = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      count: jest.fn(),
    };

    mockRolePermissionModel = {
      findAll: jest.fn(),
      bulkCreate: jest.fn(),
      destroy: jest.fn(),
    };

    mockPermissionModel = {
      findAll: jest.fn(),
    };

    mockUserPermissionModel = {
      findAll: jest.fn(),
    };

    mockUserRoleModel = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getModelToken(SysRole),
          useValue: mockRoleModel,
        },
        {
          provide: getModelToken(SysRolePermission),
          useValue: mockRolePermissionModel,
        },
        {
          provide: getModelToken(SysPermission),
          useValue: mockPermissionModel,
        },
        {
          provide: getModelToken(SysUserPermission),
          useValue: mockUserPermissionModel,
        },
        {
          provide: getModelToken(SysUserRole),
          useValue: mockUserRoleModel,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  describe('findAll tenant scoping', () => {
    it('scopes super admin default query to system roles only', async () => {
      const superAdminUser = { id: 1, isSuperUser: true, orgId: null };
      mockRoleModel.findAll.mockResolvedValue([]);

      await service.findAll(superAdminUser);

      expect(mockRoleModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            [Op.and]: [
              {
                [Op.or]: [{ orgId: null }, { isSystemRole: true }],
              },
            ],
          },
        }),
      );
    });

    it('scopes super admin targetOrgId query to specific org', async () => {
      const superAdminUser = { id: 1, isSuperUser: true, orgId: null };
      mockRoleModel.findAll.mockResolvedValue([]);

      await service.findAll(superAdminUser, 42);

      expect(mockRoleModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            [Op.and]: [{ orgId: 42 }],
          },
        }),
      );
    });

    it('strictly isolates tenant org admin to their own orgId and excludes super admin', async () => {
      const orgAdminUser = { id: 2, isSuperUser: false, orgId: 99 };
      mockRoleModel.findAll.mockResolvedValue([]);

      await service.findAll(orgAdminUser);

      expect(mockRoleModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            [Op.and]: [
              { slug: { [Op.ne]: 'super-admin' } },
              { orgId: 99 },
            ],
          },
        }),
      );
    });

    it('returns empty condition for user without orgId', async () => {
      const orphanedUser = { id: 3, isSuperUser: false, orgId: null };
      mockRoleModel.findAll.mockResolvedValue([]);

      await service.findAll(orphanedUser);

      expect(mockRoleModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            [Op.and]: [
              { slug: { [Op.ne]: 'super-admin' } },
              { id: -1 },
            ],
          },
        }),
      );
    });
  });

  describe('create role tenant scoping', () => {
    it('assigns isSystemRole true and orgId null when super admin creates role', async () => {
      const superAdminUser = { id: 1, isSuperUser: true };
      mockRoleModel.findOne.mockResolvedValue(null);
      mockRoleModel.create.mockResolvedValue({ id: 10, name: 'System Auditor' });

      await service.create(
        { name: 'System Auditor', description: 'Audits everything' },
        superAdminUser,
      );

      expect(mockRoleModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'System Auditor',
          isSystemRole: true,
          orgId: null,
          roleLevel: 1,
        }),
      );
    });

    it('assigns orgId and isSystemRole false when org admin creates role', async () => {
      const orgAdminUser = { id: 2, isSuperUser: false, orgId: 55, orgUuid: 'org-uuid-55' };
      mockRoleModel.findOne.mockResolvedValue(null);
      mockRoleModel.create.mockResolvedValue({ id: 11, name: 'Project Manager' });

      await service.create(
        { name: 'Project Manager', description: 'Manages projects' },
        orgAdminUser,
      );

      expect(mockRoleModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Project Manager',
          isSystemRole: false,
          orgId: 55,
          orgUuid: 'org-uuid-55',
          roleLevel: 4,
        }),
      );
    });
  });
});
