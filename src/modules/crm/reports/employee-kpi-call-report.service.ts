import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CrmEmployeeKpi } from 'src/database/models/crm/kpi/crm-employee-kpi.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { LeadTeam } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { LeadTeamMember } from 'src/database/models/crm/lead/crm-lead-team-member.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { QueryEmployeeKpiCallReportDto } from './dto/query-employee-kpi-call-report.dto';

const CALL_TYPES = ['call', 'incoming_call', 'outgoing_call', 'inbound_call', 'outbound_call', 'followup', 'follow_up', 'follow-up'];
const TASK_TYPES = ['visit', 'task_visit'];

@Injectable()
export class EmployeeKpiCallReportService {
  constructor(
    @InjectModel(CrmEmployeeKpi) private readonly kpis: typeof CrmEmployeeKpi,
    @InjectModel(LeadActivity) private readonly activities: typeof LeadActivity,
    @InjectModel(LeadTeam) private readonly teams: typeof LeadTeam,
    @InjectModel(LeadTeamMember) private readonly teamMembers: typeof LeadTeamMember,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
  ) {}

  async dropdowns() {
    const users = await this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'userCode', 'name'], order: [['name', 'ASC']] });
    return { users };
  }

  async report(query: QueryEmployeeKpiCallReportDto) {
    const periodFrom = query.dateFrom ? new Date(`${query.dateFrom}T00:00:00.000Z`) : undefined;
    const periodTo = query.dateTo ? new Date(`${query.dateTo}T23:59:59.999Z`) : undefined;
    const kpis = await this.kpis.findAll({
      where: { status: 'ACTIVE', ...(query.userId ? { userId: query.userId } : {}) },
      include: [{ association: 'user', required: false, attributes: ['uuid', 'userCode', 'name'] }, { association: 'team', required: false, attributes: ['id', 'name'] }],
      order: [['fromDate', 'ASC'], ['id', 'ASC']],
    });
    const filteredKpis = kpis.filter(kpi => this.overlaps(kpi.fromDate, kpi.toDate, query.dateFrom, query.dateTo));
    const actorIds = filteredKpis.flatMap(kpi => [kpi.userId]).filter((value): value is string => !!value);
    const activityWhere: any = { activityType: { [Op.in]: [...CALL_TYPES, ...TASK_TYPES] } };
    if (periodFrom || periodTo) activityWhere.activityDate = { ...(periodFrom ? { [Op.gte]: periodFrom } : {}), ...(periodTo ? { [Op.lte]: periodTo } : {}) };
    const activities = await this.activities.findAll({ where: activityWhere, attributes: ['id', 'activityType', 'activityDate', 'conductedBy', 'createdBy'] });
    const userKeys = [...new Set(activities.flatMap(item => [item.conductedBy, item.createdBy]).filter(Boolean))] as string[];
    const isUuid = (val: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
    const uuidKeys = userKeys.filter(isUuid);
    const userOrCond: any[] = [{ userCode: { [Op.in]: userKeys } }, { name: { [Op.in]: userKeys } }];
    if (uuidKeys.length) userOrCond.unshift({ uuid: { [Op.in]: uuidKeys } });
    const matchedUsers = userKeys.length ? await this.users.findAll({ where: { [Op.or]: userOrCond }, attributes: ['uuid', 'userCode', 'name'] }) : [];
    const allUsers = [...matchedUsers, ...kpis.map(kpi => kpi.user).filter((value): value is SysUser => !!value)];
    const keyMap = new Map<string, string>();
    for (const user of allUsers) { keyMap.set(user.uuid, user.uuid); if (user.userCode) keyMap.set(user.userCode, user.uuid); keyMap.set(user.name, user.uuid); }
    const teamIds = [...new Set(filteredKpis.map(kpi => kpi.teamId).filter((value): value is number => value != null))];
    const teamMembers = teamIds.length ? await this.teamMembers.findAll({ where: { teamId: { [Op.in]: teamIds }, isActive: true }, attributes: ['teamId', 'userId'] }) : [];
    const membersByTeam = new Map<number, string[]>();
    for (const member of teamMembers) membersByTeam.set(member.teamId, [...(membersByTeam.get(member.teamId) ?? []), member.userId]);
    const countFor = (kpi: CrmEmployeeKpi, types: string[]) => activities.filter(activity => types.includes(activity.activityType.toLowerCase()) && this.belongsTo(kpi, activity, keyMap, membersByTeam)).length;
    const data = filteredKpis.filter(kpi => !query.userId || kpi.userId === query.userId || kpi.user?.userCode === query.userId || kpi.user?.name === query.userId).map((kpi, index) => {
      const targetCall = this.target(kpi, 'call');
      const targetTask = this.target(kpi, 'task');
      const achieveCall = countFor(kpi, CALL_TYPES);
      const achieveTask = countFor(kpi, TASK_TYPES);
      const from = query.dateFrom && query.dateFrom > kpi.fromDate ? query.dateFrom : kpi.fromDate;
      const to = query.dateTo && query.dateTo < kpi.toDate ? query.dateTo : kpi.toDate;
      return { sl: index + 1, name: kpi.user?.name ?? (kpi.team as LeadTeam | undefined)?.name ?? kpi.name, userId: kpi.userId ?? null, teamId: kpi.teamId ?? null, from, to, leftDays: this.leftDays(to), targetCall, achieveCall, callPercentage: this.percentage(achieveCall, targetCall), targetTask, achieveTask, taskPercentage: this.percentage(achieveTask, targetTask) };
    });
    return { data, meta: { dateFrom: query.dateFrom ?? null, dateTo: query.dateTo ?? null, userId: query.userId ?? null, total: data.length } };
  }

  private belongsTo(kpi: CrmEmployeeKpi, activity: LeadActivity, keyMap: Map<string, string>, membersByTeam: Map<number, string[]>) {
    const actor = keyMap.get(activity.conductedBy ?? '') ?? keyMap.get(activity.createdBy ?? '') ?? activity.conductedBy ?? activity.createdBy;
    if (kpi.userId) return actor === kpi.userId;
    return !!kpi.teamId && (membersByTeam.get(kpi.teamId) ?? []).includes(actor ?? '');
  }

  private target(kpi: CrmEmployeeKpi, kind: 'call' | 'task') {
    const pairs = [[kpi.workType1, kpi.target1], [kpi.workType2, kpi.target2], [kpi.workType3, kpi.target3]];
    const match = pairs.find(([type]) => String(type).toLowerCase().includes(kind === 'call' ? 'call' : 'task'));
    return Number(match?.[1] ?? 0);
  }
  private percentage(achieved: number, target: number) { return target > 0 ? Math.min(100, Math.round((achieved / target) * 100)) : 0; }
  private overlaps(from: string, to: string, filterFrom?: string, filterTo?: string) { return (!filterFrom || to >= filterFrom) && (!filterTo || from <= filterTo); }
  private leftDays(to: string) { return Math.max(0, Math.ceil((new Date(`${to}T23:59:59.999Z`).getTime() - Date.now()) / 86400000)); }
}
