import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadTeam } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { LeadTeamMember } from 'src/database/models/crm/lead/crm-lead-team-member.model';
import { QueryTeamSummaryReportDto } from './dto/query-team-summary-report.dto';

const VISIT_TYPES = ['visit', 'task_visit'];
const CALL_TYPES = ['call', 'followup', 'follow_up', 'follow-up'];
type SummaryRow = Record<string, string | number>;

@Injectable()
export class TeamSummaryReportService {
  constructor(
    @InjectModel(Lead) private readonly leads: typeof Lead,
    @InjectModel(LeadActivity) private readonly activities: typeof LeadActivity,
    @InjectModel(LeadTeam) private readonly teams: typeof LeadTeam,
    @InjectModel(LeadTeamMember) private readonly teamMembers: typeof LeadTeamMember,
  ) {}

  async dropdowns() {
    const teams = await this.teams.findAll({
      where: { isActive: true },
      attributes: ['id', 'uuid', 'name', 'leaderId'],
      order: [['name', 'ASC']],
    });
    return { teams };
  }

  async report(query: QueryTeamSummaryReportDto) {
    const leadWhere: any = {};
    if (query.dateFrom || query.dateTo) leadWhere.leadDate = { ...(query.dateFrom ? { [Op.gte]: query.dateFrom } : {}), ...(query.dateTo ? { [Op.lte]: query.dateTo } : {}) };

    const [teams, members, leads] = await Promise.all([
      this.teams.findAll({ where: { isActive: true }, attributes: ['id', 'uuid', 'name'], order: [['name', 'ASC']] }),
      this.teamMembers.findAll({ where: { isActive: true }, attributes: ['teamId', 'userId'] }),
      this.leads.findAll({ where: leadWhere, attributes: ['id', 'assignedTo', 'status', 'leadType'], include: [{ association: 'activities', required: false, attributes: ['id'] }] }),
    ]);

    const selectedTeam = query.teamId ? new Set([query.teamId]) : undefined;
    const userTeams = new Map<string, number[]>();
    for (const member of members) {
      if (selectedTeam && !selectedTeam.has(member.teamId)) continue;
      const ids = userTeams.get(member.userId) ?? [];
      ids.push(member.teamId);
      userTeams.set(member.userId, ids);
    }

    const teamMap = new Map(teams.filter(team => !selectedTeam || selectedTeam.has(team.id)).map(team => [team.id, team]));
    const teamRows = new Map<number, { teamId: number; name: string; leads: Lead[]; activities: LeadActivity[] }>();
    for (const team of teamMap.values()) teamRows.set(team.id, { teamId: team.id, name: team.name, leads: [], activities: [] });
    const unassigned = { teamId: 0, name: 'Unassigned', leads: [] as Lead[], activities: [] as LeadActivity[] };

    for (const lead of leads) {
      const teamIds = userTeams.get(lead.assignedTo ?? '') ?? [];
      const matching = teamIds.filter(id => teamMap.has(id));
      if (!matching.length) { if (!selectedTeam) unassigned.leads.push(lead); continue; }
      for (const teamId of matching) teamRows.get(teamId)!.leads.push(lead);
    }

    const leadIds = new Set(leads.map(lead => lead.id));
    const activityWhere: any = {};
    if (query.dateFrom || query.dateTo) activityWhere.activityDate = { ...(query.dateFrom ? { [Op.gte]: new Date(`${query.dateFrom}T00:00:00.000Z`) } : {}), ...(query.dateTo ? { [Op.lte]: new Date(`${query.dateTo}T23:59:59.999Z`) } : {}) };
    const activities = await this.activities.findAll({ where: activityWhere, attributes: ['id', 'leadId', 'activityType', 'feedback'], include: [{ association: 'lead', required: true, attributes: ['id', 'assignedTo'] }] });
    for (const activity of activities) {
      if (!leadIds.has(activity.leadId)) continue;
      const teamIds = userTeams.get(activity.lead?.assignedTo ?? '') ?? [];
      for (const teamId of teamIds) if (teamRows.has(teamId)) teamRows.get(teamId)!.activities.push(activity);
      if (!teamIds.length && !selectedTeam) unassigned.activities.push(activity);
    }
    if (!selectedTeam && unassigned.leads.length) teamRows.set(0, unassigned);

    const rows = [...teamRows.values()].sort((a, b) => a.name.localeCompare(b.name));
    const leadSummary = rows.map(row => this.leadRow(row));
    const visitSummary = rows.map(row => this.visitRow(row));
    const callFollowupSummary = rows.map(row => this.callRow(row));
    leadSummary.push(this.leadTotal(rows));
    visitSummary.push(this.visitTotal(rows));
    callFollowupSummary.push(this.callTotal(rows));
    return { data: { leadSummary, visitSummary, callFollowupSummary }, meta: { dateFrom: query.dateFrom ?? null, dateTo: query.dateTo ?? null, totalTeams: rows.length, totalLeads: leads.length } };
  }

  private leadRow(row: { teamId: number; name: string; leads: Lead[] }): SummaryRow {
    const result: SummaryRow = { teamId: row.teamId, name: row.name };
    for (const key of ['lead', 'potential', 'prospect', 'highProspect', 'new', 'junk']) result[key] = row.leads.filter(lead => this.matchesLead(lead, key)).length;
    result.untouch = row.leads.filter(lead => !lead.activities?.length).length;
    result.total = row.leads.length;
    return result;
  }

  private visitRow(row: { teamId: number; name: string; activities: LeadActivity[] }): SummaryRow {
    const visits = row.activities.filter(item => VISIT_TYPES.includes(item.activityType.toLowerCase()));
    return { teamId: row.teamId, name: row.name, visited: this.countStatus(visits, ['visited', 'visitcompleted', 'completed', 'complete']), schedule: this.countStatus(visits, ['schedule', 'scheduled']), canceled: this.countStatus(visits, ['cancel', 'canceled', 'cancelled']), newSchedule: this.countStatus(visits, ['newschedule', 'newscheduled']), rescheduled: this.countStatus(visits, ['reschedule', 'rescheduled']), total: visits.length };
  }

  private callRow(row: { teamId: number; name: string; activities: LeadActivity[] }): SummaryRow {
    const calls = row.activities.filter(item => CALL_TYPES.includes(item.activityType.toLowerCase()));
    return { teamId: row.teamId, name: row.name, call: calls.filter(item => item.activityType.toLowerCase() === 'call').length, followup: calls.filter(item => item.activityType.toLowerCase() !== 'call').length, total: calls.length };
  }

  private leadTotal(rows: Array<{ leads: Lead[] }>) { return { ...this.leadRow({ teamId: 0, name: 'Grand Total', leads: rows.flatMap(row => row.leads) }), teamId: 'total' }; }
  private visitTotal(rows: Array<{ activities: LeadActivity[] }>) { return { ...this.visitRow({ teamId: 0, name: 'Grand Total', activities: rows.flatMap(row => row.activities) }), teamId: 'total' }; }
  private callTotal(rows: Array<{ activities: LeadActivity[] }>) { return { ...this.callRow({ teamId: 0, name: 'Grand Total', activities: rows.flatMap(row => row.activities) }), teamId: 'total' }; }
  private countStatus(items: LeadActivity[], statuses: string[]) { return items.filter(item => statuses.includes((item.feedback ?? '').toLowerCase().replace(/[\s_-]/g, ''))).length; }
  private matchesLead(lead: Lead, key: string) { const value = `${lead.status ?? ''} ${lead.leadType ?? ''}`.toLowerCase().replace(/[\s_-]/g, ''); return value.includes(key.toLowerCase().replace(/[\s_-]/g, '')); }
}
