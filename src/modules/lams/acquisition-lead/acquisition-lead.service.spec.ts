import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AcquisitionLeadService } from './acquisition-lead.service';
import { AcquisitionLead } from '../../../database/models/lams/acquisition-lead.model';
import { LandOwner } from '../../../database/models/lams/land-owner.model';
import { LeadStageLog } from '../../../database/models/lams/lead-stage-log.model';

describe('AcquisitionLeadService', () => {
  let service: AcquisitionLeadService;

  const mockLeadInstance = {
    id: 'lead-uuid-1',
    uuid: 'lead-uuid-1',
    org_id: 'org-001',
    lead_code: 'LAD-2026-001',
    lead_title: 'Gulshan Plot 12',
    lead_status: 'Draft',
    update: jest.fn().mockImplementation((dto) => {
      Object.assign(mockLeadInstance, dto);
      return Promise.resolve(mockLeadInstance);
    }),
    destroy: jest.fn().mockResolvedValue(true),
  };

  const mockLeadModel = {
    count: jest.fn().mockResolvedValue(0),
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ ...mockLeadInstance, ...dto })),
    findAll: jest.fn().mockResolvedValue([mockLeadInstance]),
    findOne: jest.fn().mockImplementation(({ where }) => {
      if (where.id === 'lead-uuid-1') {
        return Promise.resolve(mockLeadInstance);
      }
      return Promise.resolve(null);
    }),
  };

  const mockLandOwnerModel = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'owner-1', ...dto })),
    update: jest.fn().mockResolvedValue([1]),
  };

  const mockStageLogModel = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'log-1', ...dto })),
    findAll: jest.fn().mockResolvedValue([
      { id: 'log-1', lead_id: 'lead-uuid-1', from_stage: 'Initial', to_stage: 'Draft', remarks: 'Created' },
      { id: 'log-2', lead_id: 'lead-uuid-1', from_stage: 'Draft', to_stage: 'Qualified', remarks: 'Qualified' },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AcquisitionLeadService,
        {
          provide: getModelToken(AcquisitionLead),
          useValue: mockLeadModel,
        },
        {
          provide: getModelToken(LandOwner),
          useValue: mockLandOwnerModel,
        },
        {
          provide: getModelToken(LeadStageLog),
          useValue: mockStageLogModel,
        },
      ],
    }).compile();

    service = module.get<AcquisitionLeadService>(AcquisitionLeadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create lead with auto generated code and initial stage log', async () => {
      const res = await service.create({
        org_id: 'org-001',
        lead_title: 'Gulshan Plot 12',
        land_type: 'Commercial',
        land_area: 10,
        owner_name: 'Karim Ullah',
        owner_phone: '01700000000',
      });

      expect(res).toBeDefined();
      expect(mockLeadModel.create).toHaveBeenCalled();
      expect(mockLandOwnerModel.create).toHaveBeenCalled();
      expect(mockStageLogModel.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if org_id is missing', async () => {
      await expect(
        service.create({
          lead_title: 'Gulshan Plot 12',
          land_type: 'Commercial',
          land_area: 10,
        } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('advanceStage', () => {
    it('should advance lead stage and record audit log', async () => {
      const res = await service.advanceStage(
        'lead-uuid-1',
        { to_stage: 'Qualified', remarks: 'Verified legal status' },
        { orgId: 'org-001', name: 'Inspector' },
      );

      expect(res).toBeDefined();
      expect(mockStageLogModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          from_stage: 'Draft',
          to_stage: 'Qualified',
          remarks: 'Verified legal status',
        }),
      );
      expect(mockLeadInstance.update).toHaveBeenCalledWith({ lead_status: 'Qualified' });
    });

    it('should throw NotFoundException if lead not found', async () => {
      await expect(
        service.advanceStage('invalid-uuid', { to_stage: 'Qualified' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('qualifyLead', () => {
    it('should qualify lead via qualifyLead helper', async () => {
      const res = await service.qualifyLead('lead-uuid-1', { orgId: 'org-001' });
      expect(res).toBeDefined();
      expect(mockLeadInstance.update).toHaveBeenCalledWith({ lead_status: 'Qualified' });
    });
  });

  describe('rejectLead', () => {
    it('should reject lead via rejectLead helper', async () => {
      const res = await service.rejectLead('lead-uuid-1', { remarks: 'Title dispute' }, { orgId: 'org-001' });
      expect(res).toBeDefined();
      expect(mockLeadInstance.update).toHaveBeenCalledWith({ lead_status: 'Rejected' });
    });
  });

  describe('getStageLogs', () => {
    it('should return stage logs for a lead', async () => {
      const logs = await service.getStageLogs('lead-uuid-1', 'org-001');
      expect(logs).toHaveLength(2);
      expect(logs[0].from_stage).toBe('Initial');
      expect(logs[1].to_stage).toBe('Qualified');
    });
  });
});
