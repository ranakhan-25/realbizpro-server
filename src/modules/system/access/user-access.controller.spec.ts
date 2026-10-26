import { Test, TestingModule } from '@nestjs/testing';
import { UserAccessController } from './user-access.controller';
import { UserAccessService, UserAccessResponse } from './user-access.service';

describe('UserAccessController', () => {
  let controller: UserAccessController;
  let accessService: Partial<Record<keyof UserAccessService, jest.Mock>>;

  const mockResponse: UserAccessResponse = {
    user: {
      id: 20,
      uuid: 'test-uuid-20',
      name: 'Test Org Admin',
      email: 'admin@apex.com',
      username: 'apex_admin',
      orgId: 14,
      orgName: 'Apex Enterprise',
      isSuperUser: false,
      isOrgAdmin: true,
      role: 'org-admin',
      roleLevel: 2,
    },
    accessibleModules: [
      {
        id: 1,
        key: 'crm',
        name: 'CRM & Sales',
        code: 'CRM',
        route: '/dashboard/crm',
        features: ['CRM_LEADS'],
        allowedRoutes: ['*'],
      },
      {
        id: 2,
        key: 'project',
        name: 'Project Management',
        code: 'PROJECTS',
        route: '/dashboard/project',
        features: ['PRJ_MASTER'],
        allowedRoutes: ['*'],
      },
    ],
    entitledModuleKeys: ['crm', 'project'],
    allAllowedPaths: [
      '/dashboard/crm',
      '/dashboard/crm/dashboard',
      '/dashboard/project',
      '/dashboard/project/dashboard',
    ],
  };

  beforeEach(async () => {
    accessService = {
      getUserAccess: jest.fn().mockResolvedValue(mockResponse),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAccessController],
      providers: [
        {
          provide: UserAccessService,
          useValue: accessService,
        },
      ],
    }).compile();

    controller = module.get<UserAccessController>(UserAccessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates req.user to UserAccessService and returns computed access profile', async () => {
    const mockReq = {
      user: {
        id: 20,
        email: 'admin@apex.com',
        orgId: 14,
      },
    };

    const result = await controller.getUserAccess(mockReq);

    expect(accessService.getUserAccess).toHaveBeenCalledWith(mockReq.user);
    expect(result).toEqual(mockResponse);
    expect(result.entitledModuleKeys).toContain('project');
    expect(result.entitledModuleKeys).not.toContain('accounts');
  });
});
