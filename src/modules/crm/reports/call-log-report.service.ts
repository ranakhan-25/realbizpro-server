import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { QueryCallLogReportDto } from './dto/query-call-log-report.dto';

const CALL_TYPES = ['call', 'incoming_call', 'outgoing_call', 'inbound_call', 'outbound_call', 'followup', 'follow_up', 'follow-up'];

type Summary = { outgoing: number; incoming: number; totalCalls: number; totalDurationSeconds: number };

@Injectable()
export class CallLogReportService {
  constructor(
    @InjectModel(LeadActivity) private readonly activities: typeof LeadActivity,
    @InjectModel(Lead) private readonly leads: typeof Lead,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
  ) {}

  async dropdowns() {
    const users = await this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'userCode', 'name'], order: [['name', 'ASC']] });
    return { users };
  }

  async report(query: QueryCallLogReportDto) {
    const where: any = { activityType: { [Op.in]: CALL_TYPES } };
    if (query.dateFrom || query.dateTo) {
      where.activityDate = {
        ...(query.dateFrom ? { [Op.gte]: new Date(`${query.dateFrom}T00:00:00.000Z`) } : {}),
        ...(query.dateTo ? { [Op.lte]: new Date(`${query.dateTo}T23:59:59.999Z`) } : {}),
      };
    }
    const [activities, activeUsers] = await Promise.all([
      this.activities.findAll({ where, attributes: ['id', 'activityType', 'activityDate', 'conductedBy', 'createdBy', 'summary', 'discussionPoints'], order: [['activityDate', 'ASC'], ['id', 'ASC']] }),
      this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'userCode', 'name'], order: [['name', 'ASC']] }),
    ]);
    const actorIds = [...new Set(activities.flatMap(item => [item.conductedBy, item.createdBy]).filter(Boolean))] as string[];
    const activityUsers = actorIds.length ? await this.users.findAll({ where: { [Op.or]: [{ uuid: { [Op.in]: actorIds } }, { userCode: { [Op.in]: actorIds } }, { name: { [Op.in]: actorIds } }] }, attributes: ['uuid', 'userCode', 'name'] }) : [];
    const allUsers = [...activeUsers, ...activityUsers].filter((user, index, list) => list.findIndex(item => item.uuid === user.uuid) === index);
    const userByKey = new Map<string, SysUser>();
    for (const user of allUsers) { userByKey.set(user.uuid, user); if (user.userCode) userByKey.set(user.userCode, user); userByKey.set(user.name, user); }
    const selectedUser = query.userId ? userByKey.get(query.userId.trim()) : undefined;
    const selectedIds = selectedUser ? new Set([selectedUser.uuid, selectedUser.userCode, selectedUser.name].filter(Boolean)) : undefined;
    const rows = activities.filter(item => !selectedIds || selectedIds.has(item.conductedBy ?? '') || selectedIds.has(item.createdBy ?? ''));
    const grouped = new Map<string, Summary>();
    const add = (userKey: string, activity: LeadActivity) => {
      const summary = grouped.get(userKey) ?? { outgoing: 0, incoming: 0, totalCalls: 0, totalDurationSeconds: 0 };
      const direction = this.direction(activity);
      summary[direction] += 1;
      summary.totalCalls += 1;
      grouped.set(userKey, summary);
    };
    for (const activity of rows) {
      const actor = activity.conductedBy ?? activity.createdBy ?? 'unassigned';
      add(actor, activity);
    }
    const reportUsers = allUsers.filter(user => !selectedUser || user.uuid === selectedUser.uuid);
    const data = reportUsers.map((user, index) => {
      const summary = grouped.get(user.uuid) ?? grouped.get(user.userCode ?? '') ?? grouped.get(user.name) ?? { outgoing: 0, incoming: 0, totalCalls: 0, totalDurationSeconds: 0 };
      return this.toRow(index + 1, user, summary);
    });
    const grand = data.reduce((sum, row) => ({ outgoing: sum.outgoing + row.outgoing, incoming: sum.incoming + row.incoming, totalCalls: sum.totalCalls + row.totalCalls, totalDurationSeconds: sum.totalDurationSeconds + row.totalDurationSeconds }), { outgoing: 0, incoming: 0, totalCalls: 0, totalDurationSeconds: 0 });
    return { data, grandTotal: { sl: null, name: 'Grand Total', ...grand, totalDuration: this.durationText(grand.totalDurationSeconds) }, meta: { dateFrom: query.dateFrom ?? null, dateTo: query.dateTo ?? null, userId: query.userId ?? null, totalCalls: grand.totalCalls } };
  }

  private direction(activity: LeadActivity): 'incoming' | 'outgoing' {
    const value = `${activity.activityType} ${activity.summary ?? ''} ${activity.discussionPoints ?? ''}`.toLowerCase();
    return /(incoming|inbound|received|receive)/.test(value) ? 'incoming' : 'outgoing';
  }

  private toRow(sl: number, user: SysUser, summary: Summary) {
    return { sl, userId: user.uuid, name: user.name, outgoing: summary.outgoing, incoming: summary.incoming, totalCalls: summary.totalCalls, totalDurationSeconds: summary.totalDurationSeconds, totalDuration: this.durationText(summary.totalDurationSeconds) };
  }

  private durationText(seconds: number) { return `${seconds} sec`; }
}
