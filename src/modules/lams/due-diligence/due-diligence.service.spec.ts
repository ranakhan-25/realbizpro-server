import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { DueDiligenceService } from './due-diligence.service';
import { LamsDueDiligence } from '../../../database/models/lams/due-diligence.model';

describe('DueDiligenceService', () => {
  let service: DueDiligenceService;
  const mockModel = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 1, uuid: 'dd-1', ...dto })),
    findAll: jest.fn().mockResolvedValue([{ id: 1, uuid: 'dd-1', score: 90 }]),
    findOne: jest.fn().mockImplementation(({ where }) => {
      if (where.uuid === 'dd-1') {
        return Promise.resolve({
          id: 1,
          uuid: 'dd-1',
          score: 90,
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
        DueDiligenceService,
        {
          provide: getModelToken(LamsDueDiligence),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<DueDiligenceService>(DueDiligenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create due diligence record', async () => {
    const res = await service.create({
      lead_id: 'lead-01',
      score: 90,
      status: 'approved',
      surveyor_name: 'Engr. Kamal',
    });
    expect(res).toBeDefined();
    expect(res.score).toBe(90);
  });
});
