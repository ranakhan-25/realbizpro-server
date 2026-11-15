import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PlansService } from './plans.service';
import { SysPlan, PlanBillingCycle, PlanStatus } from '@/database/models/system/sys_plan.model';

describe('PlansService', () => {
  let service: PlansService;
  let mockPlanModel: any;

  const mockPlanInstance = (data: any) => ({
    ...data,
    get: jest.fn().mockImplementation((options?: { plain?: boolean }) => {
      if (options?.plain) {
        return { ...data };
      }
      return data;
    }),
    update: jest.fn().mockImplementation(async (updates: any) => {
      Object.assign(data, updates);
      return data;
    }),
    destroy: jest.fn().mockResolvedValue(true),
  });

  const samplePlanData = {
    id: 1,
    uuid: '18a7e95a-d4ed-46b6-bf02-4fd0691f1274',
    name: 'Free Trial',
    code: 'TRIAL',
    description: '14 day evaluation plan',
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: '$',
    billingCycle: PlanBillingCycle.MONTHLY,
    durationDays: 14,
    trialDays: 14,
    maxUsers: 5,
    maxProjects: 3,
    maxStorageMb: 2048,
    features: ['crm', 'projects'],
    status: PlanStatus.ACTIVE,
    subscribersCount: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    mockPlanModel = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlansService,
        {
          provide: getModelToken(SysPlan),
          useValue: mockPlanModel,
        },
      ],
    }).compile();

    service = module.get<PlansService>(PlansService);
  });

  describe('findAll', () => {
    it('returns a list of mapped plan response DTOs', async () => {
      const planItem = mockPlanInstance({ ...samplePlanData });
      mockPlanModel.findAll.mockResolvedValue([planItem]);

      const result = await service.findAll();

      expect(mockPlanModel.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Free Trial');
      expect(result[0].code).toBe('TRIAL');
      expect(result[0].monthlyPrice).toBe(0);
    });

    it('filters by status and searches by keyword', async () => {
      mockPlanModel.findAll.mockResolvedValue([]);

      await service.findAll({ status: 'active', search: 'Pro' });

      expect(mockPlanModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.any(Object),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('retrieves plan by numeric identifier', async () => {
      const planItem = mockPlanInstance({ ...samplePlanData });
      mockPlanModel.findOne.mockResolvedValue(planItem);

      const result = await service.findOne(1);

      expect(mockPlanModel.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result.id).toBe(1);
      expect(result.code).toBe('TRIAL');
    });

    it('retrieves plan by UUID string identifier', async () => {
      const planItem = mockPlanInstance({ ...samplePlanData });
      mockPlanModel.findOne.mockResolvedValue(planItem);

      const result = await service.findOne('18a7e95a-d4ed-46b6-bf02-4fd0691f1274');

      expect(mockPlanModel.findOne).toHaveBeenCalledWith({
        where: { uuid: '18a7e95a-d4ed-46b6-bf02-4fd0691f1274' },
      });
      expect(result.uuid).toBe('18a7e95a-d4ed-46b6-bf02-4fd0691f1274');
    });

    it('throws NotFoundException when plan does not exist', async () => {
      mockPlanModel.findOne.mockResolvedValue(null);

      await expect(service.findOne('missing-uuid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    const createDto = {
      name: 'Starter Tier',
      code: 'STARTER',
      description: 'Starter tier description',
      monthlyPrice: 29.0,
      yearlyPrice: 290.0,
      currency: '$',
      billingCycle: PlanBillingCycle.MONTHLY,
      durationDays: 30,
      trialDays: 7,
      maxUsers: 10,
      maxProjects: 5,
      maxStorageMb: 5120,
      status: PlanStatus.ACTIVE,
    };

    it('creates a new subscription plan package successfully', async () => {
      mockPlanModel.findOne.mockResolvedValue(null);
      const createdInstance = mockPlanInstance({
        id: 2,
        uuid: 'new-uuid',
        ...createDto,
        subscribersCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      mockPlanModel.create.mockResolvedValue(createdInstance);

      const result = await service.create(createDto as any);

      expect(mockPlanModel.findOne).toHaveBeenCalledWith({
        where: { code: 'STARTER' },
      });
      expect(mockPlanModel.create).toHaveBeenCalledWith(createDto);
      expect(result.code).toBe('STARTER');
      expect(result.monthlyPrice).toBe(29.0);
    });

    it('throws ConflictException if plan code is already registered', async () => {
      mockPlanModel.findOne.mockResolvedValue(mockPlanInstance({ ...samplePlanData }));

      await expect(
        service.create({ ...createDto, code: 'TRIAL' } as any),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('updates plan attributes successfully', async () => {
      const planItem = mockPlanInstance({ ...samplePlanData });
      mockPlanModel.findOne.mockResolvedValue(planItem);

      const result = await service.update('18a7e95a-d4ed-46b6-bf02-4fd0691f1274', {
        name: 'Updated Free Plan',
        monthlyPrice: 15,
        yearlyPrice: 150,
      });

      expect(planItem.update).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Updated Free Plan',
          monthlyPrice: 15,
          yearlyPrice: 150,
        }),
      );
      expect(result.name).toBe('Updated Free Plan');
    });

    it('preserves zero priced plans without converting zero to null or NaN', async () => {
      const planItem = mockPlanInstance({ ...samplePlanData, monthlyPrice: 10, yearlyPrice: 100 });
      mockPlanModel.findOne.mockResolvedValue(planItem);

      await service.update('18a7e95a-d4ed-46b6-bf02-4fd0691f1274', {
        monthlyPrice: 0,
        yearlyPrice: 0,
      });

      expect(planItem.update).toHaveBeenCalledWith(
        expect.objectContaining({
          monthlyPrice: 0,
          yearlyPrice: 0,
        }),
      );
    });

    it('sanitizes null monthlyPrice and yearlyPrice to 0 preventing notNull violations', async () => {
      const planItem = mockPlanInstance({ ...samplePlanData });
      mockPlanModel.findOne.mockResolvedValue(planItem);

      await service.update('18a7e95a-d4ed-46b6-bf02-4fd0691f1274', {
        monthlyPrice: null as any,
        yearlyPrice: null as any,
      });

      expect(planItem.update).toHaveBeenCalledWith(
        expect.objectContaining({
          monthlyPrice: 0,
          yearlyPrice: 0,
        }),
      );
    });

    it('ignores undefined and NaN properties during partial updates', async () => {
      const planItem = mockPlanInstance({ ...samplePlanData });
      mockPlanModel.findOne.mockResolvedValue(planItem);

      await service.update('18a7e95a-d4ed-46b6-bf02-4fd0691f1274', {
        name: 'Valid Name',
        description: undefined,
        monthlyPrice: NaN as any,
      });

      expect(planItem.update).toHaveBeenCalledWith({
        name: 'Valid Name',
      });
    });

    it('throws NotFoundException when updating non existent plan', async () => {
      mockPlanModel.findOne.mockResolvedValue(null);

      await expect(
        service.update('missing-uuid', { name: 'Cannot Update' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ConflictException when updating code to an existing code used by another plan', async () => {
      const planItem = mockPlanInstance({ ...samplePlanData, id: 1, code: 'PLAN_A' });
      const conflictItem = mockPlanInstance({ ...samplePlanData, id: 2, code: 'PLAN_B' });

      mockPlanModel.findOne
        .mockResolvedValueOnce(planItem)
        .mockResolvedValueOnce(conflictItem);

      await expect(
        service.update(1, { code: 'PLAN_B' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('soft deletes plan and returns confirmation message', async () => {
      const planItem = mockPlanInstance({ ...samplePlanData });
      mockPlanModel.findOne.mockResolvedValue(planItem);

      const result = await service.remove(1);

      expect(planItem.destroy).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Plan "Free Trial" successfully archived',
        id: 1,
      });
    });

    it('throws NotFoundException when archiving a missing plan', async () => {
      mockPlanModel.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
