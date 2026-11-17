import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { BadRequestException } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { MovementService } from './movement.service';
import { InvMovement } from '../../../database/models/inventory/inv-movement.model';
import { InvStockBalance } from '../../../database/models/inventory/stock-balance.model';
import { InvItem } from '../../../database/models/inventory/inv_item.model';
import { InvWarehouse } from '../../../database/models/inventory/warehouse.model';

describe('MovementService', () => {
  let service: MovementService;

  const mockMovement = {
    id: 'mov-1',
    uuid: 'mov-1',
    org_id: 'org-001',
    movement_no: 'MOV-2026-00001',
    movement_type: 'opening',
    quantity: 500,
    unit_rate: 550,
  };

  const mockBalance = {
    id: 'bal-1',
    uuid: 'bal-1',
    org_id: 'org-001',
    warehouse_id: 1,
    item_id: 'item-1',
    current_qty: 500,
    available_qty: 500,
    reserved_qty: 0,
    avg_cost: 550,
    update: jest.fn().mockImplementation((dto) => {
      Object.assign(mockBalance, dto);
      return Promise.resolve(mockBalance);
    }),
  };

  const mockMovementModel = {
    count: jest.fn().mockResolvedValue(0),
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ ...mockMovement, ...dto })),
    findAll: jest.fn().mockResolvedValue([mockMovement]),
  };

  const mockBalanceModel = {
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ ...mockBalance, ...dto })),
    findAll: jest.fn().mockResolvedValue([mockBalance]),
  };

  const mockItemModel = {
    findAll: jest.fn().mockResolvedValue([{ id: 'item-1', uuid: 'item-1', name: 'Cement 50kg' }]),
  };

  const mockWarehouseModel = {
    findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Main Depot' }]),
  };

  const mockTransaction = {
    commit: jest.fn().mockResolvedValue(null),
    rollback: jest.fn().mockResolvedValue(null),
    LOCK: { UPDATE: 'UPDATE' },
  };

  const mockSequelize = {
    transaction: jest.fn().mockResolvedValue(mockTransaction),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovementService,
        {
          provide: getModelToken(InvMovement),
          useValue: mockMovementModel,
        },
        {
          provide: getModelToken(InvStockBalance),
          useValue: mockBalanceModel,
        },
        {
          provide: getModelToken(InvItem),
          useValue: mockItemModel,
        },
        {
          provide: getModelToken(InvWarehouse),
          useValue: mockWarehouseModel,
        },
        {
          provide: Sequelize,
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get<MovementService>(MovementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('recordMovement', () => {
    it('should record opening stock and initialize balance', async () => {
      const res = await service.recordMovement('opening', {
        org_id: 'org-001',
        warehouse_id: 1,
        item_id: 'item-1',
        quantity: 500,
        unit_rate: 550,
      });

      expect(res).toBeDefined();
      expect(mockMovementModel.create).toHaveBeenCalled();
      expect(mockBalanceModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          org_id: 'org-001',
          warehouse_id: 1,
          item_id: 'item-1',
          current_qty: 500,
        }),
        expect.anything(),
      );
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('should throw BadRequestException if org_id is missing', async () => {
      await expect(
        service.recordMovement('opening', {
          warehouse_id: 1,
          item_id: 'item-1',
          quantity: 100,
        } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if quantity <= 0', async () => {
      await expect(
        service.recordMovement('opening', {
          org_id: 'org-001',
          warehouse_id: 1,
          item_id: 'item-1',
          quantity: 0,
        } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should record consumption and update balance when existing balance exists', async () => {
      mockBalanceModel.findOne.mockResolvedValueOnce(mockBalance);

      const res = await service.recordMovement('consumption', {
        org_id: 'org-001',
        warehouse_id: 1,
        item_id: 'item-1',
        quantity: 25,
        unit_rate: 550,
      });

      expect(res).toBeDefined();
      expect(mockBalance.update).toHaveBeenCalledWith(
        expect.objectContaining({
          current_qty: 475,
          available_qty: 475,
        }),
        expect.anything(),
      );
    });
  });

  describe('getStockBalances', () => {
    it('should query stock balances', async () => {
      const balances = await service.getStockBalances({ org_id: 'org-001' });
      expect(balances).toHaveLength(1);
    });
  });

  describe('getLedger', () => {
    it('should query material ledger', async () => {
      const ledger = await service.getLedger({ org_id: 'org-001' });
      expect(ledger).toHaveLength(1);
    });
  });
});
