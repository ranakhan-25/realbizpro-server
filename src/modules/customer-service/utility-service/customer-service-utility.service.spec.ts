import { NotFoundException } from '@nestjs/common';
import { CustomerServiceUtilityService } from './customer-service-utility.service';
import {
  UtilityTicketCategoryEnum,
  UtilityTicketPriorityEnum,
} from './dto/create-utility-ticket.dto';

describe('CustomerServiceUtilityService Unit Tests', () => {
  let service: CustomerServiceUtilityService;
  let mockTicketModel: any;
  let mockWarrantyItemModel: any;
  let mockTechnicianModel: any;
  let mockProjectModel: any;

  beforeEach(() => {
    mockTicketModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      count: jest.fn(),
      sum: jest.fn(),
    };

    mockWarrantyItemModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      count: jest.fn(),
    };

    mockTechnicianModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
    };

    mockProjectModel = {
      findOne: jest.fn(),
    };

    service = new CustomerServiceUtilityService(
      mockTechnicianModel,
      mockWarrantyItemModel,
      mockTicketModel,
      mockProjectModel,
    );
  });

  describe('1. FREE / PAID Logic Computation', () => {
    const activeUser = { id: 10, organizationId: 1, role: 'ADMIN' };
    const projectUuid = '561dd3c0-c10d-4d07-88f6-41d40195290d';

    beforeEach(() => {
      mockProjectModel.findOne.mockResolvedValue({
        id: 1,
        uuid: projectUuid,
        name: 'Rifat Eyecon City',
        code: 'PRJ-2026-004',
      });
      mockTicketModel.findOne.mockImplementation(({ where }: any) => {
        if (where?.uuid === 'mock-ticket-uuid') {
          return Promise.resolve({
            id: 1,
            uuid: 'mock-ticket-uuid',
            ticketNumber: 'UTL-PRJ-2026-004-0001',
            queueSerial: 1,
            costType: 'FREE',
            estimatedCharge: 0,
            status: 'Open',
            category: 'Electrical',
            customerName: 'Arafat',
            unit: 'Flat 4-B',
          });
        }
        return Promise.resolve(null);
      });
    });

    it('should compute cost_type = FREE (estimated_charge = 0) when linked fixture warranty is ACTIVE', async () => {
      // Future warranty end date = active
      const futureDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);

      mockWarrantyItemModel.findOne.mockResolvedValue({
        id: 101,
        uuid: 'w-uuid-1',
        itemName: 'Schneider 16A Gang Switch',
        warrantyEndDate: futureDate,
      });

      mockTicketModel.create.mockResolvedValue({
        id: 1,
        uuid: 'mock-ticket-uuid',
      });

      await service.createTicket(
        {
          project_id: projectUuid,
          unit: 'Flat 4-B',
          customer_name: 'Arafat',
          category: UtilityTicketCategoryEnum.ELECTRICAL,
          description: 'Switch sparked when turned on',
          priority: UtilityTicketPriorityEnum.HIGH,
          warranty_item_id: 101,
          estimated_charge: 750,
        },
        activeUser,
      );

      expect(mockTicketModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          costType: 'FREE',
          estimatedCharge: 0,
          warrantyItemId: 101,
        }),
      );
    });

    it('should compute cost_type = PAID with estimated charge when warranty item is EXPIRED', async () => {
      // Past warranty end date = expired
      const pastDate = '2024-01-01';

      mockWarrantyItemModel.findOne.mockResolvedValue({
        id: 102,
        uuid: 'w-uuid-2',
        itemName: 'Old Cotto Water Valve',
        warrantyEndDate: pastDate,
      });

      mockTicketModel.create.mockResolvedValue({
        id: 2,
        uuid: 'mock-ticket-uuid',
      });

      await service.createTicket(
        {
          project_id: projectUuid,
          unit: 'Flat 4-B',
          customer_name: 'Arafat',
          category: UtilityTicketCategoryEnum.PLUMBING,
          description: 'Valve leaking water',
          warranty_item_id: 102,
          estimated_charge: 500,
        },
        activeUser,
      );

      expect(mockTicketModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          costType: 'PAID',
          estimatedCharge: 500,
          warrantyItemId: 102,
        }),
      );
    });

    it('should compute cost_type = PAID when no warranty item is linked', async () => {
      mockTicketModel.create.mockResolvedValue({
        id: 3,
        uuid: 'mock-ticket-uuid',
      });

      await service.createTicket(
        {
          project_id: projectUuid,
          unit: 'Flat 4-B',
          customer_name: 'Arafat',
          category: UtilityTicketCategoryEnum.SANITARY,
          description: 'Sink drain blocked',
          estimated_charge: 350,
        },
        activeUser,
      );

      expect(mockTicketModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          costType: 'PAID',
          estimatedCharge: 350,
          warrantyItemId: null,
        }),
      );
    });
  });

  describe('2. FIFO Queue Serial Generation per Project', () => {
    const activeUser = { id: 10, organizationId: 1, role: 'ADMIN' };
    const projectUuid = '561dd3c0-c10d-4d07-88f6-41d40195290d';

    beforeEach(() => {
      mockProjectModel.findOne.mockResolvedValue({
        id: 1,
        uuid: projectUuid,
        name: 'Rifat Eyecon City',
        code: 'REC',
      });
      mockTicketModel.findOne.mockResolvedValue({
        id: 1,
        uuid: 'mock-ticket-uuid',
      });
      mockTicketModel.create.mockResolvedValue({
        id: 1,
        uuid: 'mock-ticket-uuid',
      });
    });

    it('should assign queue_serial = 1 for the first claim in a project', async () => {
      // No previous ticket found
      mockTicketModel.findOne.mockImplementationOnce(({ order }: any) => {
        if (order && order[0][0] === 'queueSerial') {
          return Promise.resolve(null);
        }
        return Promise.resolve({ uuid: 'mock-ticket-uuid' });
      });

      await service.createTicket(
        {
          project_id: projectUuid,
          unit: 'Flat 1-A',
          customer_name: 'First Claimant',
          category: UtilityTicketCategoryEnum.PLUMBING,
          description: 'Water issue',
        },
        activeUser,
      );

      expect(mockTicketModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          queueSerial: 1,
          ticketNumber: 'UTL-REC-0001',
        }),
      );
    });

    it('should increment queue_serial sequentially (e.g. 5 -> 6)', async () => {
      // Previous max serial was 5
      mockTicketModel.findOne.mockImplementationOnce(({ order }: any) => {
        if (order && order[0][0] === 'queueSerial') {
          return Promise.resolve({ queueSerial: 5 });
        }
        return Promise.resolve({ uuid: 'mock-ticket-uuid' });
      });

      await service.createTicket(
        {
          project_id: projectUuid,
          unit: 'Flat 2-B',
          customer_name: 'Next Claimant',
          category: UtilityTicketCategoryEnum.ELECTRICAL,
          description: 'Power trip',
        },
        activeUser,
      );

      expect(mockTicketModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          queueSerial: 6,
          ticketNumber: 'UTL-REC-0006',
        }),
      );
    });
  });

  describe('3. Multi-Tenancy & Tenant Isolation', () => {
    const userOrg1 = { id: 10, organizationId: 1, role: 'STAFF' };
    const userOrg2 = { id: 20, organizationId: 2, role: 'STAFF' };

    it('should throw NotFoundException (404) when attempting to view or update a ticket outside user org', async () => {
      mockTicketModel.findOne.mockResolvedValue(null); // Not found in userOrg2 scope

      await expect(
        service.findTicketByUuid('foreign-ticket-uuid', userOrg2),
      ).rejects.toThrow(NotFoundException);
    });

    it('should strictly inject organizationId from user context during ticket creation', async () => {
      mockProjectModel.findOne.mockResolvedValue({
        id: 1,
        uuid: 'project-uuid',
        code: 'PRJ',
      });
      mockTicketModel.create.mockResolvedValue({ uuid: 'ticket-uuid' });
      mockTicketModel.findOne.mockResolvedValue({ uuid: 'ticket-uuid' });

      await service.createTicket(
        {
          project_id: 'project-uuid',
          unit: 'Flat 3-C',
          customer_name: 'Org1 Customer',
          category: UtilityTicketCategoryEnum.PLUMBING,
          description: 'Test',
        },
        userOrg1,
      );

      expect(mockTicketModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          organizationId: 1,
        }),
      );
    });
  });
});

