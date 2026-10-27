import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { QueryTaskVisitSummaryReportDto } from './dto/query-task-visit-summary-report.dto';

const isUuid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

type SummaryRow = {
  userId: string;
  name: string;
  visited: number;
  schedule: number;
  canceled: number;
  newSchedule: number;
  rescheduled: number;
  total: number;
};

@Injectable()
export class TaskVisitSummaryReportService {
  constructor(
    @InjectModel(LeadActivity) private readonly activities: typeof LeadActivity,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
  ) {}

  async getSummary(query: QueryTaskVisitSummaryReportDto) {
    const where: any = { activityType: { [Op.in]: ['visit', 'task_visit'] } };
    if (query.dateFrom || query.dateTo) {
      where.activityDate = {};
      if (query.dateFrom) where.activityDate[Op.gte] = new Date(`${query.dateFrom}T00:00:00.000Z`);
      if (query.dateTo) where.activityDate[Op.lte] = new Date(`${query.dateTo}T23:59:59.999Z`);
    }

    const [activeUsers, activities] = await Promise.all([
      this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'userCode', 'name'], order: [['name', 'ASC']] }),
      this.activities.findAll({
        where,
        attributes: ['uuid', 'activityType', 'activityDate', 'conductedBy', 'createdBy', 'visitStatusId', 'leadId'],
        include: [
          { association: 'visitStatus', required: false, attributes: ['id', 'name'] },
          { association: 'lead', required: false, attributes: ['id', 'assignedTo'] },
        ],
        order: [['activityDate', 'ASC']],
      }),
    ]);

    const actorIds = [...new Set(activities.flatMap(row => [row.conductedBy, row.lead?.assignedTo, row.createdBy]).filter((value): value is string => !!value))];
    const actorUuids = actorIds.filter(isUuid);
    const actorCodes = actorIds.filter(value => !isUuid(value));
    const activityUsers = actorIds.length
      ? await this.users.findAll({
          where: { [Op.or]: [
            ...(actorUuids.length ? [{ uuid: { [Op.in]: actorUuids } }] : []),
            ...(actorCodes.length ? [{ userCode: { [Op.in]: actorCodes } }, { name: { [Op.in]: actorCodes } }] : []),
          ] },
          attributes: ['uuid', 'userCode', 'name'],
        })
      : [];

    const userByActor = new Map<string, SysUser>();
    for (const user of [...activeUsers, ...activityUsers]) {
      userByActor.set(user.uuid, user);
      if (user.userCode) userByActor.set(user.userCode, user);
      userByActor.set(user.name, user);
    }

    const summaries = new Map<string, SummaryRow>();
    for (const user of [...activeUsers, ...activityUsers]) {
      if (!summaries.has(user.uuid)) summaries.set(user.uuid, this.emptyRow(user.uuid, user.name));
    }

    for (const activity of activities) {
      const actorId = activity.conductedBy ?? activity.lead?.assignedTo ?? activity.createdBy;
      if (!actorId) continue;
      const user = userByActor.get(actorId);
      const rowId = user?.uuid ?? actorId;
      const row = summaries.get(rowId) ?? this.emptyRow(rowId, user?.name ?? actorId);
      summaries.set(rowId, row);
      row.total++;
      this.incrementStatus(row, activity.visitStatus?.name ?? activity.feedback ?? '');
    }

    return {
      data: [...summaries.values()].sort((a, b) => a.name.localeCompare(b.name)),
      meta: { dateFrom: query.dateFrom ?? null, dateTo: query.dateTo ?? null, totalUsers: summaries.size },
    };
  }

  private emptyRow(userUuid: string, name: string): SummaryRow {
    return { userId: userUuid, name, visited: 0, schedule: 0, canceled: 0, newSchedule: 0, rescheduled: 0, total: 0 };
  }

  private incrementStatus(row: SummaryRow, value: string) {
    const status = value.toLowerCase().replace(/[\s_-]/g, '');
    if (['visited', 'visitcompleted', 'completed', 'complete'].includes(status)) row.visited++;
    else if (['schedule', 'scheduled'].includes(status)) row.schedule++;
    else if (['cancel', 'canceled', 'cancelled'].includes(status)) row.canceled++;
    else if (['newschedule', 'newscheduled'].includes(status)) row.newSchedule++;
    else if (['reschedule', 'rescheduled'].includes(status)) row.rescheduled++;
  }
}
