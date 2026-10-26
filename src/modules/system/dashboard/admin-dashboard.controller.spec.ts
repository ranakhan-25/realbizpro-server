import { Test, TestingModule } from '@nestjs/testing';
import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminDashboardService, DashboardStatsResponse } from './admin-dashboard.service';

describe('AdminDashboardController', () => {
  let controller: AdminDashboardController;
  let dashboardService: Partial<Record<keyof AdminDashboardService, jest.Mock>>;

  const mockSuperAdminStats: DashboardStatsResponse = {
    role: 'super-admin',
    overview: {
      title: 'Platform Administration',
      subtitle: 'Global metrics across all tenants',
      metrics: [
        { title: 'Total Organizations', value: 10 },
        { title: 'Total Platform Users', value: 17 },
      ],
    },
    charts: {
      activityTrend: [{ day: 'Mon', value: 65 }],
      roleDistribution: [{ name: 'Super Admin', value: 2 }],
      userStatusBreakdown: [{ label: 'Active', count: 17, color: '#0000F2' }],
    },
    recentActivities: [],
  };

  const mockOrgAdminStats: DashboardStatsResponse = {
    role: 'org-admin',
    overview: {
      title: 'Apex Workspace',
      subtitle: 'Tenant operations',
      metrics: [
        { title: 'Company Users', value: 3 },
        { title: 'Active Members', value: 3 },
      ],
    },
    charts: {
      activityTrend: [{ day: 'Mon', value: 10 }],
      roleDistribution: [{ name: 'Org Admin', value: 1 }],
      userStatusBreakdown: [{ label: 'Active', count: 3, color: '#0000F2' }],
    },
    recentActivities: [],
    organization: {
      id: 14,
      name: 'Apex Holdings',
      code: 'APEX',
      websitePublished: true,
    },
  };

  beforeEach(async () => {
    dashboardService = {
      getDashboardStats: jest.fn().mockImplementation((user) => {
        if (user.isSuperUser) {
          return Promise.resolve(mockSuperAdminStats);
        }
        return Promise.resolve(mockOrgAdminStats);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminDashboardController],
      providers: [
        {
          provide: AdminDashboardService,
          useValue: dashboardService,
        },
      ],
    }).compile();

    controller = module.get<AdminDashboardController>(AdminDashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns platform wide stats when caller is Super Administrator', async () => {
    const mockReq = {
      user: {
        id: 1,
        isSuperUser: true,
      },
    };

    const result = await controller.getDashboardStats(mockReq);

    expect(dashboardService.getDashboardStats).toHaveBeenCalledWith(mockReq.user);
    expect(result.role).toBe('super-admin');
    expect(result.overview.title).toBe('Platform Administration');
    expect(result.organization).toBeUndefined();
  });

  it('returns scoped company stats when caller is Organization Administrator', async () => {
    const mockReq = {
      user: {
        id: 20,
        isSuperUser: false,
        isOrgAdmin: true,
        orgId: 14,
      },
    };

    const result = await controller.getDashboardStats(mockReq);

    expect(dashboardService.getDashboardStats).toHaveBeenCalledWith(mockReq.user);
    expect(result.role).toBe('org-admin');
    expect(result.overview.title).toBe('Apex Workspace');
    expect(result.organization?.id).toBe(14);
    expect(result.organization?.websitePublished).toBe(true);
  });
});
