import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { CustomerServiceCommunicationService } from './customer-service-communication.service';
import { CsCommunicationLog } from 'src/database/models/customer-service/cs_communication_log.model';
import { CsSiteVisitAppointment } from 'src/database/models/customer-service/cs_site_visit_appointment.model';
import { CsCustomerFeedback } from 'src/database/models/customer-service/cs_customer_feedback.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { FlatLandBooking } from 'src/database/models/projects/flat-land-booking/pr_flat_land_booking.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { SysNotification } from 'src/database/models/system/sys_notification.model';
import {
  CommChannel,
  CommType,
  CommStatus,
  VisitPurpose,
  VisitStatus,
  SurveyType,
  FeedbackFollowUpStatus,
} from 'src/database/models/customer-service/cs_communication.types';

describe('CustomerServiceCommunicationService Unit Tests', () => {
  let service: CustomerServiceCommunicationService;

  const mockUser = {
    id: 6,
    sub: 6,
    username: 'test_admin',
    isSuperUser: true,
    roles: ['super-admin'],
    orgId: 1,
  };

  const mockCommLogModel: any = {
    findAndCountAll: jest.fn().mockResolvedValue({ rows: [], count: 0 }),
    findOne: jest.fn().mockResolvedValue(null),
    count: jest.fn().mockResolvedValue(5),
    create: jest.fn().mockImplementation((dto) =>
      Promise.resolve({
        id: 101,
        uuid: '00000000-0000-0000-0000-000000000101',
        commNo: 'MSG-2026-1001',
        customerName: dto.customerName || 'Test Customer',
        phone: dto.phone,
        email: dto.email,
        unit: dto.unit,
        projectName: dto.projectName,
        channel: dto.channel || CommChannel.SMS,
        type: dto.type || CommType.PAYMENT_REMINDER,
        content: dto.content,
        status: dto.status || CommStatus.DELIVERED,
        sentAt: new Date(),
        sentBy: dto.sentBy || 'Tester',
        createdAt: new Date(),
      }),
    ),
    sequelize: {
      query: jest.fn().mockResolvedValue([[{ num: 1001 }]]),
    },
  };

  const mockVisitModel: any = {
    findAndCountAll: jest.fn().mockResolvedValue({ rows: [], count: 0 }),
    findOne: jest.fn().mockResolvedValue(null),
    count: jest.fn().mockResolvedValue(3),
    create: jest.fn().mockImplementation((dto) =>
      Promise.resolve({
        id: 201,
        uuid: '00000000-0000-0000-0000-000000000201',
        visitNo: 'VST-2026-101',
        customerName: dto.customerName,
        phone: dto.phone,
        unit: dto.unit,
        projectName: dto.projectName,
        visitPurpose: dto.visitPurpose,
        appointmentDate: dto.appointmentDate,
        timeSlot: dto.timeSlot,
        assignedEscort: dto.assignedEscort,
        safetyPpeRequired: dto.safetyPpeRequired,
        status: VisitStatus.SCHEDULED,
        customerNotes: dto.customerNotes,
      }),
    ),
    sequelize: {
      query: jest.fn().mockResolvedValue([[{ num: 101 }]]),
    },
  };

  const mockFeedbackModel: any = {
    findAndCountAll: jest.fn().mockResolvedValue({ rows: [], count: 0 }),
    findOne: jest.fn().mockResolvedValue(null),
    count: jest.fn().mockResolvedValue(2),
    findAll: jest.fn().mockResolvedValue([
      { csatScore: 5, npsScore: 10, npsCategory: 'Promoter', followUpStatus: 'Satisfied - Closed' },
      { csatScore: 3, npsScore: 5, npsCategory: 'Detractor', followUpStatus: 'Escalated to CX Head' },
    ]),
    create: jest.fn().mockImplementation((dto) =>
      Promise.resolve({
        id: 301,
        uuid: '00000000-0000-0000-0000-000000000301',
        feedbackNo: 'CSAT-2026-101',
        customerName: dto.customerName,
        phone: dto.phone,
        unit: dto.unit,
        projectName: dto.projectName,
        surveyType: dto.surveyType,
        csatScore: dto.csatScore,
        npsScore: dto.npsScore,
        npsCategory: dto.npsCategory,
        comments: dto.comments,
        followUpStatus: dto.followUpStatus,
        assignedOfficer: dto.assignedOfficer,
        submittedAt: new Date(),
      }),
    ),
    sequelize: {
      query: jest.fn().mockResolvedValue([[{ num: 101 }]]),
    },
  };

  const mockProjectModel = {
    findAll: jest.fn().mockResolvedValue([
      { uuid: 'proj-1', name: 'Hena Heights', code: 'PRJ-001', status: 'ACTIVE' },
    ]),
  };

  const mockBookingModel = {
    findAll: jest.fn().mockResolvedValue([]),
  };

  const mockUserModel = {
    findAll: jest.fn().mockResolvedValue([
      { id: 1, uuid: 'user-1', name: 'Engr. Monirul', email: 'monirul@example.com' },
    ]),
  };

  const mockNotificationModel = {
    create: jest.fn().mockResolvedValue({ id: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerServiceCommunicationService,
        { provide: getModelToken(CsCommunicationLog), useValue: mockCommLogModel },
        { provide: getModelToken(CsSiteVisitAppointment), useValue: mockVisitModel },
        { provide: getModelToken(CsCustomerFeedback), useValue: mockFeedbackModel },
        { provide: getModelToken(Project), useValue: mockProjectModel },
        { provide: getModelToken(FlatLandBooking), useValue: mockBookingModel },
        { provide: getModelToken(SysUser), useValue: mockUserModel },
        { provide: getModelToken(SysNotification), useValue: mockNotificationModel },
      ],
    }).compile();

    service = module.get<CustomerServiceCommunicationService>(
      CustomerServiceCommunicationService,
    );
  });

  describe('Dropdowns & Overview', () => {
    it('should return dropdown options for channels, purposes and users', async () => {
      const res = await service.getDropdowns(mockUser);
      expect(res.success).toBe(true);
      expect(res.channels).toContain('SMS');
      expect(res.visit_purposes).toContain('Milestone Inspection');
      expect(res.survey_types).toContain('Handover CSAT');
      expect(Array.isArray(res.projects)).toBe(true);
    });

    it('should return cross-channel communication overview metrics', async () => {
      const res = await service.getOverview(undefined, mockUser);
      expect(res.success).toBe(true);
      expect(res.kpis.overall_csat_score).toBeDefined();
      expect(res.kpis.net_promoter_score).toBeDefined();
      expect(Array.isArray(res.actionable_directives)).toBe(true);
    });
  });

  describe('Inbox & Reminders', () => {
    it('should return paginated message list with tab counts', async () => {
      const res = await service.listMessages({}, mockUser);
      expect(res.success).toBe(true);
      expect(Array.isArray(res.items)).toBe(true);
      expect(res.items.length).toBeGreaterThan(0);
      expect(res.tab_counts).toBeDefined();
    });

    it('should get baseline message detail when not in database', async () => {
      const res = await service.getMessage('COMM-101', mockUser);
      expect(res.success).toBe(true);
      expect(res.commNo).toBe('MSG-2026-8801');
    });

    it('should send a new communication message and create notification', async () => {
      const res = await service.sendMessage(
        {
          customer_name: 'Engr. Tanvir Ahmed',
          phone: '+880 1711-223344',
          unit: 'Apt A-7',
          channel: CommChannel.SMS,
          type: CommType.PAYMENT_REMINDER,
          content: 'Payment reminder content',
        },
        mockUser,
      );
      expect(res.success).toBe(true);
      expect(res.data.commNo).toBe('MSG-2026-1001');
      expect(mockNotificationModel.create).toHaveBeenCalled();
    });

    it('should resend an existing message', async () => {
      const res = await service.resendMessage('COMM-101', mockUser);
      expect(res.success).toBe(true);
      expect(res.resent_at).toBeDefined();
    });
  });

  describe('Site Visits & Appointments', () => {
    it('should return site visits list with tab counts', async () => {
      const res = await service.listVisits({}, mockUser);
      expect(res.success).toBe(true);
      expect(Array.isArray(res.items)).toBe(true);
      expect(res.items.length).toBeGreaterThan(0);
      expect(res.tab_counts).toBeDefined();
    });

    it('should book a new site appointment', async () => {
      const res = await service.bookVisit(
        {
          customer_name: 'Barrister Shahed',
          phone: '+880 1914-556677',
          unit: 'C-9',
          visit_purpose: VisitPurpose.SNAGGING_WALKTHROUGH,
          appointment_date: '2026-11-20',
          time_slot: '11:00 AM - 12:30 PM',
          assigned_escort: 'Engr. Monirul',
        },
        mockUser,
      );
      expect(res.success).toBe(true);
      expect(res.data.visitNo).toBe('VST-2026-101');
    });
  });

  describe('Customer Feedback & CSAT Surveys', () => {
    it('should return feedbacks list with NPS metrics', async () => {
      const res = await service.listFeedbacks({}, mockUser);
      expect(res.success).toBe(true);
      expect(Array.isArray(res.items)).toBe(true);
      expect(res.items.length).toBeGreaterThan(0);
      expect(res.tab_counts).toBeDefined();
    });

    it('should record new customer feedback and determine promoter/detractor', async () => {
      const res = await service.recordFeedback(
        {
          customer_name: 'Dr. Nazmul Huda',
          unit: 'B-4',
          survey_type: SurveyType.HANDOVER_CSAT,
          csat_score: 5,
          nps_score: 10,
          comments: 'Great service!',
        },
        mockUser,
      );
      expect(res.success).toBe(true);
      expect(res.data.npsCategory).toBe('Promoter');
      expect(res.data.feedbackNo).toBe('CSAT-2026-101');
    });
  });
});
