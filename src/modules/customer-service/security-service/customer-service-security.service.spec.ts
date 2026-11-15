import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CustomerServiceSecurityService, checkShiftOverlap } from './customer-service-security.service';

describe('CustomerServiceSecurityService Unit Tests', () => {
  let service: CustomerServiceSecurityService;
  let mockCompanyModel: any;
  let mockGuardModel: any;
  let mockRosterModel: any;
  let mockVisitorLogModel: any;
  let mockProjectModel: any;

  const mockUser = {
    id: 10,
    orgId: 1,
    organization: { id: 1 },
    role: 'ADMIN',
  };

  const otherOrgUser = {
    id: 20,
    orgId: 2,
    organization: { id: 2 },
    role: 'ADMIN',
  };

  const mockProject = {
    id: 100,
    uuid: 'proj-uuid-1',
    name: 'Rifat Eyecon City',
    code: 'PRJ-2026-004',
    organizationId: 1,
  };

  beforeEach(() => {
    mockCompanyModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      count: jest.fn(),
      sum: jest.fn(),
    };

    mockGuardModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      count: jest.fn(),
    };

    mockRosterModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      count: jest.fn(),
    };

    mockVisitorLogModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      count: jest.fn(),
    };

    mockProjectModel = {
      findOne: jest.fn(),
    };

    service = new CustomerServiceSecurityService(
      mockCompanyModel,
      mockGuardModel,
      mockRosterModel,
      mockVisitorLogModel,
      mockProjectModel,
    );
  });

  // =========================================================================
  // TEST SUITE 1: SHIFT OVERLAP ALGORITHM & ROSTER VALIDATION
  // =========================================================================
  describe('1. Roster Shift Overlap Validation', () => {
    it('checkShiftOverlap should detect daytime shift overlaps', () => {
      // 08:00 - 16:00 overlaps with 12:00 - 20:00
      expect(checkShiftOverlap('08:00', '16:00', '12:00', '20:00')).toBe(true);
      // 08:00 - 16:00 completely inside 06:00 - 18:00
      expect(checkShiftOverlap('08:00', '16:00', '06:00', '18:00')).toBe(true);
      // Back-to-back shifts: 08:00 - 16:00 and 16:00 - 23:59 (no overlap)
      expect(checkShiftOverlap('08:00', '16:00', '16:00', '23:59')).toBe(false);
      // Non-overlapping daytime: 08:00 - 12:00 and 14:00 - 18:00
      expect(checkShiftOverlap('08:00', '12:00', '14:00', '18:00')).toBe(false);
    });

    it('checkShiftOverlap should detect overnight shift overlaps', () => {
      // Overnight 22:00 - 06:00 overlaps with 20:00 - 04:00
      expect(checkShiftOverlap('22:00', '06:00', '20:00', '04:00')).toBe(true);
      // Overnight 22:00 - 06:00 overlaps with 23:00 - 07:00
      expect(checkShiftOverlap('22:00', '06:00', '23:00', '07:00')).toBe(true);
      // Overnight 22:00 - 06:00 overlaps with 21:00 - 23:00
      expect(checkShiftOverlap('22:00', '06:00', '21:00', '23:00')).toBe(true);
      // Overnight 22:00 - 06:00 does not overlap with daytime 08:00 - 16:00
      expect(checkShiftOverlap('22:00', '06:00', '08:00', '16:00')).toBe(false);
    });

    it('createRoster should reject overlapping shifts for the same guard on the same date', async () => {
      mockProjectModel.findOne.mockResolvedValue(mockProject);
      mockGuardModel.findOne.mockResolvedValue({
        id: 5,
        uuid: 'guard-uuid-5',
        name: 'Kabir Hossain',
        organizationId: 1,
      });

      // Existing shift for guard on 2026-11-10: 08:00 - 16:00
      mockRosterModel.findAll.mockResolvedValue([
        {
          id: 1,
          guardId: 5,
          dutyDate: '2026-11-10',
          shiftName: 'Morning',
          shiftStart: '08:00',
          shiftEnd: '16:00',
          postLocation: 'Main Gate',
          status: 'SCHEDULED',
        },
      ]);

      await expect(
        service.createRoster(mockUser, {
          project_id: 'proj-uuid-1',
          guard_id: 5,
          duty_date: '2026-11-10',
          shift_name: 'General',
          shift_start: '12:00', // Overlaps with 08:00-16:00!
          shift_end: '20:00',
          post_location: 'Basement Parking',
        }),
      ).rejects.toThrow(BadRequestException);

      expect(mockRosterModel.create).not.toHaveBeenCalled();
    });

    it('createRoster should succeed when shifts do not overlap', async () => {
      mockProjectModel.findOne.mockResolvedValue(mockProject);
      mockGuardModel.findOne.mockResolvedValue({
        id: 5,
        uuid: 'guard-uuid-5',
        name: 'Kabir Hossain',
        organizationId: 1,
      });

      mockRosterModel.findAll.mockResolvedValue([
        {
          id: 1,
          guardId: 5,
          dutyDate: '2026-11-10',
          shiftName: 'Morning',
          shiftStart: '08:00',
          shiftEnd: '16:00',
          postLocation: 'Main Gate',
          status: 'SCHEDULED',
        },
      ]);

      mockRosterModel.create.mockResolvedValue({
        id: 2,
        uuid: 'roster-uuid-2',
        projectId: 'proj-uuid-1',
        guardId: 5,
        dutyDate: '2026-11-10',
        shiftName: 'Night',
        shiftStart: '20:00',
        shiftEnd: '04:00',
        postLocation: 'Main Gate',
        status: 'SCHEDULED',
        project: mockProject,
        guard: { id: 5, uuid: 'guard-uuid-5', name: 'Kabir Hossain', phone: '01700000000', source: 'IN_HOUSE' },
      });

      const res = await service.createRoster(mockUser, {
        project_id: 'proj-uuid-1',
        guard_id: 5,
        duty_date: '2026-11-10',
        shift_name: 'Night',
        shift_start: '20:00',
        shift_end: '04:00',
        post_location: 'Main Gate',
      });

      expect(res).toBeDefined();
      expect(mockRosterModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          guardId: 5,
          dutyDate: '2026-11-10',
          shiftStart: '20:00',
          shiftEnd: '04:00',
        }),
      );
    });
  });

  // =========================================================================
  // TEST SUITE 2: COMPANY-REQUIRED RULE
  // =========================================================================
  describe('2. Company-Required Rule for Guards', () => {
    it('createGuard should throw BadRequestException when source is COMPANY but company_id is missing', async () => {
      await expect(
        service.createGuard(mockUser, {
          name: 'Rahim Uddin',
          phone: '01711223344',
          national_id: '1990123456789',
          source: 'COMPANY',
          joined_date: '2026-01-01',
          // company_id omitted!
        }),
      ).rejects.toThrow(BadRequestException);

      expect(mockGuardModel.create).not.toHaveBeenCalled();
    });

    it('createGuard should throw NotFoundException if company_id does not exist in user organization', async () => {
      mockCompanyModel.findOne.mockResolvedValue(null); // Company not found

      await expect(
        service.createGuard(mockUser, {
          name: 'Rahim Uddin',
          phone: '01711223344',
          national_id: '1990123456789',
          source: 'COMPANY',
          company_id: 999,
          joined_date: '2026-01-01',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(mockGuardModel.create).not.toHaveBeenCalled();
    });

    it('createGuard should succeed when source is COMPANY and valid company_id is provided', async () => {
      mockCompanyModel.findOne.mockResolvedValue({
        id: 12,
        uuid: 'comp-uuid-12',
        name: 'Elite Security Services Ltd',
        organizationId: 1,
      });

      mockGuardModel.create.mockResolvedValue({
        id: 7,
        uuid: 'guard-uuid-7',
        name: 'Rahim Uddin',
        phone: '01711223344',
        nationalId: '1990123456789',
        source: 'COMPANY',
        companyId: 12,
        status: 'ACTIVE',
        joinedDate: '2026-01-01',
        company: { id: 12, uuid: 'comp-uuid-12', name: 'Elite Security Services Ltd' },
      });

      const res = await service.createGuard(mockUser, {
        name: 'Rahim Uddin',
        phone: '01711223344',
        national_id: '1990123456789',
        source: 'COMPANY',
        company_id: 12,
        joined_date: '2026-01-01',
      });

      expect(res).toBeDefined();
      expect(res.name).toBe('Rahim Uddin');
      expect(mockGuardModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          source: 'COMPANY',
          companyId: 12,
        }),
      );
    });

    it('createGuard should succeed without company_id when source is IN_HOUSE', async () => {
      mockGuardModel.create.mockResolvedValue({
        id: 8,
        uuid: 'guard-uuid-8',
        name: 'Jamal Hossain',
        phone: '01811223344',
        nationalId: '1985123456789',
        source: 'IN_HOUSE',
        companyId: null,
        status: 'ACTIVE',
        joinedDate: '2025-06-01',
      });

      const res = await service.createGuard(mockUser, {
        name: 'Jamal Hossain',
        phone: '01811223344',
        national_id: '1985123456789',
        source: 'IN_HOUSE',
        joined_date: '2025-06-01',
      });

      expect(res).toBeDefined();
      expect(res.source).toBe('IN_HOUSE');
      expect(res.company_id).toBeNull();
      expect(mockGuardModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          source: 'IN_HOUSE',
          companyId: null,
        }),
      );
    });
  });

  // =========================================================================
  // TEST SUITE 3: TENANT ISOLATION
  // =========================================================================
  describe('3. Tenant / Organization Isolation', () => {
    it('should throw NotFoundException when creating company with project belonging to another organization', async () => {
      mockProjectModel.findOne.mockResolvedValue(null);

      await expect(
        service.createCompany(mockUser, {
          name: 'SecureGuard Ltd',
          contact_person: 'Mr. X',
          phone: '01911223344',
          project_id: 'other-org-proj-uuid',
          contract_start: '2026-01-01',
          contract_end: '2026-12-31',
          monthly_cost: 45000,
        }),
      ).rejects.toThrow(NotFoundException);

      expect(mockCompanyModel.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when updating company belonging to another organization', async () => {
      mockCompanyModel.findOne.mockResolvedValue(null);

      await expect(
        service.updateCompany(otherOrgUser, 'comp-uuid-1', {
          name: 'Hacked Name',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(mockCompanyModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            uuid: 'comp-uuid-1',
            organizationId: 2,
          }),
        }),
      );
    });

    it('should throw NotFoundException when deleting company belonging to another organization', async () => {
      mockCompanyModel.findOne.mockResolvedValue(null);

      await expect(
        service.deleteCompany(otherOrgUser, 'comp-uuid-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when creating roster for guard belonging to another organization', async () => {
      mockProjectModel.findOne.mockResolvedValue(mockProject);
      mockGuardModel.findOne.mockResolvedValue(null);

      await expect(
        service.createRoster(mockUser, {
          project_id: 'proj-uuid-1',
          guard_id: 99,
          duty_date: '2026-11-10',
          shift_name: 'Morning',
          shift_start: '08:00',
          shift_end: '16:00',
          post_location: 'Gate 1',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('getCompanies should strictly filter by organizationId', async () => {
      mockCompanyModel.findAndCountAll.mockResolvedValue({
        rows: [],
        count: 0,
      });

      await service.getCompanies(mockUser, { page: 1, limit: 10 });

      expect(mockCompanyModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            organizationId: 1,
          }),
        }),
      );
    });

    it('getGuards should strictly filter by organizationId', async () => {
      mockGuardModel.findAndCountAll.mockResolvedValue({
        rows: [],
        count: 0,
      });

      await service.getGuards(mockUser, { page: 1, limit: 10 });

      expect(mockGuardModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            organizationId: 1,
          }),
        }),
      );
    });

    it('getVisitorLogs should strictly filter by organizationId', async () => {
      mockVisitorLogModel.findAndCountAll.mockResolvedValue({
        rows: [],
        count: 0,
      });

      await service.getVisitorLogs(mockUser, { page: 1, limit: 10 });

      expect(mockVisitorLogModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            organizationId: 1,
          }),
        }),
      );
    });
  });

  // =========================================================================
  // TEST SUITE 4: MONTHLY COST & 30-DAY EXPIRY COMPUTATIONS
  // =========================================================================
  describe('4. Monthly Security Cost & Contract Expiry Calculations', () => {
    it('getMonthlySecurityCost should sum active company monthly costs and return guard count breakdown', async () => {
      mockCompanyModel.findAll.mockResolvedValue([
        { id: 1, name: 'Elite Security', monthlyCost: 60000, contractEnd: '2026-12-31', status: 'ACTIVE' },
        { id: 2, name: 'G4S Agency', monthlyCost: 35000, contractEnd: '2026-11-30', status: 'ACTIVE' },
      ]);
      mockGuardModel.count
        .mockResolvedValueOnce(3) // in-house count
        .mockResolvedValueOnce(5); // company guards count

      const res = await service.getMonthlySecurityCost(mockUser, 'proj-uuid-1');

      expect(res).toBeDefined();
      expect(res.grand_monthly_cost).toBe(95000);
      expect(res.formatted_monthly_cost).toBe('৳ 95,000');
      expect(res.total_active_guards).toBe(8);
      expect(res.in_house_guards_count).toBe(3);
      expect(res.company_guards_count).toBe(5);
      expect(res.active_companies_count).toBe(2);
    });
  });
});
