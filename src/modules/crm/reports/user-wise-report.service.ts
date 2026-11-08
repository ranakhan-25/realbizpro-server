import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { Lead, } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadCampaign, LeadSource, LeadTeam } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { LeadTeamMember } from 'src/database/models/crm/lead/crm-lead-team-member.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { QueryUserWiseReportDto } from './dto/query-user-wise-report.dto';

const VISIT_TYPES = ['visit', 'task_visit'];
const CALL_TYPES = ['call', 'followup', 'follow_up', 'follow-up'];
const ACTIVITY_TYPES = [...VISIT_TYPES, ...CALL_TYPES, 'note'];

type CountRow = Record<string, string | number>;

@Injectable()
export class UserWiseReportService {
  constructor(
    @InjectModel(Lead) private readonly leads: typeof Lead,
    @InjectModel(LeadActivity) private readonly activities: typeof LeadActivity,
    @InjectModel(LeadSource) private readonly sources: typeof LeadSource,
    @InjectModel(LeadCampaign) private readonly campaigns: typeof LeadCampaign,
    @InjectModel(LeadTeam) private readonly teams: typeof LeadTeam,
    @InjectModel(LeadTeamMember) private readonly teamMembers: typeof LeadTeamMember,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
  ) {}

  async dropdowns(currentUser?: any) {
    const [users, leadSources, campaigns, teams] = await Promise.all([
      this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'name', 'userCode'], order: [['name', 'ASC']] }),
      this.sources.findAll({ where: { isActive: true }, attributes: ['id', 'uuid', 'name', 'code'], order: [['name', 'ASC']] }),
      this.campaigns.findAll({ attributes: ['id', 'uuid', 'name', 'channel', 'leadSourceId'], order: [['name', 'ASC']] }),
      this.teams.findAll({ where: { isActive: true }, attributes: ['id', 'uuid', 'name'], order: [['name', 'ASC']] }),
    ]);
    return { users, leadSources, campaigns, teams };
  }

  async report(query: QueryUserWiseReportDto, currentUser?: any) {
    const leadWhere: any = {};
    if (query.dateFrom || query.dateTo) {
      leadWhere.leadDate = {
        ...(query.dateFrom ? { [Op.gte]: query.dateFrom } : {}),
        ...(query.dateTo ? { [Op.lte]: query.dateTo } : {}),
      };
    }
    if (query.userId) leadWhere.assignedTo = query.userId;
    if (query.leadSourceId) leadWhere.leadSourceId = query.leadSourceId;
    if (query.campaignId) leadWhere.campaignId = query.campaignId;

    let teamUserIds: string[] | undefined;
    if (query.teamId) {
      const members = await this.teamMembers.findAll({ where: { teamId: query.teamId, isActive: true }, attributes: ['userId'] });
      teamUserIds = members.map(member => member.userId);
      leadWhere.assignedTo = { [Op.in]: teamUserIds.length ? teamUserIds : ['__no_team_member__'] };
    }

    const activityWhere: any = { activityType: { [Op.in]: ACTIVITY_TYPES } };
    if (query.dateFrom || query.dateTo) {
      activityWhere.activityDate = {
        ...(query.dateFrom ? { [Op.gte]: new Date(`${query.dateFrom}T00:00:00.000Z`) } : {}),
        ...(query.dateTo ? { [Op.lte]: new Date(`${query.dateTo}T23:59:59.999Z`) } : {}),
      };
    }

    const [leads, activities] = await Promise.all([
      this.leads.findAll({
        where: leadWhere,
        attributes: ['id', 'assignedTo', 'status', 'leadType', 'leadDate', 'leadStageId'],
        include: [
          { association: 'stage', required: false, attributes: ['id', 'name'] },
          { association: 'source', required: false, attributes: ['id', 'name'] },
          { association: 'campaign', required: false, attributes: ['id', 'name'] },
          { association: 'activities', required: false, attributes: ['id'] },
        ],
      }),
      this.activities.findAll({
        where: activityWhere,
        attributes: ['id', 'leadId', 'activityType', 'activityDate', 'conductedBy', 'createdBy', 'feedback', 'visitStatusId'],
        include: [{ association: 'lead', required: true, attributes: ['id', 'assignedTo', 'leadSourceId', 'campaignId'] }],
      }),
    ]);

    const leadIds = new Set(leads.map(lead => lead.id));
    const filteredActivities = activities.filter(activity => {
      if (!leadIds.has(activity.leadId)) return false;
      const lead = activity.lead;
      const actor = activity.conductedBy ?? activity.createdBy ?? lead?.assignedTo;
      return (!query.userId || actor === query.userId || lead?.assignedTo === query.userId)
        && (!query.teamId || !!teamUserIds?.includes(lead?.assignedTo ?? ''));
    });

    const activeUsers = await this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'name'], order: [['name', 'ASC']] });
    const userMap = new Map(activeUsers.map(user => [user.uuid, user]));
    const rows = new Map<string, { userId: string; name: string; leads: Lead[]; activities: LeadActivity[] }>();
    const ensure = (id: string | undefined) => {
      const key = id ?? 'unassigned';
      if (!rows.has(key)) rows.set(key, { userId: key, name: userMap.get(key)?.name ?? (key === 'unassigned' ? 'Unassigned' : key), leads: [], activities: [] });
      return rows.get(key)!;
    };
    for (const lead of leads) ensure(lead.assignedTo).leads.push(lead);
    for (const activity of filteredActivities) ensure(activity.conductedBy ?? activity.createdBy ?? activity.lead?.assignedTo).activities.push(activity);

    const userRows = [...rows.values()].sort((a, b) => a.name.localeCompare(b.name));
    const leadSummary = userRows.map(row => this.leadRow(row));
    const visitSummary = userRows.map(row => this.visitRow(row));
    const callFollowupSummary = userRows.map(row => this.callRow(row));
    leadSummary.push(this.leadTotal(userRows));
    visitSummary.push(this.visitTotal(userRows));
    callFollowupSummary.push(this.callTotal(userRows));

    return {
      data: { leadSummary, visitSummary, callFollowupSummary },
      meta: { dateFrom: query.dateFrom ?? null, dateTo: query.dateTo ?? null, totalUsers: userRows.length, totalLeads: leads.length, totalActivities: filteredActivities.length },
    };
  }

  private leadRow(row: { userId: string; name: string; leads: Lead[] }): CountRow {
    const result: CountRow = { userId: row.userId, name: row.name };
    for (const key of ['lead', 'potential', 'prospect', 'highProspect', 'new', 'junk', 'untouch']) result[key] = row.leads.filter(lead => key === 'untouch' ? false : this.matchesLead(lead, key)).length;
    result.untouch = row.leads.filter(lead => this.matchesLead(lead, 'untouch')).length;
    result.total = row.leads.length;
    return result;
  }

  private visitRow(row: { userId: string; name: string; activities: LeadActivity[] }): CountRow {
    const visits = row.activities.filter(activity => VISIT_TYPES.includes(activity.activityType.toLowerCase()));
    return { userId: row.userId, name: row.name, visited: this.countStatus(visits, ['visited', 'visitcompleted', 'completed', 'complete']), schedule: this.countStatus(visits, ['schedule', 'scheduled']), canceled: this.countStatus(visits, ['cancel', 'canceled', 'cancelled']), newSchedule: this.countStatus(visits, ['newschedule', 'newscheduled']), rescheduled: this.countStatus(visits, ['reschedule', 'rescheduled']), total: visits.length };
  }

  private callRow(row: { userId: string; name: string; activities: LeadActivity[] }): CountRow {
    const calls = row.activities.filter(activity => CALL_TYPES.includes(activity.activityType.toLowerCase()));
    return { userId: row.userId, name: row.name, call: calls.filter(item => item.activityType.toLowerCase() === 'call').length, followup: calls.filter(item => item.activityType.toLowerCase() !== 'call').length, total: calls.length };
  }

  private leadTotal(rows: Array<{ leads: Lead[] }>) { const all = rows.flatMap(row => row.leads); const row = this.leadRow({ userId: 'total', name: 'Grand Total', leads: all }); return row; }
  private visitTotal(rows: Array<{ activities: LeadActivity[] }>) { const all = rows.flatMap(row => row.activities); return { ...this.visitRow({ userId: 'total', name: 'Grand Total', activities: all }), userId: 'total' }; }
  private callTotal(rows: Array<{ activities: LeadActivity[] }>) { const all = rows.flatMap(row => row.activities); return { ...this.callRow({ userId: 'total', name: 'Grand Total', activities: all }), userId: 'total' }; }
  private countStatus(items: LeadActivity[], statuses: string[]) { return items.filter(item => statuses.includes((item.feedback ?? '').toLowerCase().replace(/[\s_-]/g, ''))).length; }
  private matchesLead(lead: Lead, key: string) {
    const status = `${lead.status ?? ''} ${lead.leadType ?? ''} ${lead.stage?.name ?? ''}`.toLowerCase().replace(/[\s_-]/g, '');
    if (key === 'untouch') return !lead.activities?.length;
    return status.includes(key.toLowerCase().replace(/[\s_-]/g, ''));
  }
}
