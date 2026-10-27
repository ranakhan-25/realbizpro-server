import { Test, TestingModule } from '@nestjs/testing';
import { AdminMenuController } from './admin-menu.controller';
import { AdminMenuService } from './admin-menu.service';

describe('AdminMenuController', () => {
  let controller: AdminMenuController;
  let service: jest.Mocked<Partial<AdminMenuService>>;

  const mockMenuTree = [
    {
      id: 1,
      uuid: 'uuid-1',
      title: 'Platform Overview',
      url: '/admin',
      icon: 'LayoutDashboard',
      order: 1,
      elementClass: 'all',
      children: [],
    },
  ];

  beforeEach(async () => {
    service = {
      getMenuTree: jest.fn().mockResolvedValue(mockMenuTree),
      createMenuItem: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 10, ...dto })),
      updateMenuItem: jest.fn().mockImplementation((id, dto) => Promise.resolve({ id, ...dto })),
      reorderTree: jest.fn().mockResolvedValue({ success: true, updatedCount: 2 }),
      deleteMenuItem: jest.fn().mockResolvedValue({ success: true }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminMenuController],
      providers: [
        {
          provide: AdminMenuService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<AdminMenuController>(AdminMenuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return menu tree for specified role', async () => {
    const res = await controller.getMenuTree('super-admin');
    expect(res).toEqual(mockMenuTree);
    expect(service.getMenuTree).toHaveBeenCalledWith('super-admin');
  });

  it('should create menu item', async () => {
    const payload = {
      title: 'New Navigation',
      url: '/admin/new',
      icon: 'Settings',
      role: 'super-admin' as const,
      order: 10,
    };
    const res = await controller.createMenuItem(payload);
    expect(res).toHaveProperty('id', 10);
    expect(service.createMenuItem).toHaveBeenCalledWith(payload);
  });

  it('should reorder tree', async () => {
    const items = [{ id: 1, order: 2, parentId: null }];
    const res = await controller.reorderTree({ items });
    expect(res).toEqual({ success: true, updatedCount: 2 });
    expect(service.reorderTree).toHaveBeenCalledWith(items);
  });
});
