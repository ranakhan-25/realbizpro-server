import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CommunicationStatus, CommunicationStatusState } from 'src/database/models/crm/configuration/crm-communication-status.model';
import { LeadStage } from 'src/database/models/crm/configuration/crm-lead-stage.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { LeadPropertyInterest } from 'src/database/models/crm/lead/crm-lead-property-interest.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { QueryFollowUpDetailsReportDto } from './dto/query-follow-up-details-report.dto';

@Injectable()
export class FollowUpDetailsReportService {
  constructor(
    @InjectModel(LeadActivity) private readonly activities: typeof LeadActivity,
    @InjectModel(Lead) private readonly leads: typeof Lead,
    @InjectModel(LeadStage) private readonly stages: typeof LeadStage,
    @InjectModel(CommunicationStatus) private readonly communicationStatuses: typeof CommunicationStatus,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
  ) {}

  async dropdowns(currentUser?: any) {
    const [users, leads, leadStages, communicationStatuses] = await Promise.all([
      this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'name', 'userCode'], order: [['name', 'ASC']] }),
      this.leads.findAll({ where: { status: { [Op.ne]: 'deleted' } }, attributes: ['uuid', 'leadCode', 'clientName', 'phone'], order: [['clientName', 'ASC']] }),
      this.stages.findAll({ where: { isActive: true }, attributes: ['id', 'uuid', 'name', 'sortOrder'], order: [['sortOrder', 'ASC'], ['name', 'ASC']] }),
      this.communicationStatuses.findAll({ where: { status: CommunicationStatusState.ACTIVE }, attributes: ['uuid', 'name', 'leadStageId'], order: [['name', 'ASC']] }),
    ]);
    return { users, leads, leadStages, communicationStatuses };
  }

  async list(query: QueryFollowUpDetailsReportDto, currentUser?: any) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = { activityType: { [Op.in]: ['followup', 'follow_up', 'follow-up', 'call'] } };
    if (query.dateFrom || query.dateTo) where.activityDate = {
      ...(query.dateFrom ? { [Op.gte]: new Date(`${query.dateFrom}T00:00:00.000Z`) } : {}),
      ...(query.dateTo ? { [Op.lte]: new Date(`${query.dateTo}T23:59:59.999Z`) } : {}),
    };
    if (query.communicationStatus) {
      where.discussionPoints = { [Op.iLike]: `%${query.communicationStatus}%` };
    }

    const leadWhere: any = {};
    if (query.leadId) leadWhere.uuid = query.leadId;
    if (query.userId) {
      const user = await this.users.findOne({ where: { uuid: query.userId } as any, attributes: ['uuid', 'userCode'] });
      leadWhere.assignedTo = { [Op.in]: user ? [user.uuid, user.userCode].filter(Boolean) : [query.userId] };
    }
    if (query.leadStageId) leadWhere.leadStageId = query.leadStageId;

    const term = query.search?.trim();
    if (term) {
      where[Op.or] = [
        { summary: { [Op.iLike]: `%${term}%` } },
        { feedback: { [Op.iLike]: `%${term}%` } },
        { discussionPoints: { [Op.iLike]: `%${term}%` } },
        { '$lead.clientName$': { [Op.iLike]: `%${term}%` } },
        { '$lead.phone$': { [Op.iLike]: `%${term}%` } },
        { '$lead.leadCode$': { [Op.iLike]: `%${term}%` } },
      ];
    }

    const { rows, count } = await this.activities.findAndCountAll({
      where,
      include: [{
        association: 'lead', required: true, where: leadWhere,
        attributes: ['id', 'uuid', 'leadCode', 'clientName', 'phone', 'assignedTo', 'projectId', 'leadStageId'],
        include: [
          { association: 'stage', required: false, attributes: ['id', 'uuid', 'name'] },
          { association: 'propertyInterests', required: false, separate: true, attributes: ['id', 'uuid', 'leadId', 'projectId', 'projectName', 'plotFlatNo'] },
        ],
      }],
      limit, offset: (page - 1) * limit,
      order: [['activityDate', 'DESC'], ['id', 'DESC']], distinct: true,
    });

    const actorIds = rows.flatMap((activity) => [activity.conductedBy, activity.lead?.assignedTo]).filter((value): value is string => Boolean(value));
    const users = await this.userMap(actorIds);
    return {
      data: rows.map((activity, index) => {
        const lead = activity.lead;
        const interest = lead?.propertyInterests?.[0];
        const assignedUser = users.get(lead?.assignedTo ?? '') ?? null;
        const conductedUser = users.get(activity.conductedBy ?? '') ?? assignedUser;
        return {
          sl: (page - 1) * limit + index + 1,
          date: this.date(activity.activityDate),
          user: conductedUser?.name ?? assignedUser?.name ?? activity.conductedBy ?? lead?.assignedTo ?? null,
          userId: conductedUser?.uuid ?? assignedUser?.uuid ?? null,
          stage: lead?.stage?.name ?? null,
          name: lead?.clientName ?? null,
          leadId: lead?.uuid ?? null,
          project: interest?.projectName ?? interest?.projectId ?? lead?.projectId ?? null,
          projectId: interest?.projectId ?? lead?.projectId ?? null,
          flatLand: interest?.plotFlatNo ?? null,
          phone: lead?.phone ?? null,
          note: activity.summary ?? null,
          comment: activity.feedback ?? activity.discussionPoints ?? null,
          status: activity.discussionPoints ?? activity.activityType ?? null,
          activityType: activity.activityType,
          activityId: activity.uuid,
        };
      }),
      meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1, dateFrom: query.dateFrom ?? null, dateTo: query.dateTo ?? null },
    };
  }

  private async userMap(ids: string[]) {
    const values = [...new Set(ids)];
    if (!values.length) return new Map<string, SysUser>();
    const users = await this.users.findAll({ where: { [Op.or]: [{ uuid: { [Op.in]: values } }, { userCode: { [Op.in]: values } }] }, attributes: ['uuid', 'userCode', 'name'] });
    const map = new Map<string, SysUser>();
    for (const user of users) { map.set(user.uuid, user); if (user.userCode) map.set(user.userCode, user); }
    return map;
  }

  private date(value: Date) { return new Date(value).toISOString().slice(0, 10); }
}
