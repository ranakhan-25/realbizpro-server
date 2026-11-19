import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { LeadVisitPlace, LeadVisitStatus } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { LeadStage } from 'src/database/models/crm/configuration/crm-lead-stage.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { QueryTaskVisitDto } from './dto/query-task-visit.dto';

const isUuid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
const activityTypes = [{ value: 'visit', name: 'Visit' }, { value: 'task_visit', name: 'Task/Visit' }];

@Injectable()
export class CallCenterTaskVisitService {
  constructor(
    @InjectModel(LeadActivity) private readonly activities: typeof LeadActivity,
    @InjectModel(LeadVisitPlace) private readonly places: typeof LeadVisitPlace,
    @InjectModel(LeadVisitStatus) private readonly statuses: typeof LeadVisitStatus,
    @InjectModel(LeadStage) private readonly stages: typeof LeadStage,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
  ) {}

  async dropdowns(currentUser?: any) {
    const whereOrg: any = {};
    if (currentUser?.orgId) {
      whereOrg.orgId = currentUser.orgId;
    }
    const [users, places, statuses, salesPossibilities] = await Promise.all([
      this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'userCode', 'name'], order: [['name', 'ASC']] }),
      this.places.findAll({ where: whereOrg, attributes: ['id', 'uuid', 'name', 'address'], order: [['name', 'ASC']] }),
      this.statuses.findAll({ where: whereOrg, attributes: ['id', 'uuid', 'name', 'color'], order: [['name', 'ASC']] }),
      this.stages.findAll({ where: { isActive: true }, attributes: ['id', 'uuid', 'name', 'color', 'sortOrder'], order: [['sortOrder', 'ASC'], ['name', 'ASC']] }),
    ]);
    return { users: users.map(user => ({ uuid: user.uuid, userCode: user.userCode ?? null, name: user.name })), statuses, places, taskTypes: activityTypes, salesPossibilities: salesPossibilities.map(stage => ({ id: stage.id, uuid: stage.uuid, name: stage.name, color: stage.color ?? null })) };
  }

  async list(query: QueryTaskVisitDto, currentUser?: any) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);
    const where: any = { activityType: { [Op.in]: activityTypes.map(item => item.value) } };
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    if (query.dateFrom || query.dateTo) {
      where.activityDate = {};
      if (query.dateFrom) where.activityDate[Op.gte] = new Date(`${query.dateFrom}T00:00:00.000`);
      if (query.dateTo) where.activityDate[Op.lte] = new Date(`${query.dateTo}T23:59:59.999`);
    }
    if (query.placeId) where.visitPlaceId = query.placeId;
    if (query.statusId) where.visitStatusId = query.statusId;
    if (query.salesPossibilityId) where['$lead.leadStageId$'] = query.salesPossibilityId;
    if (query.taskType) {
      const type = activityTypes.find(item => item.value === query.taskType || item.name.toLowerCase() === query.taskType?.toLowerCase());
      if (!type) return this.emptyPage(page, limit);
      where.activityType = type.value;
    }
    if (query.userId) {
      const value = query.userId;
      const user = await this.users.findOne({ where: isUuid(value) ? { uuid: value } : { userCode: value }, attributes: ['uuid', 'userCode'] });
      where.conductedBy = { [Op.in]: [...new Set([value, user?.uuid, user?.userCode].filter((item): item is string => !!item))] };
    }
    const term = query.search?.trim();
    if (term) where[Op.or] = [
      { summary: { [Op.iLike]: `%${term}%` } }, { feedback: { [Op.iLike]: `%${term}%` } },
      { '$lead.leadCode$': { [Op.iLike]: `%${term}%` } }, { '$lead.clientName$': { [Op.iLike]: `%${term}%` } }, { '$lead.phone$': { [Op.iLike]: `%${term}%` } },
    ];
    const { rows, count } = await this.activities.findAndCountAll({
      where,
      include: [
        { association: 'lead', required: true, attributes: ['id', 'uuid', 'leadCode', 'clientName', 'phone'] },
        { association: 'visitPlace', required: false, attributes: ['id', 'uuid', 'name', 'address'] },
        { association: 'visitStatus', required: false, attributes: ['id', 'uuid', 'name', 'color'] },
      ],
      order: [['activityDate', 'DESC'], ['id', 'DESC']], limit, offset: (page - 1) * limit, distinct: true,
    });
    const conductedByIds = [...new Set(rows.map(row => row.conductedBy).filter((id): id is string => !!id))];
    const userUuids = conductedByIds.filter(isUuid);
    const userCodes = conductedByIds.filter(id => !isUuid(id));
    const users = conductedByIds.length ? await this.users.findAll({
      where: { [Op.or]: [...(userUuids.length ? [{ uuid: { [Op.in]: userUuids } }] : []), ...(userCodes.length ? [{ userCode: { [Op.in]: userCodes } }] : [])] },
      attributes: ['uuid', 'userCode', 'name'],
    }) : [];
    const userMap = new Map<string, { uuid: string; userCode?: string; name: string }>();
    for (const user of users) {
      const value = { uuid: user.uuid, userCode: user.userCode ?? undefined, name: user.name };
      userMap.set(user.uuid, value);
      if (user.userCode) userMap.set(user.userCode, value);
    }
    return {
      data: rows.map((activity, index) => {
        const lead = activity.lead;
        const type = activityTypes.find(item => item.value === activity.activityType) ?? { value: activity.activityType, name: activity.activityType };
        return {
          sl: (page - 1) * limit + index + 1,
          uuid: activity.uuid,
          name: lead?.clientName ?? null,
          mobile: lead?.phone ?? null,
          date: activity.activityDate,
          status: activity.visitStatus?.name ?? activity.feedback ?? null,
          note: activity.summary,
          user: activity.conductedBy ? userMap.get(activity.conductedBy) ?? { uuid: activity.conductedBy, name: activity.conductedBy } : null,
          place: activity.visitPlace ?? null,
          visitPlace: activity.visitPlace ?? null,
          taskType: type,
          activityType: activity.activityType,
          action: { activityUuid: activity.uuid, leadUuid: lead?.uuid ?? null, canViewLead: !!lead?.uuid },
          lead: lead ? { uuid: lead.uuid, leadCode: lead.leadCode, name: lead.clientName, phone: lead.phone } : null,
          feedback: activity.feedback ?? null,
          orgId: activity.orgId ?? null,
          org_id: activity.orgId ?? null,
          created_by: activity.createdBy ?? null,
          updated_by: activity.updatedBy ?? null,
          deleted_by: activity.deletedBy ?? null,
          created_at: activity.createdAt,
          updated_at: activity.updatedAt,
        };
      }),
      meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    };
  }

  private emptyPage(page: number, limit: number) { return { data: [], meta: { page, limit, total: 0, totalPages: 0 } }; }
}
