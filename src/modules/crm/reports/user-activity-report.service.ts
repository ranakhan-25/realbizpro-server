import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CommunicationStatus, CommunicationStatusState } from 'src/database/models/crm/configuration/crm-communication-status.model';
import { LeadStage } from 'src/database/models/crm/configuration/crm-lead-stage.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { LeadVisitStatus } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { FlatLandBooking } from 'src/database/models/projects/flat-land-booking/pr_flat_land_booking.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { QueryUserActivityReportDto } from './dto/query-user-activity-report.dto';

const VISIT_TYPES = ['visit', 'task_visit'];
const FOLLOWUP_TYPES = ['followup', 'follow_up', 'follow-up'];
const ALL_TYPES = ['call', ...FOLLOWUP_TYPES, ...VISIT_TYPES, 'note'];
const LEAD_STAGE_KEYS = [
  { key: 'withoutStage', aliases: [] }, { key: 'new', aliases: ['new'] }, { key: 'lead', aliases: ['lead'] },
  { key: 'prospect', aliases: ['prospect'] }, { key: 'highProspect', aliases: ['highprospect', 'high prospect'] }, { key: 'potential', aliases: ['potential'] },
];

@Injectable()
export class UserActivityReportService {
  constructor(
    @InjectModel(Lead) private readonly leads: typeof Lead,
    @InjectModel(LeadActivity) private readonly activities: typeof LeadActivity,
    @InjectModel(LeadStage) private readonly stages: typeof LeadStage,
    @InjectModel(LeadVisitStatus) private readonly visitStatuses: typeof LeadVisitStatus,
    @InjectModel(CommunicationStatus) private readonly communicationStatuses: typeof CommunicationStatus,
    @InjectModel(FlatLandBooking) private readonly bookings: typeof FlatLandBooking,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
  ) {}

  async dropdowns() {
    const [users, leadStages, visitStatuses, communicationStatuses] = await Promise.all([
      this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'name', 'userCode'], order: [['name', 'ASC']] }),
      this.stages.findAll({ where: { isActive: true }, attributes: ['id', 'uuid', 'name'], order: [['sortOrder', 'ASC'], ['name', 'ASC']] }),
      this.visitStatuses.findAll({ attributes: ['id', 'uuid', 'name', 'color'], order: [['name', 'ASC']] }),
      this.communicationStatuses.findAll({ where: { status: CommunicationStatusState.ACTIVE }, attributes: ['uuid', 'name'], order: [['name', 'ASC']] }),
    ]);
    return { users, leadStages, visitStatuses, communicationStatuses };
  }

  async report(query: QueryUserActivityReportDto) {
    const leadWhere: any = {};
    if (query.userId) leadWhere.assignedTo = query.userId;
    if (query.leadStageId) leadWhere.leadStageId = query.leadStageId;
    const dateWhere: any = {
      ...(query.dateFrom ? { [Op.gte]: query.dateFrom } : {}),
      ...(query.dateTo ? { [Op.lte]: query.dateTo } : {}),
    };
    if (query.dateFrom || query.dateTo) leadWhere.leadDate = dateWhere;

    const activityWhere: any = { activityType: { [Op.in]: ALL_TYPES } };
    if (query.dateFrom || query.dateTo) activityWhere.activityDate = {
      ...(query.dateFrom ? { [Op.gte]: new Date(`${query.dateFrom}T00:00:00.000Z`) } : {}),
      ...(query.dateTo ? { [Op.lte]: new Date(`${query.dateTo}T23:59:59.999Z`) } : {}),
    };
    if (query.visitStatusId) activityWhere.visitStatusId = query.visitStatusId;

    const [leads, activities, users, bookings, statuses] = await Promise.all([
      this.leads.findAll({ where: leadWhere, attributes: ['id', 'clientName', 'phone', 'assignedTo', 'status', 'leadStageId'], include: [{ association: 'stage', required: false, attributes: ['id', 'name'] }, { association: 'activities', required: false, attributes: ['id'] }] }),
      this.activities.findAll({ where: activityWhere, attributes: ['id', 'leadId', 'activityType', 'activityDate', 'summary', 'discussionPoints', 'nextFollowupDate', 'visitPlaceId', 'visitStatusId', 'feedback', 'conductedBy', 'createdBy'], include: [{ association: 'lead', required: true, attributes: ['id', 'clientName', 'assignedTo', 'leadStageId'], include: [{ association: 'stage', required: false, attributes: ['id', 'name'] }] }, { association: 'visitPlace', required: false, attributes: ['id', 'name'] }, { association: 'visitStatus', required: false, attributes: ['id', 'name'] }] }),
      this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'name'], order: [['name', 'ASC']] }),
      this.bookings.findAll({ where: query.dateFrom || query.dateTo ? { bookingDate: dateWhere } : {}, attributes: ['grandTotal', 'salesBy'] }),
      this.communicationStatuses.findAll({ where: { status: CommunicationStatusState.ACTIVE }, attributes: ['uuid', 'name'] }),
    ]);

    const leadIds = new Set(leads.map(lead => lead.id));
    const filteredActivities = activities.filter(activity => {
      if (!leadIds.has(activity.leadId)) return false;
      const actor = activity.conductedBy ?? activity.createdBy ?? activity.lead?.assignedTo;
      return !query.userId || actor === query.userId || activity.lead?.assignedTo === query.userId;
    });
    const userMap = new Map(users.map(user => [user.uuid, user.name]));
    const statusMap = new Map(statuses.map(status => [status.uuid, status.name]));
    const userName = (id?: string) => id ? (userMap.get(id) ?? id) : 'Unassigned';
    const page = query.page ?? 1;
    const limit = query.limit ?? 25;
    const rows = filteredActivities.slice((page - 1) * limit, page * limit).map((activity, index) => {
      const type = activity.activityType.toLowerCase();
      const actor = activity.conductedBy ?? activity.createdBy ?? activity.lead?.assignedTo;
      return { sl: (page - 1) * limit + index + 1, activityDate: activity.activityDate, user: userName(actor), userId: actor ?? null, customerName: activity.lead?.clientName ?? null, leadId: activity.leadId, activityType: activity.activityType, callLog: type === 'call' ? activity.summary : null, leadStage: activity.lead?.stage?.name ?? null, communicationStatus: statusMap.get(activity.discussionPoints ?? '') ?? activity.discussionPoints ?? null, comment: activity.discussionPoints ?? activity.summary ?? null, salesPossibility: null, visitPlace: activity.visitPlace?.name ?? null, visitStatus: activity.visitStatus?.name ?? null, visitNote: VISIT_TYPES.includes(type) ? activity.summary : null, nextFollowUpNote: activity.feedback ?? null, nextFollowupVisit: activity.nextFollowupDate ?? null };
    });

    const leadStageSummary = this.stageSummary(leads);
    const visitActivities = filteredActivities.filter(item => VISIT_TYPES.includes(item.activityType.toLowerCase()));
    const followups = filteredActivities.filter(item => FOLLOWUP_TYPES.includes(item.activityType.toLowerCase()));
    const completedFollowups = followups.filter(item => !item.nextFollowupDate).length;
    const bookingAmount = bookings.reduce((sum, booking) => sum + Number(booking.grandTotal ?? 0), 0);
    const dealsClosed = leads.filter(lead => ['converted', 'closed', 'won', 'booked'].includes((lead.status ?? '').toLowerCase())).length;

    return { data: { summaryCards: { totalLeads: leads.length, activeLeads: leads.filter(lead => (lead.status ?? 'active').toLowerCase() === 'active').length, junk: leads.filter(lead => (lead.status ?? '').toLowerCase() === 'junk').length, dealsClosed, bookingAmount }, leadStageSummary, visitStatusSummary: this.visitStatusSummary(visitActivities), visitSummary: { totalVisit: visitActivities.length, visitsPending: visitActivities.filter(item => !item.feedback).length, visitsCompleted: visitActivities.filter(item => ['visited', 'completed', 'complete'].includes((item.feedback ?? '').toLowerCase())).length, visitsCancelled: visitActivities.filter(item => ['cancel', 'canceled', 'cancelled'].includes((item.feedback ?? '').toLowerCase())).length }, followUpSummary: { totalFollowUps: followups.length, completedFollowUps: completedFollowups, pendingFollowUps: followups.length - completedFollowups }, activityRows: rows }, meta: { page, limit, totalRows: filteredActivities.length, totalPages: Math.max(1, Math.ceil(filteredActivities.length / limit)), dateFrom: query.dateFrom ?? null, dateTo: query.dateTo ?? null } };
  }

  private stageSummary(leads: Lead[]) { const result: any = {}; for (const item of LEAD_STAGE_KEYS) result[item.key] = item.key === 'withoutStage' ? leads.filter(lead => !lead.leadStageId).length : leads.filter(lead => item.aliases.some(alias => this.normalize(`${lead.stage?.name ?? ''} ${lead.status ?? ''} ${lead.leadType ?? ''}`).includes(this.normalize(alias)))).length; return result; }
  private visitStatusSummary(activities: LeadActivity[]) { const result: any = { canceled: 0, newSchedule: 0, rescheduled: 0, schedule: 0, visited: 0 }; for (const item of activities) { const value = this.normalize(item.visitStatus?.name ?? item.feedback ?? ''); if (['cancel', 'canceled', 'cancelled'].some(x => value === this.normalize(x))) result.canceled++; else if (value.includes('newschedule')) result.newSchedule++; else if (value.includes('reschedule')) result.rescheduled++; else if (value.includes('schedule')) result.schedule++; else if (['visited', 'completed', 'complete'].includes(value)) result.visited++; } return result; }
  private normalize(value: string) { return value.toLowerCase().replace(/[\s_-]/g, ''); }
}
