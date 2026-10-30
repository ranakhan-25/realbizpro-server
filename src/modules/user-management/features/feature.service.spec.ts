import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { FeaturesService } from './feature.service';
import { SysFeatures } from '../../../database/models/system/sys_features.model';
import { SysPermission } from '../../../database/models/system/sys_permission.model';
import { SysModules } from '../../../database/models/system/sys_module.model';
import { SysOrgEntitlement } from '../../../database/models/system/sys_org_entitlement.model';
import { SysOrganization } from '../../../database/models/system/sys_organization.model';
import { SysPlan } from '../../../database/models/system/sys_plan.model';
import { UsersService } from '../users/users.service';

describe('FeaturesService', () => {
  let service: FeaturesService;
  const mockFeatureModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    count: jest.fn(),
    destroy: jest.fn(),
  };
  const mockModuleModel = { findByPk: jest.fn() };
  const mockPermissionModel = {};
  const mockEntitlementModel = { findAll: jest.fn() };
  const mockOrgModel = { findByPk: jest.fn() };
  const mockPlanModel = {};
  const mockUsersService = {} as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeaturesService,
        UsersService,
        { provide: getModelToken(SysFeatures), useValue: mockFeatureModel },
        { provide: getModelToken(SysModules), useValue: mockModuleModel },
        { provide: getModelToken(SysPermission), useValue: mockPermissionModel },
        { provide: getModelToken(SysOrgEntitlement), useValue: mockEntitlementModel },
        { provide: getModelToken(SysOrganization), useValue: mockOrgModel },
        { provide: getModelToken(SysPlan), useValue: mockPlanModel },
      ],
    }).compile();
    service = module.get<FeaturesService>(FeaturesService);
    jest.clearAllMocks();
  });

  it('should create a feature with default actions when none provided', async () => {
    mockFeatureModel.findOne.mockResolvedValue(null);
    mockModuleModel.findByPk.mockResolvedValue({});
    mockFeatureModel.create.mockImplementation((dto) => Promise.resolve({ ...dto }));
    const dto = { name: 'Test Feature', moduleId: 1 } as any;
    const result = await service.create(dto);
    expect(result.actions).toEqual(['read', 'write', 'update', 'delete']);
    expect(mockFeatureModel.create).toHaveBeenCalledWith({ ...dto, actions: ['read', 'write', 'update', 'delete'] });
  });

  it('should create a feature with custom actions', async () => {
    mockFeatureModel.findOne.mockResolvedValue(null);
    mockModuleModel.findByPk.mockResolvedValue({});
    mockFeatureModel.create.mockImplementation((dto) => Promise.resolve({ ...dto }));
    const dto = { name: 'Custom', moduleId: 1, actions: ['read', 'write'] } as any;
    const result = await service.create(dto);
    expect(result.actions).toEqual(['read', 'write']);
  });

  it('should map actions in tree response', async () => {
    const feature = {
      id: 1,
      name: 'F',
      code: null,
      routePath: null,
      displayOrder: 0,
      actionType: 'read', // legacy field should be ignored
      actions: ['read', 'write'],
      description: null,
      permissions: [],
      module: null,
    } as any;
    mockFeatureModel.findAll.mockResolvedValue([feature]);
    const tree = await service.findAllTreeWithPermissions();
    expect(tree[0].actions).toEqual(['read', 'write']);
  });
});
