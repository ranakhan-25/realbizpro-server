import { NotFoundException } from '@nestjs/common';
import { CustomerServiceService } from './customer-service.service';
import { CustomerProfileStatus } from 'src/database/models/customer-service/cs_customer_profile.model';

describe('CustomerServiceService (Unit Tests)', () => {
  let service: CustomerServiceService;
  let mockCustomerProfileModel: any;
  let mockFlatLandBookingModel: any;
  let mockCrSaleAgreementModel: any;
  let mockCrInstallmentPaymentModel: any;
  let mockProjectModel: any;

  beforeEach(() => {
    mockCustomerProfileModel = {
      findOne: jest.fn(),
      findAll: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    };

    mockFlatLandBookingModel = {
      findAll: jest.fn(),
    };

    mockCrSaleAgreementModel = {
      findAll: jest.fn(),
    };

    mockCrInstallmentPaymentModel = {
      findAll: jest.fn(),
    };

    mockProjectModel = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
    };

    service = new CustomerServiceService(
      mockCustomerProfileModel as any,
      mockFlatLandBookingModel as any,
      mockCrSaleAgreementModel as any,
      mockCrInstallmentPaymentModel as any,
      mockProjectModel as any,
    );
  });

  describe('Bug 1 Regression Test: getCustomer360Profile', () => {
    it('BUG 1: should safely load project details via injected projectModel without uninitialized prototype include errors', async () => {
      const mockCustomer = {
        id: 1,
        uuid: '085d3f64-d420-41af-99c0-389eb6ef7d14',
        customerCode: 'CUST-1',
        customerName: 'Anowar Hossain',
        phoneNumber: '+8801700000000',
        email: 'anowar@gmail.com',
        customerStatus: CustomerProfileStatus.ACTIVE,
        organizationId: 36,
      };

      const mockBookings = [
        {
          id: 101,
          uuid: 'booking-uuid-1',
          code: 'BK-101',
          projectId: 'project-uuid-99',
          grandTotal: '5000000',
          paid: '4000000',
          due: '1000000',
        },
      ];

      const mockProjects = [
        {
          id: 99,
          uuid: 'project-uuid-99',
          name: 'Jannat City Luxury Apartments',
        },
      ];

      mockCustomerProfileModel.findOne.mockResolvedValue(mockCustomer);
      mockFlatLandBookingModel.findAll.mockResolvedValue(mockBookings);
      mockProjectModel.findAll.mockResolvedValue(mockProjects);
      mockCrSaleAgreementModel.findAll.mockResolvedValue([]);
      mockCrInstallmentPaymentModel.findAll.mockResolvedValue([]);

      const result = await service.getCustomer360Profile(
        '085d3f64-d420-41af-99c0-389eb6ef7d14',
        { orgId: 36, isSuperAdmin: false },
      );

      expect(result.profile.customer_name).toBe('Anowar Hossain');
      expect(mockProjectModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            uuid: expect.anything(),
          }),
        }),
      );
      expect(result.bookings[0].project_name).toBe(
        'Jannat City Luxury Apartments',
      );
    });

    it('should throw NotFoundException if customer does not exist or org mismatch', async () => {
      mockCustomerProfileModel.findOne.mockResolvedValue(null);

      await expect(
        service.getCustomer360Profile('00000000-0000-0000-0000-000000000000', {
          orgId: 36,
          isSuperAdmin: false,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
