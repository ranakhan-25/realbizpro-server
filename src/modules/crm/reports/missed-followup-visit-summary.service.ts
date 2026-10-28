import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { LeadTeamMember } from 'src/database/models/crm/lead/crm-lead-team-member.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadTeam } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { QueryMissedFollowupVisitSummaryDto } from './dto/query-missed-followup-visit-summary.dto';

const VISIT_TYPES = ['visit', 'task_visit'];
const FOLLOWUP_TYPES = ['followup', 'follow_up', 'follow-up'];
const COMPLETED_STATUSES = ['visited', 'visitcompleted', 'completed', 'complete', 'cancel', 'canceled', 'cancelled'];

@Injectable()
export class MissedFollowupVisitSummaryService {
  constructor(
    @InjectModel(Lead) private readonly leads: typeof Lead,
    @InjectModel(LeadActivity) private readonly activities: typeof LeadActivity,
    @InjectModel(LeadTeam) private readonly teams: typeof LeadTeam,
    @InjectModel(LeadTeamMember) private readonly teamMembers: typeof LeadTeamMember,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
  ) {}

  async dropdowns() {
    const [teams, users] = await Promise.all([
      this.teams.findAll({ where: { isActive: true }, attributes: ['id', 'uuid', 'name', 'leaderId'], order: [['name', 'ASC']] }),
      this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'userCode', 'name'], order: [['name', 'ASC']] }),
    ]);
    return { teams, users };
  }

  async report(query: QueryMissedFollowupVisitSummaryDto) {
    const date = query.date ?? new Date().toISOString().slice(0, 10);
    const endOfDate = new Date(`${date}T23:59:59.999Z`);
    const [teams, members, users, leads, activities] = await Promise.all([
      this.teams.findAll({ where: { isActive: true }, attributes: ['id', 'uuid', 'name'], order: [['name', 'ASC']] }),
      this.teamMembers.findAll({ where: { isActive: true }, attributes: ['teamId', 'userId'] }),
      this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'userCode', 'name'] }),
      this.leads.findAll({ attributes: ['id', 'assignedTo', 'leadDate'] }),
      this.activities.findAll({
        where: { [Op.or]: [{ activityDate: { [Op.lte]: endOfDate } }, { nextFollowupDate: { [Op.lte]: endOfDate } }] },
        attributes: ['id', 'leadId', 'activityType', 'activityDate', 'nextFollowupDate', 'feedback'],
        include: [{ association: 'lead', required: true, attributes: ['id', 'assignedTo'] }, { association: 'visitStatus', required: false, attributes: ['name'] }],
      }),
    ]);

    const userMap = new Map<string, SysUser>();
    for (const user of users) { userMap.set(user.uuid, user); if (user.userCode) userMap.set(user.userCode, user); }
    const teamMap = new Map(teams.map(team => [team.id, team]));
    const memberMap = new Map<string, number[]>();
    for (const member of members) { const values = memberMap.get(member.userId) ?? []; values.push(member.teamId); memberMap.set(member.userId, values); }
    const selectedTeam = query.teamId ? new Set([query.teamId]) : undefined;
    const selectedUser = query.userId ? userMap.get(query.userId) : undefined;
    const teamRows = new Map<string, { teamId: number; team: string; employeeId: string; employee: string; missedFollowUps: number; missedVisits: number; newLeads: number }>();

    for (const member of members) {
      if (selectedTeam && !selectedTeam.has(member.teamId)) continue;
      if (query.userId && member.userId !== query.userId && member.userId !== selectedUser?.uuid && member.userId !== selectedUser?.userCode) continue;
      const team = teamMap.get(member.teamId);
      const user = userMap.get(member.userId);
      if (!team || !user) continue;
      const key = `${team.id}:${member.userId}`;
      teamRows.set(key, { teamId: team.id, team: team.name, employeeId: user.uuid, employee: user.name, missedFollowUps: 0, missedVisits: 0, newLeads: 0 });
    }

    const leadUser = (lead: Lead) => lead.assignedTo ? userMap.get(lead.assignedTo) : undefined;
    for (const lead of leads) {
      if (lead.leadDate !== date) continue;
      const user = leadUser(lead);
      if (!user) continue;
      for (const teamId of memberMap.get(lead.assignedTo ?? '') ?? []) {
        const key = `${teamId}:${user.uuid}`;
        const row = teamRows.get(key);
        if (row) row.newLeads++;
      }
    }

    for (const activity of activities) {
      const assignedTo = activity.lead?.assignedTo;
      const user = assignedTo ? userMap.get(assignedTo) : undefined;
      if (!user) continue;
      const type = this.normalize(activity.activityType);
      const status = this.normalize((activity.visitStatus?.name ?? activity.feedback) ?? '');
      const missedFollowUp = (FOLLOWUP_TYPES.includes(type) || (type === 'call' && !!activity.nextFollowupDate)) && !!activity.nextFollowupDate && new Date(activity.nextFollowupDate) <= endOfDate;
      const missedVisit = VISIT_TYPES.includes(type) && new Date(activity.activityDate) <= endOfDate && !COMPLETED_STATUSES.includes(status);
      if (!missedFollowUp && !missedVisit) continue;
      for (const teamId of memberMap.get(assignedTo ?? '') ?? []) {
        const row = teamRows.get(`${teamId}:${user.uuid}`);
        if (row) { if (missedFollowUp) row.missedFollowUps++; if (missedVisit) row.missedVisits++; }
      }
    }

    const term = query.search?.trim().toLowerCase();
    const filtered = [...teamRows.values()].filter(row => !term || `${row.team} ${row.employee}`.toLowerCase().includes(term)).sort((a, b) => a.team.localeCompare(b.team) || a.employee.localeCompare(b.employee));
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const data = filtered.slice((page - 1) * limit, page * limit).map((row, index) => ({ sl: (page - 1) * limit + index + 1, ...row }));
    const totals = filtered.reduce((sum, row) => ({ missedFollowUps: sum.missedFollowUps + row.missedFollowUps, missedVisits: sum.missedVisits + row.missedVisits, newLeads: sum.newLeads + row.newLeads }), { missedFollowUps: 0, missedVisits: 0, newLeads: 0 });
    return { data, totals, grandTotal: { employee: 'Grand Total', ...totals }, meta: { date, page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) || 1, teamId: query.teamId ?? null, userId: query.userId ?? null } };
  }

  private normalize(value: string) { return value.toLowerCase().replace(/[\s_-]/g, ''); }
}
