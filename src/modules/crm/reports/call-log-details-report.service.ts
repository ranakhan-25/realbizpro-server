import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { QueryCallLogDetailsReportDto } from './dto/query-call-log-details-report.dto';

const CALL_TYPES = ['call', 'incoming_call', 'outgoing_call', 'inbound_call', 'outbound_call', 'followup', 'follow_up', 'follow-up'];

@Injectable()
export class CallLogDetailsReportService {
  constructor(
    @InjectModel(LeadActivity) private readonly activities: typeof LeadActivity,
    @InjectModel(Lead) private readonly leads: typeof Lead,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
  ) {}

  async dropdowns() {
    const users = await this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'userCode', 'name'], order: [['name', 'ASC']] });
    return { users };
  }

  async report(query: QueryCallLogDetailsReportDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);
    const where: any = { activityType: { [Op.in]: CALL_TYPES } };
    if (query.dateFrom || query.dateTo) {
      where.activityDate = {
        ...(query.dateFrom ? { [Op.gte]: new Date(`${query.dateFrom}T00:00:00.000Z`) } : {}),
        ...(query.dateTo ? { [Op.lte]: new Date(`${query.dateTo}T23:59:59.999Z`) } : {}),
      };
    }
    const [activities, users] = await Promise.all([
      this.activities.findAll({
        where,
        attributes: ['id', 'uuid', 'activityType', 'activityDate', 'conductedBy', 'createdBy', 'summary', 'discussionPoints'],
        include: [{ association: 'lead', required: false, attributes: ['id', 'clientName', 'phone', 'leadCode'] }],
        order: [['activityDate', 'DESC'], ['id', 'DESC']],
      }),
      this.users.findAll({ attributes: ['uuid', 'userCode', 'name'], order: [['name', 'ASC']] }),
    ]);
    const userMap = new Map<string, SysUser>();
    for (const user of users) { userMap.set(user.uuid, user); if (user.userCode) userMap.set(user.userCode, user); userMap.set(user.name, user); }
    const selected = query.userId ? userMap.get(query.userId.trim()) : undefined;
    const selectedKeys = selected ? new Set([selected.uuid, selected.userCode, selected.name].filter(Boolean)) : undefined;
    const term = query.search?.trim().toLowerCase();
    const filtered = activities.filter(activity => {
      const actor = activity.conductedBy ?? activity.createdBy ?? '';
      const user = userMap.get(actor);
      const item = [activity.activityDate, activity.activityType, activity.lead?.phone, activity.lead?.clientName, activity.lead?.leadCode, user?.name, activity.summary, activity.discussionPoints];
      return (!selectedKeys || selectedKeys.has(actor)) && (!term || item.some(value => String(value ?? '').toLowerCase().includes(term)));
    });
    const data = filtered.slice((page - 1) * limit, page * limit).map((activity, index) => this.toRow(activity, userMap, index + (page - 1) * limit + 1));
    const totalDurationSeconds = filtered.reduce((sum, activity) => sum + this.durationSeconds(activity), 0);
    return {
      data,
      totalDurationSeconds,
      totalDuration: this.durationText(totalDurationSeconds),
      meta: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) || 1, dateFrom: query.dateFrom ?? null, dateTo: query.dateTo ?? null, userId: query.userId ?? null, search: query.search ?? null },
    };
  }

  private toRow(activity: LeadActivity, userMap: Map<string, SysUser>, sl: number) {
    const actor = activity.conductedBy ?? activity.createdBy ?? '';
    const user = userMap.get(actor);
    const durationSeconds = this.durationSeconds(activity);
    return {
      sl,
      id: activity.id,
      uuid: activity.uuid,
      date: activity.activityDate,
      userId: (user?.uuid ?? actor) || null,
      user: (user?.name ?? actor) || null,
      number: activity.lead?.phone ?? null,
      name: activity.lead?.clientName ?? null,
      leadCode: activity.lead?.leadCode ?? null,
      callType: activity.activityType,
      durationSeconds,
      duration: this.durationText(durationSeconds),
    };
  }

  private durationSeconds(activity: LeadActivity) {
    // crm_lead_activities currently has no persisted call-duration column.
    return 0;
  }

  private durationText(seconds: number) {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${hours} hr ${minutes} mins ${secs} secs`;
  }
}
