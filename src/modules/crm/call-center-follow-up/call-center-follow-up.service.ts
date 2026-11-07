import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { LeadRequirement } from 'src/database/models/crm/lead/crm-lead-requirement.model';
import { LeadPropertyInterest } from 'src/database/models/crm/lead/crm-lead-property-interest.model';
import { CrmLeadNegotiation, CrmNegotiationStatus } from 'src/database/models/crm/call-center/crm-lead-negotiation.model';
import { LeadStage } from 'src/database/models/crm/configuration/crm-lead-stage.model';
import { CommunicationStatus, CommunicationStatusState } from 'src/database/models/crm/configuration/crm-communication-status.model';
import { LeadRequirementType, LeadVisitPlace, LeadVisitStatus } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { FlatLand, FlatLandStatus } from 'src/database/models/projects/flatland/pr_flatland.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { QueryCallCenterFollowUpDto } from './dto/query-call-center-follow-up.dto';
import { CreateFollowUpActivityDto } from './dto/create-follow-up-activity.dto';
import { CreateNegotiationDto, UpdateNegotiationDto, UpsertLeadRequirementDto, UpsertPropertyInterestDto } from './dto/lead-detail-actions.dto';

@Injectable()
export class CallCenterFollowUpService {
  constructor(
    @InjectModel(Lead) private readonly leads: typeof Lead,
    @InjectModel(LeadActivity) private readonly activities: typeof LeadActivity,
    @InjectModel(LeadRequirement) private readonly requirements: typeof LeadRequirement,
    @InjectModel(LeadPropertyInterest) private readonly interests: typeof LeadPropertyInterest,
    @InjectModel(CrmLeadNegotiation) private readonly negotiations: typeof CrmLeadNegotiation,
    @InjectModel(Project) private readonly projects: typeof Project,
    @InjectModel(FlatLand) private readonly flatLand: typeof FlatLand,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
    @InjectModel(LeadStage) private readonly stages: typeof LeadStage,
    @InjectModel(CommunicationStatus) private readonly communicationStatuses: typeof CommunicationStatus,
    @InjectModel(LeadRequirementType) private readonly requirementTypes: typeof LeadRequirementType,
    @InjectModel(LeadVisitPlace) private readonly visitPlaces: typeof LeadVisitPlace,
    @InjectModel(LeadVisitStatus) private readonly visitStatuses: typeof LeadVisitStatus,
  ) {}

  async list(query: QueryCallCenterFollowUpDto, currentUser?: any) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    if (query.dateFrom || query.dateTo) where.activityDate = {
      ...(query.dateFrom ? { [Op.gte]: new Date(`${query.dateFrom}T00:00:00`) } : {}),
      ...(query.dateTo ? { [Op.lte]: new Date(`${query.dateTo}T23:59:59.999`) } : {}),
    };
    if (query.activityType) where.activityType = query.activityType;
    if (query.communicationStatus) where.discussionPoints = query.communicationStatus;
    if (query.leadStatus) where['$lead.status$'] = query.leadStatus;
    const leadWhere: any = {};
    if (currentUser?.orgId) {
      leadWhere.orgId = currentUser.orgId;
    }
    if (query.userId) {
      const selectedUser = await this.users.findOne({ where: { uuid: query.userId } as any, attributes: ['uuid', 'userCode'] });
      leadWhere.assignedTo = { [Op.in]: selectedUser ? [selectedUser.uuid, selectedUser.userCode].filter(Boolean) : [query.userId] };
    }
    if (query.projectId) {
      const project = await this.projects.findOne({ where: { uuid: query.projectId } as any, attributes: ['uuid', 'code'] });
      leadWhere.projectId = { [Op.in]: project ? [project.uuid, project.code] : [query.projectId] };
    }
    const term = query.search?.trim();
    if (term) {
      where[Op.or] = [
        { summary: { [Op.iLike]: `%${term}%` } },
        { '$lead.leadCode$': { [Op.iLike]: `%${term}%` } },
        { '$lead.clientName$': { [Op.iLike]: `%${term}%` } },
        { '$lead.phone$': { [Op.iLike]: `%${term}%` } },
      ];
    }
    const { rows, count } = await this.activities.findAndCountAll({
      where,
      include: [{
        association: 'lead',
        attributes: ['id', 'uuid', 'leadCode', 'clientName', 'phone', 'alternatePhone', 'email', 'presentAddress', 'assignedTo', 'projectId', 'status', 'leadStageId'],
        where: leadWhere,
        required: true,
        include: [{ association: 'stage', attributes: ['id', 'uuid', 'name', 'sortOrder'], required: false }],
      }],
      limit, offset: (page - 1) * limit, order: [['activityDate', 'DESC'], ['id', 'DESC']], distinct: true,
    });
    const projectMap = await this.projectMap(rows.map(activity => activity.lead?.projectId));
    const users = await this.userMap(rows.map(activity => activity.lead?.assignedTo));
    return {
      data: rows.map(activity => ({
        ...activity.toJSON(),
        communicationStatus: activity.activityType.toLowerCase() === 'followup' ? activity.discussionPoints ?? null : null,
        note: activity.summary,
        lead: activity.lead ? {
          ...activity.lead.toJSON(),
          name: activity.lead.clientName,
          contact: activity.lead.phone,
          assignedUser: users.get(activity.lead.assignedTo ?? '') ?? null,
          project: projectMap.get(activity.lead.projectId ?? '') ?? null,
        } : null,
      })),
      meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 },
    };
  }

  async dropdowns(currentUser?: any) {
    const whereActive: any = { isActive: true };
    if (currentUser?.orgId) {
      whereActive.orgId = currentUser.orgId;
    }
    const [projects, users, stages, communicationStatuses, requirementTypes, visitPlaces, visitStatuses] = await Promise.all([
      this.projects.findAll({ where: { status: 'ACTIVE' }, attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'name'], order: [['name', 'ASC']] }),
      this.stages.findAll({ where: { isActive: true }, attributes: ['id', 'uuid', 'name', 'sortOrder'], order: [['sortOrder', 'ASC']] }),
      this.communicationStatuses.findAll({ where: { status: CommunicationStatusState.ACTIVE }, attributes: ['uuid', 'name'], order: [['name', 'ASC']] }),
      this.requirementTypes.findAll({ where: whereActive, attributes: ['id', 'name'], order: [['name', 'ASC']] }),
      this.visitPlaces.findAll({ where: whereActive, attributes: ['id', 'name', 'address'], order: [['name', 'ASC']] }),
      this.visitStatuses.findAll({ attributes: ['id', 'name'], order: [['name', 'ASC']] }),
    ]);
    return { projects, users, stages, communicationStatuses, requirementTypes, visitPlaces, visitStatuses, leadStatuses: ['active', 'junk', 'converted'] };
  }

  async propertyDropdown(projectUuid: string, currentUser?: any) {
    const project = await this.projects.findOne({ where: { uuid: projectUuid } as any, attributes: ['uuid'] });
    if (!project) throw new NotFoundException(`Project ${projectUuid} not found`);
    return this.flatLand.findAll({
      where: { projectId: projectUuid, status: FlatLandStatus.AVAILABLE },
      attributes: ['uuid', 'projectId', 'flatLandNo', 'propertyType', 'size', 'bedroom', 'bathroom', 'facing', 'pricePerUnit', 'status'],
      order: [['flatLandNo', 'ASC']],
    });
  }

  async details(uuid: string, currentUser?: any) {
    const leadWhere: any = { uuid };
    if (currentUser?.orgId) {
      leadWhere.orgId = currentUser.orgId;
    }
    const lead = await this.leads.findOne({
      where: leadWhere,
      attributes: ['id', 'uuid', 'leadCode', 'clientName', 'phone', 'alternatePhone', 'email', 'designation', 'organization', 'presentAddress', 'permanentAddress', 'assignedTo', 'priority', 'leadScore', 'status', 'notes', 'leadDate', 'creditOfficerId', 'birthDate', 'anniversaryDate', 'areaId', 'priceRangeId', 'leadType', 'initialRemark', 'query', 'createdBy', 'projectId', 'createdAt', 'updatedAt'],
      include: [
        'category', 'stage', 'source', 'campaign', 'profession', 'area', 'priceRange',
        { association: 'activities', separate: true, order: [['activityDate', 'DESC']] },
        'attachments', 'propertyInterests',
        { association: 'requirements', include: ['requirementType'] }, 'callAssignments', 'transferLogs',
      ],
    });
    if (!lead) throw new NotFoundException(`Lead ${uuid} not found`);
    const activities = lead.activities ?? [];
    const negotiations = await this.listNegotiations(uuid, currentUser);
    const leadJson = lead.toJSON() as any;
    const interestProjects = await this.projectMap((lead.propertyInterests ?? []).map(item => item.projectId));
    const leadProjects = await this.projectMap([lead.projectId]);
    const users = await this.userMap([lead.assignedTo, lead.creditOfficerId]);
    leadJson.propertyInterests = (lead.propertyInterests ?? []).map(item => ({ ...item.toJSON(), project: interestProjects.get(item.projectId ?? '') ?? null }));
    leadJson.project = leadProjects.get(lead.projectId ?? '') ?? null;
    leadJson.assignedUser = users.get(lead.assignedTo ?? '') ?? null;
    leadJson.creditOfficer = users.get(lead.creditOfficerId ?? '') ?? null;
    return {
      ...leadJson,
      tabs: {
        upcomingPending: activities.filter(item => item.nextFollowupDate),
        requirements: lead.requirements ?? [],
        property: lead.propertyInterests ?? [],
        negotiations,
        followUps: activities.filter(item => ['followup', 'call'].includes(item.activityType.toLowerCase())),
        visits: activities.filter(item => ['visit', 'task_visit'].includes(item.activityType.toLowerCase())),
        notes: activities.filter(item => item.activityType.toLowerCase() === 'note'),
      },
    };
  }

  async createActivity(uuid: string, dto: CreateFollowUpActivityDto, userId?: number, currentUser?: any) {
    const lead = await this.getLead(uuid, currentUser);
    const orgId = lead.orgId ?? currentUser?.orgId ?? null;
    const actor = userId ? String(userId) : null;
    const created = await this.activities.sequelize!.transaction(async transaction => {
      const activity = await this.activities.create({
        leadId: lead.id,
        activityType: dto.activityType,
        activityDate: dto.activityDate ? new Date(dto.activityDate) : new Date(),
        summary: dto.comment,
        feedback: dto.feedback,
        discussionPoints: dto.communicationStatus,
        nextFollowupDate: dto.nextFollowupDate ? new Date(dto.nextFollowupDate) : undefined,
        visitPlaceId: dto.visitPlaceId,
        visitStatusId: dto.visitStatusId,
        conductedBy: dto.conductedBy,
        projectId: lead.projectId,
        orgId,
        createdBy: actor,
      } as any, { transaction });
      const leadChanges: any = {};
      if (dto.leadStageId !== undefined) leadChanges.leadStageId = dto.leadStageId;
      if (dto.leadStatus) leadChanges.status = dto.leadStatus;
      if (dto.junkNote) leadChanges.notes = dto.junkNote;
      if (actor) leadChanges.updatedBy = actor;
      if (Object.keys(leadChanges).length) await lead.update(leadChanges, { transaction });
      return activity;
    });
    return created;
  }

  async addNote(uuid: string, note: string, userId?: number, currentUser?: any) {
    if (!note?.trim()) throw new BadRequestException('note is required');
    return this.createActivity(uuid, { activityType: 'note', comment: note } as CreateFollowUpActivityDto, userId, currentUser);
  }

  async listRequirements(uuid: string, currentUser?: any) {
    const lead = await this.getLead(uuid, currentUser);
    return this.requirements.findAll({ where: { leadId: lead.id }, include: ['requirementType'], order: [['createdAt', 'DESC']] });
  }

  async createRequirement(uuid: string, dto: UpsertLeadRequirementDto, userId?: number, currentUser?: any) {
    const lead = await this.getLead(uuid, currentUser);
    const orgId = lead.orgId ?? currentUser?.orgId ?? null;
    const actor = userId ? String(userId) : null;
    return this.requirements.create({
      ...dto,
      leadId: lead.id,
      projectId: lead.projectId,
      orgId,
      createdBy: actor,
    } as any);
  }

  async updateRequirement(uuid: string, requirementUuid: string, dto: UpsertLeadRequirementDto, userId?: number, currentUser?: any) {
    const lead = await this.getLead(uuid, currentUser);
    const row = await this.requirements.findOne({ where: { uuid: requirementUuid, leadId: lead.id } });
    if (!row) throw new NotFoundException(`Requirement ${requirementUuid} not found`);
    const changes: any = { ...dto };
    if (userId) changes.updatedBy = String(userId);
    await row.update(changes);
    return row;
  }

  async deleteRequirement(uuid: string, requirementUuid: string, userId?: number, currentUser?: any) {
    const lead = await this.getLead(uuid, currentUser);
    const row = await this.requirements.findOne({ where: { uuid: requirementUuid, leadId: lead.id } });
    if (!row) throw new NotFoundException(`Requirement ${requirementUuid} not found`);
    if (userId) await row.update({ deletedBy: String(userId) });
    await row.destroy();
    return { deleted: true };
  }

  async listInterests(uuid: string, currentUser?: any) {
    const lead = await this.getLead(uuid, currentUser);
    const rows = await this.interests.findAll({ where: { leadId: lead.id }, order: [['createdAt', 'DESC']] });
    const projects = await this.projectMap(rows.map(item => item.projectId));
    return rows.map(item => ({ ...item.toJSON(), project: projects.get(item.projectId ?? '') ?? null }));
  }

  async listNegotiations(uuid: string, currentUser?: any) {
    const lead = await this.getLead(uuid, currentUser);
    return this.negotiations.findAll({ where: { leadId: lead.id }, include: ['project', 'flatLand', 'creator'], order: [['createdAt', 'DESC']] });
  }

  async createNegotiation(uuid: string, dto: CreateNegotiationDto, userId?: number, currentUser?: any) {
    const lead = await this.getLead(uuid, currentUser);
    const project = await this.projects.findOne({ where: { uuid: dto.projectId } as any });
    if (!project) throw new BadRequestException(`Project ${dto.projectId} not found`);
    if (dto.flatLandId) {
      const property = await this.flatLand.findOne({ where: { uuid: dto.flatLandId } as any });
      if (!property || property.projectId !== dto.projectId) throw new BadRequestException('Flat/land must belong to the selected project');
    }
    const orgId = lead.orgId ?? currentUser?.orgId ?? null;
    const actor = userId ? String(userId) : null;
    return this.negotiations.create({
      ...dto,
      leadId: lead.id,
      projectId: dto.projectId,
      roundNo: dto.roundNo ?? 1,
      status: dto.status ?? CrmNegotiationStatus.PENDING,
      orgId,
      createdBy: actor,
    } as any);
  }

  async updateNegotiation(uuid: string, negotiationUuid: string, dto: UpdateNegotiationDto, userId?: number, currentUser?: any) {
    const row = await this.getNegotiation(uuid, negotiationUuid, currentUser);
    if (dto.projectId) {
      const project = await this.projects.findOne({ where: { uuid: dto.projectId } as any });
      if (!project) throw new BadRequestException(`Project ${dto.projectId} not found`);
    }
    const actor = userId ? String(userId) : null;
    await row.update({
      ...dto,
      ...(dto.status !== undefined ? { status: dto.status as CrmNegotiationStatus } : {}),
      ...(actor ? { updatedBy: actor } : {}),
    } as any);
    return row;
  }

  async deleteNegotiation(uuid: string, negotiationUuid: string, userId?: number, currentUser?: any) {
    const row = await this.getNegotiation(uuid, negotiationUuid, currentUser);
    if (userId) await row.update({ deletedBy: String(userId) } as any);
    await row.destroy();
    return { deleted: true };
  }

  async setNegotiationStatus(uuid: string, negotiationUuid: string, status: CrmNegotiationStatus, userId?: number, currentUser?: any) {
    const row = await this.getNegotiation(uuid, negotiationUuid, currentUser);
    const actor = userId ? String(userId) : null;
    await row.update({ status, ...(actor ? { updatedBy: actor } : {}) } as any);
    return row;
  }

  async createInterest(uuid: string, dto: UpsertPropertyInterestDto, userId?: number, currentUser?: any) {
    const lead = await this.getLead(uuid, currentUser);
    const orgId = lead.orgId ?? currentUser?.orgId ?? null;
    const actor = userId ? String(userId) : null;
    return this.interests.create({
      ...dto,
      leadId: lead.id,
      projectId: dto.projectId ?? lead.projectId,
      status: dto.status ?? 'interested',
      orgId,
      createdBy: actor,
    } as any);
  }

  async updateInterest(uuid: string, interestUuid: string, dto: UpsertPropertyInterestDto, userId?: number, currentUser?: any) {
    const lead = await this.getLead(uuid, currentUser);
    const row = await this.interests.findOne({ where: { uuid: interestUuid, leadId: lead.id } });
    if (!row) throw new NotFoundException(`Property interest ${interestUuid} not found`);
    const actor = userId ? String(userId) : null;
    await row.update({ ...dto, ...(actor ? { updatedBy: actor } : {}) });
    return row;
  }

  async deleteInterest(uuid: string, interestUuid: string, userId?: number, currentUser?: any) {
    const lead = await this.getLead(uuid, currentUser);
    const row = await this.interests.findOne({ where: { uuid: interestUuid, leadId: lead.id } });
    if (!row) throw new NotFoundException(`Property interest ${interestUuid} not found`);
    if (userId) await row.update({ deletedBy: String(userId) });
    await row.destroy();
    return { deleted: true };
  }

  async listActivities(uuid: string, type: string, currentUser?: any) {
    const lead = await this.getLead(uuid, currentUser);
    const where: any = { leadId: lead.id };
    if (type === 'upcoming') where.nextFollowupDate = { [Op.not]: null };
    else if (type === 'visits') where.activityType = { [Op.in]: ['visit', 'task_visit'] };
    else if (type === 'follow-ups') where.activityType = { [Op.in]: ['followup', 'call'] };
    else where.activityType = 'note';
    const rows = await this.activities.findAll({ where, include: ['visitPlace', 'visitStatus'], order: [['activityDate', 'DESC']] });
    const users = await this.userMap(rows.map(row => row.conductedBy));
    return rows.map(row => ({ ...row.toJSON(), communicationStatus: row.discussionPoints ?? null, conductedByUser: users.get(row.conductedBy ?? '') ?? null }));
  }

  private async getLead(uuid: string, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    const lead = await this.leads.findOne({ where });
    if (!lead) throw new NotFoundException(`Lead ${uuid} not found`);
    return lead;
  }

  private async getNegotiation(leadUuid: string, negotiationUuid: string, currentUser?: any) {
    const lead = await this.getLead(leadUuid, currentUser);
    const row = await this.negotiations.findOne({ where: { uuid: negotiationUuid, leadId: lead.id } as any, include: ['project', 'flatLand', 'creator'] });
    if (!row) throw new NotFoundException(`Negotiation ${negotiationUuid} not found`);
    return row;
  }

  private async projectMap(ids: Array<string | null | undefined>) {
    const values = [...new Set(ids.filter((id): id is string => !!id))];
    if (!values.length) return new Map<string, Project>();
    const uuidValues = values.filter(value => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value));
    const codeValues = values.filter(value => !uuidValues.includes(value));
    const projects = await this.projects.findAll({
      where: { [Op.or]: [...(uuidValues.length ? [{ uuid: { [Op.in]: uuidValues } }] : []), ...(codeValues.length ? [{ code: { [Op.in]: codeValues } }] : [])] } as any,
      attributes: ['uuid', 'code', 'name', 'status'],
    });
    return new Map(projects.flatMap(project => [[project.uuid, project], [project.code, project]]));
  }

  private async userMap(ids: Array<string | null | undefined>) {
    const values = [...new Set(ids.filter((id): id is string => typeof id === 'string' && !!id))];
    if (!values.length) return new Map<string, { uuid: string; name: string }>();
    const uuids = values.filter(value => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value));
    const userCodes = values.filter(value => !uuids.includes(value));
    const users = await this.users.findAll({
      where: { [Op.or]: [...(uuids.length ? [{ uuid: { [Op.in]: uuids } }] : []), ...(userCodes.length ? [{ userCode: { [Op.in]: userCodes } }] : [])] } as any,
      attributes: ['uuid', 'userCode', 'name'],
    });
    const result = new Map<string, { uuid: string; name: string }>();
    for (const user of users) {
      const value = { uuid: user.uuid, name: user.name };
      result.set(user.uuid, value);
      if (user.userCode) result.set(user.userCode, value);
    }
    return result;
  }
}
