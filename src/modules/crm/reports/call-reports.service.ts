import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { QueryCallReportsDto } from './dto/query-call-reports.dto';

type CountRow = Record<string, string | number>;

const STATUS_COLUMNS = [
  { label: 'Lead', key: 'lead', aliases: ['lead'] },
  { label: 'Potential', key: 'potential', aliases: ['potential'] },
  { label: 'Prospect', key: 'prospect', aliases: ['prospect'] },
  { label: 'High Prospect', key: 'highProspect', aliases: ['highprospect', 'high_prospect', 'high prospect'] },
  { label: 'New', key: 'new', aliases: ['new'] },
];

const CALL_ACTIVITY_TYPES = ['call', 'followup', 'follow_up', 'follow-up'];

@Injectable()
export class CallReportsService {
  constructor(
    @InjectModel(LeadActivity) private readonly activities: typeof LeadActivity,
    @InjectModel(Lead) private readonly leads: typeof Lead,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
  ) {}

  async getReport(query: QueryCallReportsDto) {
    const where: any = {
      activityType: { [Op.in]: CALL_ACTIVITY_TYPES },
    };

    if (query.dateFrom || query.dateTo) {
      where.activityDate = {
        ...(query.dateFrom ? { [Op.gte]: new Date(`${query.dateFrom}T00:00:00.000Z`) } : {}),
        ...(query.dateTo ? { [Op.lte]: new Date(`${query.dateTo}T23:59:59.999Z`) } : {}),
      };
    }

    const [activities, activeUsers] = await Promise.all([
      this.activities.findAll({
        where,
        attributes: ['id', 'activityDate', 'conductedBy', 'createdBy', 'feedback', 'discussionPoints'],
        include: [
          {
            association: 'lead',
            required: true,
            attributes: ['id', 'assignedTo', 'leadStageId'],
            include: [{ association: 'stage', required: false, attributes: ['id', 'name'] }],
          },
        ],
        order: [['activityDate', 'ASC'], ['id', 'ASC']],
      }),
      this.users.findAll({
        where: { isActive: true },
        attributes: ['uuid', 'userCode', 'name'],
        order: [['name', 'ASC']],
      }),
    ]);

    const actorIds = [...new Set(
      activities.flatMap((activity) => [
        activity.conductedBy,
        activity.lead?.assignedTo,
        activity.createdBy,
      ]).filter((value): value is string => Boolean(value)),
    )];

    const activityUsers = actorIds.length
      ? await this.users.findAll({
          where: {
            [Op.or]: [
              { uuid: { [Op.in]: actorIds } },
              { userCode: { [Op.in]: actorIds } },
              { name: { [Op.in]: actorIds } },
            ],
          },
          attributes: ['uuid', 'userCode', 'name'],
        })
      : [];

    const userByActor = new Map<string, { uuid: string; name: string }>();
    for (const user of [...activeUsers, ...activityUsers]) {
      const value = { uuid: user.uuid, name: user.name };
      userByActor.set(user.uuid, value);
      if (user.userCode) userByActor.set(user.userCode, value);
      userByActor.set(user.name, value);
    }

    const rows = activities.map((activity) => {
      const actorId = activity.conductedBy ?? activity.lead?.assignedTo ?? activity.createdBy ?? 'Unassigned';
      const user = userByActor.get(actorId);
      const stage = activity.lead?.stage?.name ?? 'Unknown';
      const date = this.toDateKey(activity.activityDate);
      return {
        date,
        userId: user?.uuid ?? actorId,
        userName: user?.name ?? actorId,
        status: stage,
      };
    });

    const users = [...activeUsers, ...activityUsers]
      .map((user) => ({ userId: user.uuid, name: user.name }))
      .filter((user, index, list) => list.findIndex((item) => item.userId === user.userId) === index);
    const dates = [...new Set(rows.map((row) => row.date))].sort();

    const userStatusSummary: CountRow[] = users.map((user) => {
      const row: CountRow = { userId: user.userId, name: user.name };
      for (const status of STATUS_COLUMNS) {
        row[status.key] = this.count(rows, (item) => item.userId === user.userId && this.matchesStatus(item.status, status.aliases));
      }
      row.total = this.count(rows, (item) => item.userId === user.userId);
      return row;
    });
    userStatusSummary.push(this.totalRow('Total', rows));

    const dateStatusSummary: CountRow[] = dates.map((date) => {
      const row: CountRow = { date };
      for (const status of STATUS_COLUMNS) {
        row[status.key] = this.count(rows, (item) => item.date === date && this.matchesStatus(item.status, status.aliases));
      }
      row.total = this.count(rows, (item) => item.date === date);
      return row;
    });
    dateStatusSummary.push(this.totalDateRow(rows));

    const dateUserSummary: CountRow[] = dates.map((date) => {
      const row: CountRow = { date };
      for (const user of users) row[this.key(user.name)] = this.count(rows, (item) => item.date === date && item.userId === user.userId);
      row.total = this.count(rows, (item) => item.date === date);
      return row;
    });
    dateUserSummary.push(this.totalUserRow(users, rows));

    return {
      data: { userStatusSummary, dateStatusSummary, dateUserSummary },
      meta: {
        dateFrom: query.dateFrom ?? null,
        dateTo: query.dateTo ?? null,
        totalCalls: rows.length,
        statuses: STATUS_COLUMNS.map((status) => status.key),
        dates,
      },
    };
  }

  private count<T>(items: T[], predicate: (item: T) => boolean) {
    return items.reduce((total, item) => total + (predicate(item) ? 1 : 0), 0);
  }

  private totalRow(label: string, rows: Array<{ status: string }>) {
    const row: CountRow = { name: label };
    for (const status of STATUS_COLUMNS) row[status.key] = this.count(rows, (item) => this.matchesStatus(item.status, status.aliases));
    row.total = rows.length;
    return row;
  }

  private totalDateRow(rows: Array<{ status: string }>) {
    const row: CountRow = { date: 'Total' };
    for (const status of STATUS_COLUMNS) row[status.key] = this.count(rows, (item) => this.matchesStatus(item.status, status.aliases));
    row.total = rows.length;
    return row;
  }

  private totalUserRow(users: Array<{ userId: string; name: string }>, rows: Array<{ userId: string }>) {
    const row: CountRow = { date: 'Total' };
    for (const user of users) {
      row[this.key(user.name)] = this.count(rows, (item) => item.userId === user.userId);
    }
    row.total = rows.length;
    return row;
  }

  private matchesStatus(value: string, aliases: string[]) {
    const normalized = value.trim().toLowerCase().replace(/[\s_-]/g, '');
    return aliases.some((alias) => normalized === alias.replace(/[\s_-]/g, ''));
  }

  private key(value: string) {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'unknown';
  }

  private toDateKey(value: Date) {
    const date = new Date(value);
    return date.toISOString().slice(0, 10);
  }
}
