import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CrmEmployeeKpi } from 'src/database/models/crm/kpi/crm-employee-kpi.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { LeadTeam } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { LeadTeamMember } from 'src/database/models/crm/lead/crm-lead-team-member.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { QueryTeamKpiReportDto } from './dto/query-team-kpi-report.dto';

const CALL_TYPES = ['call', 'incoming_call', 'outgoing_call', 'inbound_call', 'outbound_call', 'followup', 'follow_up', 'follow-up'];
const TASK_TYPES = ['visit', 'task_visit'];

@Injectable()
export class TeamKpiReportService {
  constructor(
    @InjectModel(CrmEmployeeKpi) private readonly kpis: typeof CrmEmployeeKpi,
    @InjectModel(LeadActivity) private readonly activities: typeof LeadActivity,
    @InjectModel(LeadTeam) private readonly teams: typeof LeadTeam,
    @InjectModel(LeadTeamMember) private readonly teamMembers: typeof LeadTeamMember,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
  ) {}

  async dropdowns(currentUser?: any) {
    const teams = await this.teams.findAll({ where: { isActive: true }, attributes: ['id', 'uuid', 'name'], order: [['name', 'ASC']] });
    return { teams };
  }

  async report(query: QueryTeamKpiReportDto, currentUser?: any) {
    const fromDate = query.dateFrom ? new Date(`${query.dateFrom}T00:00:00.000Z`) : undefined;
    const toDate = query.dateTo ? new Date(`${query.dateTo}T23:59:59.999Z`) : undefined;
    const kpis = await this.kpis.findAll({
      where: { type: 'TEAM', status: 'ACTIVE', ...(query.teamId ? { teamId: Number(query.teamId) } : {}) },
      include: [{ association: 'team', required: true, attributes: ['id', 'uuid', 'name'] }],
      order: [['fromDate', 'ASC'], ['id', 'ASC']],
    });
    const filteredKpis = kpis.filter(kpi => this.overlaps(kpi.fromDate, kpi.toDate, query.dateFrom, query.dateTo));
    const teamIds = [...new Set(filteredKpis.map(kpi => kpi.teamId).filter((value): value is number => value != null))];
    const members = teamIds.length ? await this.teamMembers.findAll({ where: { teamId: { [Op.in]: teamIds }, isActive: true }, attributes: ['teamId', 'userId'] }) : [];
    const membersByTeam = new Map<number, Set<string>>();
    for (const member of members) membersByTeam.set(member.teamId, new Set([...(membersByTeam.get(member.teamId) ?? []), member.userId]));
    const activityWhere: any = { activityType: { [Op.in]: [...CALL_TYPES, ...TASK_TYPES] } };
    if (fromDate || toDate) activityWhere.activityDate = { ...(fromDate ? { [Op.gte]: fromDate } : {}), ...(toDate ? { [Op.lte]: toDate } : {}) };
    const activities = await this.activities.findAll({ where: activityWhere, attributes: ['id', 'activityType', 'activityDate', 'conductedBy', 'createdBy'] });
    const actorValues = [...new Set(activities.flatMap(activity => [activity.conductedBy, activity.createdBy]).filter(Boolean))] as string[];
    const uuidValues = actorValues.filter(value => this.isUuid(value));
    const activityUsers = actorValues.length ? await this.users.findAll({ where: { [Op.or]: [
      ...(uuidValues.length ? [{ uuid: { [Op.in]: uuidValues } }] : []),
      { userCode: { [Op.in]: actorValues } },
      { name: { [Op.in]: actorValues } },
    ] }, attributes: ['uuid', 'userCode', 'name'] }) : [];
    const userKey = new Map<string, string>();
    for (const user of activityUsers) { userKey.set(user.uuid, user.uuid); if (user.userCode) userKey.set(user.userCode, user.uuid); userKey.set(user.name, user.uuid); }
    const data = filteredKpis.map((kpi, index) => {
      const memberIds = membersByTeam.get(kpi.teamId as number) ?? new Set<string>();
      const teamActivities = activities.filter(activity => memberIds.has(userKey.get(activity.conductedBy ?? '') ?? activity.conductedBy ?? '') || memberIds.has(userKey.get(activity.createdBy ?? '') ?? activity.createdBy ?? ''));
      const achieveCall = teamActivities.filter(activity => CALL_TYPES.includes(activity.activityType.toLowerCase())).length;
      const achieveTask = teamActivities.filter(activity => TASK_TYPES.includes(activity.activityType.toLowerCase())).length;
      const targetCall = this.target(kpi, 'call');
      const targetTask = this.target(kpi, 'task');
      const from = query.dateFrom && query.dateFrom > kpi.fromDate ? query.dateFrom : kpi.fromDate;
      const to = query.dateTo && query.dateTo < kpi.toDate ? query.dateTo : kpi.toDate;
      return { sl: index + 1, name: kpi.team?.name ?? kpi.name, teamId: kpi.teamId, fromDate: from, toDate: to, leftDays: this.leftDays(to), targetCall, achieveCall, percentageCall: this.percentage(achieveCall, targetCall), targetTask, achieveTask, percentageTask: this.percentage(achieveTask, targetTask) };
    });
    return { data, meta: { dateFrom: query.dateFrom ?? null, dateTo: query.dateTo ?? null, teamId: query.teamId ?? null, total: data.length } };
  }

  private target(kpi: CrmEmployeeKpi, kind: 'call' | 'task') {
    const pairs = [[kpi.workType1, kpi.target1], [kpi.workType2, kpi.target2], [kpi.workType3, kpi.target3]];
    const match = pairs.find(([type]) => String(type).toLowerCase().includes(kind === 'call' ? 'call' : 'task'));
    return Number(match?.[1] ?? 0);
  }
  private percentage(achieved: number, target: number) { return target > 0 ? Math.min(100, Math.round((achieved / target) * 100)) : 0; }
  private overlaps(from: string, to: string, filterFrom?: string, filterTo?: string) { return (!filterFrom || to >= filterFrom) && (!filterTo || from <= filterTo); }
  private leftDays(to: string) { return Math.max(0, Math.ceil((new Date(`${to}T23:59:59.999Z`).getTime() - Date.now()) / 86400000)); }
  private isUuid(value: string) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value); }
}
