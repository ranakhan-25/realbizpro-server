import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ApprovalService } from './approval.service';
import { LamsApproval } from '../../../database/models/lams/approval.model';

describe('ApprovalService', () => {
  let service: ApprovalService;
  const mockModel = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 1, uuid: 'app-1', ...dto })),
    findAll: jest.fn().mockResolvedValue([{ id: 1, uuid: 'app-1', decision: 'approved' }]),
    findOne: jest.fn().mockImplementation(({ where }) => {
      if (where.uuid === 'app-1') {
        return Promise.resolve({
          id: 1,
          uuid: 'app-1',
          decision: 'approved',
          update: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
          destroy: jest.fn().mockResolvedValue(true),
        });
      }
      return Promise.resolve(null);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApprovalService,
        {
          provide: getModelToken(LamsApproval),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<ApprovalService>(ApprovalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create approval record', async () => {
    const res = await service.create({
      lead_id: 'lead-01',
      level: 'level_1',
      approver_name: 'Director Planning',
      decision: 'approved',
      stage: 'lead',
    });
    expect(res).toBeDefined();
    expect(res.decision).toBe('approved');
  });
});
