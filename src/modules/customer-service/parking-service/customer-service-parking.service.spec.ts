import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CustomerServiceParkingService } from './customer-service-parking.service';

describe('CustomerServiceParkingService Unit Tests', () => {
  let service: CustomerServiceParkingService;
  let mockSlotModel: any;
  let mockAssignmentModel: any;
  let mockRentalModel: any;
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
    mockSlotModel = {
      findOne: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      create: jest.fn(),
    };

    mockAssignmentModel = {
      findOne: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
      create: jest.fn(),
    };

    mockRentalModel = {
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

    service = new CustomerServiceParkingService(
      mockSlotModel,
      mockAssignmentModel,
      mockRentalModel,
      mockProjectModel,
    );
  });

  describe('1. Unique Slot Validation', () => {
    it('createSlot should throw BadRequestException if slot number already exists in project', async () => {
      mockProjectModel.findOne.mockResolvedValue(projectTenantA);
      mockSlotModel.findOne.mockResolvedValue({
        id: 1,
        slotNumber: 'B1-01',
        projectId: projectTenantA.uuid,
      });

      await expect(
        service.createSlot(mockUserTenantA, {
          project_id: projectTenantA.uuid,
          slot_number: 'B1-01',
          floor_zone: 'Basement 1',
        }),
      ).rejects.toThrow(BadRequestException);

      expect(mockSlotModel.create).not.toHaveBeenCalled();
    });

    it('createSlot should succeed when slot number is unique within the project', async () => {
      mockProjectModel.findOne.mockResolvedValue(projectTenantA);
      mockSlotModel.findOne.mockResolvedValue(null);
      mockSlotModel.create.mockResolvedValue({
        id: 2,
        uuid: 'slot-2-uuid',
        organizationId: 1,
        projectId: projectTenantA.uuid,
        slotNumber: 'B1-02',
        floorZone: 'Basement 1',
        allowedVehicleType: 'Car',
        status: 'FREE',
      });

      const res = await service.createSlot(mockUserTenantA, {
        project_id: projectTenantA.uuid,
        slot_number: 'B1-02',
        floor_zone: 'Basement 1',
      });

      expect(res.slot_number).toBe('B1-02');
      expect(res.status).toBe('FREE');
      expect(mockSlotModel.create).toHaveBeenCalled();
    });
  });

  describe('2. Double Assignment Blocking', () => {
    it('createAssignment should block double assignment if slot is already occupied by resident', async () => {
      mockProjectModel.findOne.mockResolvedValue(projectTenantA);
      mockSlotModel.findOne.mockResolvedValue({
        id: 5,
        slotNumber: 'B1-05',
        status: 'OCCUPIED',
      });
      mockAssignmentModel.findOne.mockResolvedValue({
        id: 1,
        residentName: 'Mr. Karim',
        flatNumber: 'Flat 4A',
        vehicleNumber: 'Dhaka-Metro-1234',
        isActive: true,
      });

      await expect(
        service.createAssignment(mockUserTenantA, {
          project_id: projectTenantA.uuid,
          slot_id: 5,
          flat_number: 'Flat 5B',
          resident_name: 'Mr. Rahim',
          vehicle_number: 'Dhaka-Metro-5678',
          start_date: '2026-11-10',
        }),
      ).rejects.toThrow(BadRequestException);

      expect(mockAssignmentModel.create).not.toHaveBeenCalled();
    });

    it('createAssignment should block assignment if slot is currently rented externally', async () => {
      mockProjectModel.findOne.mockResolvedValue(projectTenantA);
      mockSlotModel.findOne.mockResolvedValue({
        id: 6,
        slotNumber: 'B1-06',
        status: 'RENTED_EXTERNAL',
      });
      mockAssignmentModel.findOne.mockResolvedValue(null);
      mockRentalModel.findOne.mockResolvedValue({
        id: 2,
        renterName: 'Commercial Courier Co',
        status: 'ACTIVE',
      });

      await expect(
        service.createAssignment(mockUserTenantA, {
          project_id: projectTenantA.uuid,
          slot_id: 6,
          flat_number: 'Flat 5B',
          resident_name: 'Mr. Rahim',
          vehicle_number: 'Dhaka-Metro-5678',
          start_date: '2026-11-10',
        }),
      ).rejects.toThrow(BadRequestException);

      expect(mockAssignmentModel.create).not.toHaveBeenCalled();
    });

    it('createAssignment should succeed for a FREE slot and update status to OCCUPIED', async () => {
      const mockSlot = {
        id: 7,
        slotNumber: 'B1-07',
        status: 'FREE',
        save: jest.fn().mockResolvedValue(true),
      };
      mockProjectModel.findOne.mockResolvedValue(projectTenantA);
      mockSlotModel.findOne.mockResolvedValue(mockSlot);
      mockAssignmentModel.findOne.mockResolvedValue(null);
      mockRentalModel.findOne.mockResolvedValue(null);

      const createdAssignment = {
        id: 10,
        uuid: 'assign-10-uuid',
        organizationId: 1,
        projectId: projectTenantA.uuid,
        slotId: 7,
        flatNumber: 'Flat 7A',
        residentName: 'Tariq Hasan',
        vehicleNumber: 'Dhaka Metro GA-11',
        vehicleType: 'Car',
        startDate: '2026-11-10',
        isActive: true,
      };

      mockAssignmentModel.create.mockResolvedValue(createdAssignment);
      mockAssignmentModel.findByPk.mockResolvedValue(createdAssignment);

      const res = await service.createAssignment(mockUserTenantA, {
        project_id: projectTenantA.uuid,
        slot_id: 7,
        flat_number: 'Flat 7A',
        resident_name: 'Tariq Hasan',
        vehicle_number: 'Dhaka Metro GA-11',
        start_date: '2026-11-10',
      });

      expect(mockSlot.status).toBe('OCCUPIED');
      expect(mockSlot.save).toHaveBeenCalled();
      expect(res.resident_name).toBe('Tariq Hasan');
      expect(res.is_active).toBe(true);
    });

    it('releaseAssignment should mark assignment inactive and restore slot to FREE', async () => {
      const mockSlot = {
        id: 7,
        status: 'OCCUPIED',
        save: jest.fn().mockResolvedValue(true),
      };
      const mockAssignment = {
        id: 10,
        uuid: 'assign-10-uuid',
        slotId: 7,
        isActive: true,
        releaseDate: null,
        releaseReason: null,
        save: jest.fn().mockResolvedValue(true),
      };

      mockAssignmentModel.findOne.mockResolvedValue(mockAssignment);
      mockSlotModel.findByPk.mockResolvedValue(mockSlot);

      const res = await service.releaseAssignment(mockUserTenantA, 'assign-10-uuid', {
        release_reason: 'Resident relocated',
      });

      expect(mockAssignment.isActive).toBe(false);
      expect(mockSlot.status).toBe('FREE');
      expect(mockSlot.save).toHaveBeenCalled();
      expect(res.is_active).toBe(false);
    });
  });

  describe('3. External Rentals & Building Maintenance Income', () => {
    it('createExternalRental should block renting an occupied slot', async () => {
      mockProjectModel.findOne.mockResolvedValue(projectTenantA);
      mockSlotModel.findOne.mockResolvedValue({
        id: 8,
        slotNumber: 'B1-08',
        status: 'OCCUPIED',
      });

      await expect(
        service.createExternalRental(mockUserTenantA, {
          project_id: projectTenantA.uuid,
          slot_id: 8,
          renter_name: 'Apex Outsiders Ltd',
          renter_phone: '+8801700000000',
          vehicle_number: 'Dhaka-Metro-9999',
          monthly_rent: 4000,
          start_date: '2026-11-01',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('createExternalRental should succeed for FREE slot and update status to RENTED_EXTERNAL', async () => {
      const mockSlot = {
        id: 9,
        slotNumber: 'B1-09',
        status: 'FREE',
        save: jest.fn().mockResolvedValue(true),
      };
      mockProjectModel.findOne.mockResolvedValue(projectTenantA);
      mockSlotModel.findOne.mockResolvedValue(mockSlot);
      mockAssignmentModel.findOne.mockResolvedValue(null);
      mockRentalModel.findOne.mockResolvedValue(null);

      const createdRental = {
        id: 50,
        uuid: 'rent-50-uuid',
        organizationId: 1,
        projectId: projectTenantA.uuid,
        slotId: 9,
        renterName: 'Dr. Shahabuddin',
        renterPhone: '+8801711223344',
        vehicleNumber: 'Dhaka Metro KHA-88',
        monthlyRent: 4500,
        depositAmount: 9000,
        startDate: '2026-11-01',
        paymentStatus: 'DUE',
        amountCollected: 0,
        status: 'ACTIVE',
      };

      mockRentalModel.create.mockResolvedValue(createdRental);
      mockRentalModel.findByPk.mockResolvedValue(createdRental);

      const res = await service.createExternalRental(mockUserTenantA, {
        project_id: projectTenantA.uuid,
        slot_id: 9,
        renter_name: 'Dr. Shahabuddin',
        renter_phone: '+8801711223344',
        vehicle_number: 'Dhaka Metro KHA-88',
        monthly_rent: 4500,
        deposit_amount: 9000,
        start_date: '2026-11-01',
      });

      expect(mockSlot.status).toBe('RENTED_EXTERNAL');
      expect(mockSlot.save).toHaveBeenCalled();
      expect(res.renter_name).toBe('Dr. Shahabuddin');
      expect(res.monthly_rent).toBe(4500);
      expect(res.payment_status).toBe('DUE');
    });

    it('collectRentalPayment should update collected amount and set payment_status to PAID when fully settled', async () => {
      const mockRental = {
        id: 50,
        uuid: 'rent-50-uuid',
        monthlyRent: 4500,
        amountCollected: 0,
        paymentStatus: 'DUE',
        notes: null,
        save: jest.fn().mockResolvedValue(true),
      };

      mockRentalModel.findOne.mockResolvedValue(mockRental);

      const res = await service.collectRentalPayment(mockUserTenantA, 'rent-50-uuid', {
        amount: 4500,
        reference: 'MR-2026-081',
      });

      expect(mockRental.amountCollected).toBe(4500);
      expect(mockRental.paymentStatus).toBe('PAID');
      expect(res.balance_due).toBe(0);
      expect(res.payment_status).toBe('PAID');
    });

    it('getMonthlyIncomeSummary should calculate total receivable, collected, and due for building costs', async () => {
      mockSlotModel.findAll.mockResolvedValue([
        { id: 1, status: 'FREE' },
        { id: 2, status: 'FREE' },
        { id: 3, status: 'OCCUPIED' },
        { id: 4, status: 'RENTED_EXTERNAL' },
        { id: 5, status: 'RENTED_EXTERNAL' },
      ]);

      mockRentalModel.findAll.mockResolvedValue([
        {
          id: 1,
          monthlyRent: 5000,
          amountCollected: 5000,
          paymentStatus: 'PAID',
          slot: { slotNumber: 'B1-04' },
        },
        {
          id: 2,
          monthlyRent: 4000,
          amountCollected: 2000,
          paymentStatus: 'PARTIAL',
          slot: { slotNumber: 'B1-05' },
        },
      ]);

      const summary = await service.getMonthlyIncomeSummary(mockUserTenantA, projectTenantA.uuid);

      expect(summary.total_slots).toBe(5);
      expect(summary.free_slots).toBe(2);
      expect(summary.occupied_slots).toBe(1);
      expect(summary.rented_external_slots).toBe(2);
      expect(summary.monthly_rent_receivable).toBe(9000);
      expect(summary.total_rent_collected).toBe(7000);
      expect(summary.total_rent_due).toBe(2000);
      expect(summary.collection_rate_percent).toBe(78); // 7000/9000 = 77.7% -> 78%
    });
  });

  describe('4. Tenant / Organization Isolation', () => {
    it('should throw NotFoundException when creating slot for project outside organization', async () => {
      mockProjectModel.findOne.mockResolvedValue(null);

      await expect(
        service.createSlot(mockUserTenantB, {
          project_id: projectTenantA.uuid,
          slot_number: 'GF-01',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when accessing slot belonging to another organization', async () => {
      mockSlotModel.findOne.mockResolvedValue(null);

      await expect(
        service.getSlotByUuid(mockUserTenantB, 'foreign-slot-uuid'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when accessing external rental belonging to another organization', async () => {
      mockRentalModel.findOne.mockResolvedValue(null);

      await expect(
        service.getExternalRentalByUuid(mockUserTenantB, 'foreign-rental-uuid'),
      ).rejects.toThrow(NotFoundException);
    });

    it('getSlots should strictly apply organizationId filter', async () => {
      mockSlotModel.findAndCountAll.mockResolvedValue({ rows: [], count: 0 });

      await service.getSlots(mockUserTenantA, { page: 1, limit: 10 });

      expect(mockSlotModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            organizationId: 1,
          }),
        }),
      );
    });
  });
});

