import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { LegalVerificationService } from './legal-verification.service';
import { LamsLegalVerification } from '../../../database/models/lams/legal-verification.model';

describe('LegalVerificationService', () => {
  let service: LegalVerificationService;
  const mockModel = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 1, uuid: 'lv-1', ...dto })),
    findAll: jest.fn().mockResolvedValue([{ id: 1, uuid: 'lv-1', lawyer_name: 'Advocate Hasan' }]),
    findOne: jest.fn().mockImplementation(({ where }) => {
      if (where.uuid === 'lv-1') {
        return Promise.resolve({
          id: 1,
          uuid: 'lv-1',
          lawyer_name: 'Advocate Hasan',
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
        LegalVerificationService,
        {
          provide: getModelToken(LamsLegalVerification),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<LegalVerificationService>(LegalVerificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create legal verification', async () => {
    const res = await service.create({
      lead_id: 'lead-01',
      lawyer_name: 'Advocate Hasan',
      title_clear: true,
      mutation_ok: true,
      tax_clear: true,
      status: 'verified',
    });
    expect(res).toBeDefined();
    expect(res.lawyer_name).toBe('Advocate Hasan');
  });
});
