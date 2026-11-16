import { Test, TestingModule } from '@nestjs/testing';
import { CustomerServiceCommitteeController } from './customer-service-committee.controller';
import { CustomerServiceCommitteeService } from './customer-service-committee.service';

describe('CustomerServiceCommitteeController Unit Tests', () => {
  let controller: CustomerServiceCommitteeController;
  let mockService: any;

  const mockUser = {
    id: 1,
    orgId: 1,
    isSuperUser: false,
  };

  beforeEach(async () => {
    mockService = {
      getOverviewStats: jest.fn().mockResolvedValue({
        members: { total: 10, active: 8, developer_representatives: 3, flat_owners: 7 },
        decisions: { total: 5, approved: 3, implemented: 2 },
      }),
      createMember: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Dr. Rafiqul Islam',
        designation: 'President',
      }),
      listMembers: jest.fn().mockResolvedValue({
        items: [],
        meta: { total: 0, page: 1, limit: 25, total_pages: 0 },
        stats: { total_members: 0, active_members: 0, developer_reps_count: 0, flat_owners_count: 0 },
      }),
      getMember: jest.fn().mockResolvedValue({
        id: 1,
        uuid: 'mem-1',
        name: 'Dr. Rafiqul Islam',
      }),
      updateMember: jest.fn().mockResolvedValue({
        id: 1,
        uuid: 'mem-1',
        name: 'Updated Name',
      }),
      deleteMember: jest.fn().mockResolvedValue({
        success: true,
        message: 'Committee member deleted',
      }),
      createDecision: jest.fn().mockResolvedValue({
        id: 1,
        title: 'Approve vendor renewal',
        status: 'APPROVED',
      }),
      listDecisions: jest.fn().mockResolvedValue({
        items: [],
        meta: { total: 0, page: 1, limit: 25, total_pages: 0 },
        stats: { total_decisions: 0, approved_count: 0, in_progress_count: 0, implemented_count: 0 },
      }),
      updateDecision: jest.fn().mockResolvedValue({
        id: 1,
        uuid: 'dec-1',
        status: 'IMPLEMENTED',
      }),
      deleteDecision: jest.fn().mockResolvedValue({
        success: true,
        message: 'Committee decision deleted',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerServiceCommitteeController],
      providers: [
        {
          provide: CustomerServiceCommitteeService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CustomerServiceCommitteeController>(
      CustomerServiceCommitteeController,
    );
  });

  it('getOverviewStats delegates to service.getOverviewStats', async () => {
    const res = await controller.getOverviewStats(mockUser, 'proj-1');
    expect(res.members.total).toBe(10);
    expect(mockService.getOverviewStats).toHaveBeenCalledWith(mockUser, 'proj-1');
  });

  it('createMember delegates to service.createMember', async () => {
    const dto = {
      project_id: 'proj-1',
      member_type: 'FLAT_OWNER' as const,
      name: 'Dr. Rafiqul Islam',
      designation: 'President' as const,
      phone: '+880 1711-000000',
      term_start: '2026-01-01',
    };
    const res = await controller.createMember(mockUser, dto);
    expect(res.name).toBe('Dr. Rafiqul Islam');
    expect(mockService.createMember).toHaveBeenCalledWith(mockUser, dto);
  });

  it('createDecision delegates to service.createDecision', async () => {
    const dto = {
      project_id: 'proj-1',
      title: 'Approve vendor renewal',
      meeting_date: '2026-11-05',
      resolution_notes: 'Approved',
    };
    const res = await controller.createDecision(mockUser, dto);
    expect(res.title).toBe('Approve vendor renewal');
    expect(mockService.createDecision).toHaveBeenCalledWith(mockUser, dto);
  });
});

