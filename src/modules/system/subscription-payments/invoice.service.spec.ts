import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { InvoiceService } from './invoice.service';
import {
  SubscriptionPaymentStatus,
  SysSubscriptionPayment,
} from '../../../database/models/system/sys_subscription_payment.model';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let mockPaymentModel: {
    findOne: jest.Mock;
  };

  beforeEach(async () => {
    mockPaymentModel = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getModelToken(SysSubscriptionPayment),
          useValue: mockPaymentModel,
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPaymentForInvoice', () => {
    it('retrieves payment with relations when tranId matches', async () => {
      const mockPayment = {
        id: 1,
        tranId: 'RB_1700000000_TEST1',
        amount: 2500,
        currency: 'BDT',
        status: SubscriptionPaymentStatus.VALID,
        billingCycle: 'monthly',
        durationDays: 30,
        plan: { name: 'Growth Tier', code: 'GROWTH' },
        organization: { name: 'Acme Corp', code: 'ACME' },
      };

      mockPaymentModel.findOne.mockResolvedValue(mockPayment);

      const result = await service.getPaymentForInvoice('RB_1700000000_TEST1');
      expect(result).toBe(mockPayment);
      expect(mockPaymentModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { tranId: 'RB_1700000000_TEST1' },
        }),
      );
    });

    it('throws NotFoundException when transaction does not exist', async () => {
      mockPaymentModel.findOne.mockResolvedValue(null);

      await expect(
        service.getPaymentForInvoice('NON_EXISTENT_TXN'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('generateInvoiceHtml', () => {
    it('generates well formed printable HTML invoice document', () => {
      const mockPayment: any = {
        tranId: 'RB_999999999_INV01',
        amount: 1500,
        currency: 'BDT',
        billingCycle: 'yearly',
        durationDays: 365,
        status: SubscriptionPaymentStatus.VALID,
        paymentInitiatedAt: new Date('2026-01-01T10:00:00Z'),
        paymentCompletedAt: new Date('2026-01-01T10:05:00Z'),
        valId: 'VAL_TEST_123',
        bankTranId: 'BANK_TXN_456',
        cardType: 'BKASH',
        cardBrand: 'BKash Mobile Banking',
        plan: {
          name: 'Enterprise Cloud',
          code: 'ENT_PRO',
        },
        organization: {
          name: 'Neurosoft Technologies',
          code: 'NST',
          email: 'admin@neurosoft.com',
          phone: '01711111111',
          address: 'Gulshan, Dhaka',
          subscriptionStartDate: new Date('2026-01-01'),
          subscriptionEndDate: new Date('2027-01-01'),
        },
        user: {
          name: 'Sakib Administrator',
        },
      };

      const html = service.generateInvoiceHtml(mockPayment);

      expect(typeof html).toBe('string');
      expect(html).toContain('RealBiz Pro');
      expect(html).toContain('INV-RB_999999999_INV01');
      expect(html).toContain('Neurosoft Technologies');
      expect(html).toContain('Enterprise Cloud');
      expect(html).toContain('1500.00');
      expect(html).toContain('VALID');
      expect(html).toContain('BKASH');
      expect(html).toContain('Yearly (365 Days)');
    });
  });
});
