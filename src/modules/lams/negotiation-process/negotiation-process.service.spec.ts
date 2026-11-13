import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { NegotiationProcessService } from './negotiation-process.service';
import { NegotiationProcess } from '../../../database/models/lams/negotiation-process.model';

describe('NegotiationProcessService', () => {
  let service: NegotiationProcessService;

  const mockInstance = {
    id: 'neg-1',
    uuid: 'neg-1',
    org_id: 'org-001',
    lead_id: 'lead-1',
    round_no: 1,
    offered_price: 45000000,
    counter_amount: 50000000,
    gap_amount: 5000000,
    update: jest.fn().mockImplementation((dto) => {
      Object.assign(mockInstance, dto);
      return Promise.resolve(mockInstance);
    }),
    destroy: jest.fn().mockResolvedValue(true),
  };

  const mockModel = {
    count: jest.fn().mockResolvedValue(0),
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ ...mockInstance, ...dto })),
    findAll: jest.fn().mockResolvedValue([mockInstance]),
    findOne: jest.fn().mockImplementation(({ where }) => {
      if (where.id === 'neg-1' || where.uuid === 'neg-1') {
        return Promise.resolve(mockInstance);
      }
      return Promise.resolve(null);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NegotiationProcessService,
        {
          provide: getModelToken(NegotiationProcess),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<NegotiationProcessService>(NegotiationProcessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should calculate price gap and auto assign round number', async () => {
      const res = await service.create({
        org_id: 'org-001',
        lead_id: 'lead-1',
        offered_price: 45000000,
        counter_amount: 50000000,
        negotiator: 'Tanvir Ahmed',
      });

      expect(res).toBeDefined();
      expect(mockModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          round_no: 1,
          gap_amount: 5000000,
          org_id: 'org-001',
        }),
      );
    });

    it('should throw BadRequestException if org_id is missing', async () => {
      await expect(
        service.create({
          lead_id: 'lead-1',
          offered_price: 45000000,
        } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return negotiation rounds list', async () => {
      const list = await service.findAll({ lead_id: 'lead-1', org_id: 'org-001' });
      expect(list).toHaveLength(1);
      expect(list[0].round_no).toBe(1);
    });
  });

  describe('update', () => {
    it('should update negotiation meeting', async () => {
      const updated = await service.update('neg-1', { offered_price: 47000000 }, { orgId: 'org-001' });
      expect(updated).toBeDefined();
      expect(mockInstance.update).toHaveBeenCalled();
    });
  });
});
