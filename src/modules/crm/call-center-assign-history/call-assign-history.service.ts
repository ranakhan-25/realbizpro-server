import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CommunicationStatus, CommunicationStatusState } from 'src/database/models/crm/configuration/crm-communication-status.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { LeadCallAssignment } from 'src/database/models/crm/lead/crm-lead-call-assignment.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { QueryCallAssignHistoryDto } from './dto/query-call-assign-history.dto';

const isUuid = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

@Injectable()
export class CallAssignHistoryService {
  constructor(
    @InjectModel(LeadCallAssignment) private readonly assignments: typeof LeadCallAssignment,
    @InjectModel(LeadActivity) private readonly activities: typeof LeadActivity,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
    @InjectModel(CommunicationStatus) private readonly communicationStatuses: typeof CommunicationStatus,
  ) {}

  async dropdowns(currentUser?: any) {
    const [users, communicationStatuses] = await Promise.all([
      this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'userCode', 'name'], order: [['name', 'ASC']] }),
      this.communicationStatuses.findAll({ where: { status: CommunicationStatusState.ACTIVE }, attributes: ['uuid', 'name'], order: [['name', 'ASC']] }),
    ]);
    const options = users.map(user => ({ uuid: user.uuid, userCode: user.userCode ?? null, name: user.name }));
    return { from: options, to: options, communicationStatuses };
  }

  async list(query: QueryCallAssignHistoryDto, currentUser?: any) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);
    const where: any = {};
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    if (query.dateFrom || query.dateTo) {
      where.assignmentDate = {};
      if (query.dateFrom) where.assignmentDate[Op.gte] = new Date(`${query.dateFrom}T00:00:00.000`);
      if (query.dateTo) where.assignmentDate[Op.lte] = new Date(`${query.dateTo}T23:59:59.999`);
    }
    const selectedUsers = [query.from, query.to].filter((id): id is string => !!id);
    const selectedUuids = selectedUsers.filter(isUuid);
    const selectedCodes = selectedUsers.filter(value => !isUuid(value));
    const selectedUserRows = selectedUsers.length ? await this.users.findAll({
      where: { [Op.or]: [...(selectedUuids.length ? [{ uuid: { [Op.in]: selectedUuids } }] : []), ...(selectedCodes.length ? [{ userCode: { [Op.in]: selectedCodes } }] : [])] },
      attributes: ['uuid', 'userCode'],
    }) : [];
    const userValues = (value?: string) => {
      if (!value) return undefined;
      const match = selectedUserRows.find(user => user.uuid === value || user.userCode === value);
      return [...new Set([value, match?.uuid, match?.userCode].filter((item): item is string => !!item))];
    };
    if (query.from) where.assignedFrom = { [Op.in]: userValues(query.from) };
    if (query.to) where.assignedTo = { [Op.in]: userValues(query.to) };

    const statuses = await this.communicationStatuses.findAll({ where: { status: CommunicationStatusState.ACTIVE }, attributes: ['uuid', 'name'] });
    const selectedStatus = query.communicationStatus ? statuses.find(status => status.uuid === query.communicationStatus || status.name === query.communicationStatus) : undefined;
    if (query.communicationStatus && !selectedStatus) return this.emptyPage(page, limit);

    const { rows, count } = await this.assignments.findAndCountAll({
      where,
      include: [{ association: 'lead', required: true, attributes: ['uuid', 'leadCode', 'clientName', 'phone', 'initialRemark', 'notes'] }],
      order: [['assignmentDate', 'DESC'], ['id', 'DESC']],
      distinct: true,
    });
    const leadIds = [...new Set(rows.map(row => row.leadId))];
    const activityWhere: any = { leadId: { [Op.in]: leadIds }, activityType: 'followup' };
    if (currentUser?.orgId) {
      activityWhere.orgId = currentUser.orgId;
    }
    if (selectedStatus) activityWhere.discussionPoints = { [Op.in]: [selectedStatus.uuid, selectedStatus.name] };
    const activityRows = leadIds.length ? await this.activities.findAll({ where: activityWhere, attributes: ['leadId', 'activityDate', 'summary', 'discussionPoints'], order: [['activityDate', 'DESC']] }) : [];
    const latestActivityByLead = new Map<number, LeadActivity>();
    for (const activity of activityRows) if (!latestActivityByLead.has(activity.leadId)) latestActivityByLead.set(activity.leadId, activity);
    const filtered = rows.filter(row => !selectedStatus || latestActivityByLead.has(row.leadId));
    const needle = query.search?.trim().toLocaleLowerCase();
    const searched = needle ? filtered.filter(row => {
      const lead = row.lead;
      const activity = latestActivityByLead.get(row.leadId);
      return [lead?.leadCode, lead?.clientName, lead?.phone, row.instruction, row.status, lead?.initialRemark, lead?.notes, activity?.summary, activity?.discussionPoints]
        .some(value => String(value ?? '').toLocaleLowerCase().includes(needle));
    }) : filtered;
    const relatedUserIds = [...new Set(searched.flatMap(row => [row.assignedFrom, row.assignedTo]))];
    const relatedUuids = relatedUserIds.filter(isUuid);
    const relatedCodes = relatedUserIds.filter(value => !isUuid(value));
    const users = relatedUserIds.length ? await this.users.findAll({
      where: { [Op.or]: [...(relatedUuids.length ? [{ uuid: { [Op.in]: relatedUuids } }] : []), ...(relatedCodes.length ? [{ userCode: { [Op.in]: relatedCodes } }] : [])] },
      attributes: ['uuid', 'userCode', 'name'],
    }) : [];
    const userById = new Map<string, { uuid: string; userCode?: string; name: string }>();
    for (const user of users) {
      const item = { uuid: user.uuid, userCode: user.userCode ?? undefined, name: user.name };
      userById.set(user.uuid, item);
      if (user.userCode) userById.set(user.userCode, item);
    }
    const statusByValue = new Map(statuses.flatMap(status => [[status.uuid, status.name] as [string, string], [status.name, status.name] as [string, string]]));
    const offset = (page - 1) * limit;
    const data = searched.slice(offset, offset + limit).map(row => {
      const lead = row.lead;
      const activity = latestActivityByLead.get(row.leadId);
      const communicationStatus = activity?.discussionPoints ?? null;
      return {
        uuid: row.uuid,
        date: row.assignmentDate,
        name: lead?.clientName ?? null,
        leadCode: lead?.leadCode ?? null,
        phone: lead?.phone ?? null,
        note: row.instruction ?? null,
        comment: activity?.summary ?? lead?.initialRemark ?? lead?.notes ?? null,
        status: statusByValue.get(communicationStatus ?? '') ?? communicationStatus ?? row.status ?? null,
        communicationStatus: statusByValue.get(communicationStatus ?? '') ?? communicationStatus,
        from: userById.get(row.assignedFrom) ?? { uuid: row.assignedFrom, name: row.assignedFrom },
        to: userById.get(row.assignedTo) ?? { uuid: row.assignedTo, name: row.assignedTo },
        lead: lead ? { uuid: lead.uuid, leadCode: lead.leadCode, name: lead.clientName, phone: lead.phone } : null,
        orgId: row.orgId ?? null,
        org_id: row.orgId ?? null,
        created_by: row.createdBy ?? null,
        updated_by: row.updatedBy ?? null,
        deleted_by: row.deletedBy ?? null,
      };
    });
    return { data, meta: { total: searched.length, page, limit, totalPages: Math.ceil(searched.length / limit) } };
  }

  private emptyPage(page: number, limit: number) { return { data: [], meta: { total: 0, page, limit, totalPages: 0 } }; }
}
