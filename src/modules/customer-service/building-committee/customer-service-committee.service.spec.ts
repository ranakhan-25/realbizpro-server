import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CustomerServiceCommitteeService } from './customer-service-committee.service';

describe('CustomerServiceCommitteeService Unit Tests', () => {
  let service: CustomerServiceCommitteeService;
  let mockMemberModel: any;
  let mockDecisionModel: any;
  let mockProjectModel: any;

  const mockUserTenantA = {
    id: 10,
    orgId: 1,
    isSuperUser: false,
  };

  const mockUserTenantB = {
    id: 20,
    orgId: 2,
    isSuperUser: false,
  };

  const projectTenantA = {
    id: 101,
    uuid: 'proj-tenant-a-uuid',
    name: 'Green Villa',
    organizationId: 1,
  };

  beforeEach(() => {
    mockMemberModel = {
      findOne: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      create: jest.fn(),
    };

    mockDecisionModel = {
      findOne: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      create: jest.fn(),
    };

    mockProjectModel = {
      findOne: jest.fn(),
      findAll: jest.fn(),
    };

    service = new CustomerServiceCommitteeService(
      mockMemberModel,
      mockDecisionModel,
      mockProjectModel,
    );
  });

  describe('1. Member Management', () => {
    it('creates committee member with designation and portfolio', async () => {
      const createdItem = {
        id: 1,
        uuid: 'mem-1-uuid',
        organizationId: 1,
        projectId: projectTenantA.uuid,
        memberType: 'FLAT_OWNER',
        flatNumber: '7B',
        name: 'Dr. Anisur Rahman',
        designation: 'President',
        responsibility: 'Overall Governance & Resident Liaison',
        phone: '+880 1711-223344',
        email: 'anis@example.com',
        termStart: '2026-01-01',
        termEnd: '2027-12-31',
        status: 'ACTIVE',
      };

      mockMemberModel.create.mockResolvedValue(createdItem);
      mockMemberModel.findByPk.mockResolvedValue({
        ...createdItem,
        project: { name: 'Green Villa' },
      });

      const result = await service.createMember(mockUserTenantA, {
        project_id: projectTenantA.uuid,
        member_type: 'FLAT_OWNER',
        flat_number: '7B',
        name: 'Dr. Anisur Rahman',
        designation: 'President',
        responsibility: 'Overall Governance & Resident Liaison',
        phone: '+880 1711-223344',
        email: 'anis@example.com',
        term_start: '2026-01-01',
        term_end: '2027-12-31',
      });

      expect(result.name).toBe('Dr. Anisur Rahman');
      expect(result.designation).toBe('President');
      expect(result.member_type).toBe('FLAT_OWNER');
      expect(result.flat_number).toBe('7B');
      expect(mockMemberModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          organizationId: 1,
          projectId: projectTenantA.uuid,
          memberType: 'FLAT_OWNER',
          name: 'Dr. Anisur Rahman',
        }),
      );
    });

    it('requires project_id to create member', async () => {
      await expect(
        service.createMember(mockUserTenantA, {
          project_id: '',
          member_type: 'DEVELOPER_REP',
          name: 'Engr. Kamal',
          designation: 'Advisor',
          phone: '+880 1711-000000',
          term_start: '2026-01-01',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('2. Decision & Meeting Minutes Log', () => {
    it('logs committee meeting resolution', async () => {
      const createdDecision = {
        id: 10,
        uuid: 'dec-10-uuid',
        organizationId: 1,
        projectId: projectTenantA.uuid,
        title: 'Approve lift maintenance AMC vendor renewal',
        meetingDate: '2026-11-05',
        agendaCategory: 'Maintenance',
        resolutionNotes: 'Approved 1-year contract extension with Otis Elevators for 12,000 ৳ / month.',
        status: 'APPROVED',
      };

      mockDecisionModel.create.mockResolvedValue(createdDecision);
      mockDecisionModel.findByPk.mockResolvedValue({
        ...createdDecision,
        project: { name: 'Green Villa' },
      });

      const result = await service.createDecision(mockUserTenantA, {
        project_id: projectTenantA.uuid,
        title: 'Approve lift maintenance AMC vendor renewal',
        meeting_date: '2026-11-05',
        agenda_category: 'Maintenance',
        resolution_notes: 'Approved 1-year contract extension with Otis Elevators for 12,000 ৳ / month.',
      });

      expect(result.title).toBe('Approve lift maintenance AMC vendor renewal');
      expect(result.agenda_category).toBe('Maintenance');
      expect(result.status).toBe('APPROVED');
    });
  });

  describe('3. Tenant Isolation', () => {
    it('rejects member update across tenant boundary', async () => {
      // Member belongs to org 1; user belongs to org 2
      mockMemberModel.findOne.mockResolvedValue(null);

      await expect(
        service.updateMember(mockUserTenantB, 'member-uuid-1', {
          name: 'Hacked Name',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(mockMemberModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            uuid: 'member-uuid-1',
            organizationId: 2,
          }),
        }),
      );
    });

    it('rejects decision update across tenant boundary', async () => {
      mockDecisionModel.findOne.mockResolvedValue(null);

      await expect(
        service.updateDecision(mockUserTenantB, 'decision-uuid-1', {
          status: 'IMPLEMENTED',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(mockDecisionModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            uuid: 'decision-uuid-1',
            organizationId: 2,
          }),
        }),
      );
    });
  });
});

