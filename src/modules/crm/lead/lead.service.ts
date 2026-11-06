import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { LeadStage } from 'src/database/models/crm/configuration/crm-lead-stage.model';
import { CommunicationStatus, CommunicationStatusState } from 'src/database/models/crm/configuration/crm-communication-status.model';
import { LeadActivity } from 'src/database/models/crm/lead/crm-lead-activity.model';
import { LeadCallAssignment } from 'src/database/models/crm/lead/crm-lead-call-assignment.model';
import { LeadPropertyInterest } from 'src/database/models/crm/lead/crm-lead-property-interest.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { CrmOffer } from 'src/database/models/crm/configuration/crm-offer.model';
import { LeadTransferLog } from 'src/database/models/crm/lead/crm-lead-transfer-log.model';
import { LeadArea, LeadCampaign, LeadCategory, LeadPriceRange, LeadProfession, LeadSource, LeadTeam } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { LeadTeamMember } from 'src/database/models/crm/lead/crm-lead-team-member.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { CreateLeadDto } from './dto/create-lead.dto';
import { QueryLeadDto } from './dto/query-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { QueryJunkLeadDto } from './dto/query-junk-lead.dto';
import { JunkLeadActionDto } from './dto/junk-lead-action.dto';
import { QueryTransferLeadListDto } from './dto/query-transfer-lead-list.dto';

@Injectable()
export class LeadService {
  constructor(
    @InjectModel(Lead) private readonly leads: typeof Lead,
    @InjectModel(CrmOffer) private readonly offers: typeof CrmOffer,
    @InjectModel(LeadStage) private readonly stages: typeof LeadStage,
    @InjectModel(CommunicationStatus) private readonly communicationStatuses: typeof CommunicationStatus,
    @InjectModel(LeadCategory) private readonly categories: typeof LeadCategory,
    @InjectModel(LeadSource) private readonly sources: typeof LeadSource,
    @InjectModel(LeadCampaign) private readonly campaigns: typeof LeadCampaign,
    @InjectModel(LeadProfession) private readonly professions: typeof LeadProfession,
    @InjectModel(LeadArea) private readonly areas: typeof LeadArea,
    @InjectModel(LeadPriceRange) private readonly priceRanges: typeof LeadPriceRange,
    @InjectModel(LeadTeam) private readonly teams: typeof LeadTeam,
    @InjectModel(LeadTeamMember) private readonly teamMembers: typeof LeadTeamMember,
    @InjectModel(LeadActivity) private readonly activities: typeof LeadActivity,
    @InjectModel(LeadCallAssignment) private readonly callAssignments: typeof LeadCallAssignment,
    @InjectModel(LeadTransferLog) private readonly transferLogs: typeof LeadTransferLog,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
    @InjectModel(Project) private readonly projects: typeof Project,
  ) {}

  async create(dto: CreateLeadDto) {
    const leadCode = dto.leadCode?.trim() || await this.nextCode();
    const { projectName, offerUuid, ...leadData } = dto;
    const offer = offerUuid ? await this.getActiveOffer(offerUuid) : undefined;
    const row = await this.leads.create({ ...leadData, ...(offer ? { offerId: offer.id } : {}), leadCode, leadDate: dto.leadDate ?? new Date().toISOString().slice(0, 10) } as any);
    if (projectName) await LeadPropertyInterest.create({ leadId: row.id, projectName, projectId: row.projectId } as any);
    return this.findOne(row.uuid);
  }

  async findAll(query: QueryLeadDto) {
    const page = query.page ?? 1; const limit = query.limit ?? 10;
    const where: any = {};
    const text = query.search?.trim();
    if (text) where[Op.or] = [
      { clientName: { [Op.iLike]: `%${text}%` } }, { phone: { [Op.iLike]: `%${text}%` } },
      { alternatePhone: { [Op.iLike]: `%${text}%` } }, { email: { [Op.iLike]: `%${text}%` } },
      { leadCode: { [Op.iLike]: `%${text}%` } }, { organization: { [Op.iLike]: `%${text}%` } },
      { presentAddress: { [Op.iLike]: `%${text}%` } },
    ];
    for (const key of ['leadCategoryId', 'leadStageId', 'leadSourceId', 'campaignId', 'areaId', 'professionId', 'assignedTo', 'creditOfficerId', 'leadType', 'status'] as const) {
      if (query[key] !== undefined) where[key] = query[key];
    }
    if (query.createdBy) where.createdBy = query.createdBy;
    if (query.occasion === 'birthDate' || query.occasion === 'anniversaryDate') where[query.occasion] = { [Op.not]: null };
    if (query.teamId) {
      const members = await this.teamMembers.findAll({ where: { teamId: query.teamId, isActive: true }, attributes: ['userId'] });
      where.assignedTo = { [Op.in]: members.map(member => member.userId) };
    }
    if (query.dateFrom || query.dateTo) where.leadDate = { ...(query.dateFrom ? { [Op.gte]: query.dateFrom } : {}), ...(query.dateTo ? { [Op.lte]: query.dateTo } : {}) };
    const include: any[] = [
      { association: 'category', attributes: ['id', 'name'], required: false }, { association: 'stage', attributes: ['id', 'name'], required: false },
      { association: 'source', attributes: ['id', 'name'], required: false }, { association: 'campaign', attributes: ['id', 'name'], required: false },
      { association: 'profession', attributes: ['id', 'name'], required: false }, { association: 'offer', attributes: ['uuid', 'name', 'status'], required: false }, { association: 'area', attributes: ['id', 'name'], required: false },
      { association: 'activities', required: false, separate: true, limit: 1, order: [['activityDate', 'DESC']] },
      { association: 'propertyInterests', required: false, separate: true, limit: 1, order: [['createdAt', 'DESC']] },
    ];
    if (query.projectName) include.push({ association: 'propertyInterests', where: { projectName: { [Op.iLike]: `%${query.projectName}%` } }, required: true });
    const { rows, count } = await this.leads.findAndCountAll({ where, include, limit, offset: (page - 1) * limit, order: [['createdAt', 'DESC']], distinct: true, paranoid: !query.withDeleted });
    const users = await this.userMap(rows.flatMap(row => [row.assignedTo, row.creditOfficerId]));
    return {
      data: rows.map(row => {
        const item = row.toJSON() as any;
        item.created_at = item.created_at ?? item.createdAt;
        item.updated_at = item.updated_at ?? item.updatedAt;
        item.deleted_at = item.deleted_at ?? item.deletedAt ?? null;
        delete item.createdAt;
        delete item.updatedAt;
        delete item.deletedAt;
        item.created_by = item.createdBy ?? item.created_by ?? null;
        item.updated_by = item.updatedBy ?? item.updated_by ?? null;
        item.deleted_by = item.deletedBy ?? item.deleted_by ?? null;
        delete item.createdBy;
        delete item.updatedBy;
        delete item.deletedBy;
        return {
          ...item,
          assignedUser: users.get(row.assignedTo ?? '') ?? null,
          creditOfficer: users.get(row.creditOfficerId ?? '') ?? null,
        };
      }),
      meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 },
    };
  }

  async findOne(uuid: string) {
    const row = await this.leads.findOne({ where: { uuid }, include: ['category', 'stage', 'source', 'campaign', 'profession', 'offer', 'area', 'priceRange', 'activities', 'attachments', 'callAssignments', 'propertyInterests', 'requirements', 'transferLogs'] });
    if (!row) throw new NotFoundException(`Lead ${uuid} not found`);
    const users = await this.userMap([row.assignedTo, row.creditOfficerId]);
    const item = row.toJSON() as any;
    item.created_at = item.created_at ?? item.createdAt;
    item.updated_at = item.updated_at ?? item.updatedAt;
    item.deleted_at = item.deleted_at ?? item.deletedAt ?? null;
    delete item.createdAt;
    delete item.updatedAt;
    delete item.deletedAt;
    item.created_by = item.createdBy ?? item.created_by ?? null;
    item.updated_by = item.updatedBy ?? item.updated_by ?? null;
    item.deleted_by = item.deletedBy ?? item.deleted_by ?? null;
    delete item.createdBy;
    delete item.updatedBy;
    delete item.deletedBy;
    return {
      ...item,
      assignedUser: users.get(row.assignedTo ?? '') ?? null,
      creditOfficer: users.get(row.creditOfficerId ?? '') ?? null,
    };
  }

  async transferLeadList(query: QueryTransferLeadListDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    if (query.fromUserId) where.transferredFrom = query.fromUserId;
    if (query.toUserId) where.transferredTo = query.toUserId;
    if (query.dateFrom || query.dateTo) {
      where.transferDate = {
        ...(query.dateFrom ? { [Op.gte]: new Date(`${query.dateFrom}T00:00:00.000Z`) } : {}),
        ...(query.dateTo ? { [Op.lte]: new Date(`${query.dateTo}T23:59:59.999Z`) } : {}),
      };
    }
    const search = query.search?.trim();
    const leadInclude: any = {
      association: 'lead',
      required: !!search,
      // Transfer history must retain lead identity after its source lead is soft-deleted.
      paranoid: false,
      include: [{ association: 'activities', required: false, separate: true, limit: 1, order: [['activityDate', 'DESC']] }],
    };
    if (search) {
      where[Op.or] = [
        { transferReason: { [Op.iLike]: `%${search}%` } },
        { '$lead.leadCode$': { [Op.iLike]: `%${search}%` } },
        { '$lead.clientName$': { [Op.iLike]: `%${search}%` } },
        { '$lead.phone$': { [Op.iLike]: `%${search}%` } },
        { '$lead.alternatePhone$': { [Op.iLike]: `%${search}%` } },
      ];
    }
    const { rows, count } = await this.transferLogs.findAndCountAll({
      where,
      include: [
        leadInclude,
      ],
      limit,
      offset: (page - 1) * limit,
      order: [['transferDate', 'DESC'], ['id', 'DESC']],
      distinct: true,
    });
    const users = await this.userMap(rows.flatMap(record => [record.transferredFrom, record.transferredTo]));
    return {
      data: rows.map(record => {
        const lead = record.lead;
        return {
          ...record.toJSON(),
          leadCode: lead?.leadCode ?? null,
          name: lead?.clientName ?? null,
          mobile: lead?.phone ?? null,
          from: users.get(record.transferredFrom)?.name ?? null,
          to: users.get(record.transferredTo)?.name ?? null,
          sourceUser: users.get(record.transferredFrom) ?? null,
          targetUser: users.get(record.transferredTo) ?? null,
          date: record.transferDate,
          lastActivity: lead?.activities?.[0] ?? null,
        };
      }),
      meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 },
    };
  }

  async transferLeadListDropdown() {
    const users = await this.users.findAll({
      where: { isActive: true },
      attributes: ['uuid', 'name'],
      order: [['name', 'ASC']],
    });
    const options = users.map(user => ({ uuid: user.uuid, name: user.name }));
    return { fromUsers: options, toUsers: options };
  }

  async transferLeadListDetails(uuid: string) {
    const record = await this.transferLogs.findOne({ where: { uuid },
      include: [
        { association: 'lead', paranoid: false, include: [{ association: 'activities', required: false, separate: true, order: [['activityDate', 'DESC']] }] },
      ],
    });
    if (!record) throw new NotFoundException(`Transfer record ${uuid} not found`);
    const users = await this.userMap([record.transferredFrom, record.transferredTo]);
    return {
      ...record.toJSON(),
      sourceUser: users.get(record.transferredFrom) ?? null,
      targetUser: users.get(record.transferredTo) ?? null,
    };
  }

  async findJunk(query: QueryJunkLeadDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = { status: 'junk' };
    if (query.leadCategoryId) where.leadCategoryId = query.leadCategoryId;
    if (query.userId) where.assignedTo = query.userId;
    if (query.dateFrom || query.dateTo) {
      where.leadDate = {
        ...(query.dateFrom ? { [Op.gte]: query.dateFrom } : {}),
        ...(query.dateTo ? { [Op.lte]: query.dateTo } : {}),
      };
    }
    const search = query.search?.trim();
    if (search) where[Op.or] = [
      { clientName: { [Op.iLike]: `%${search}%` } },
      { phone: { [Op.iLike]: `%${search}%` } },
      { alternatePhone: { [Op.iLike]: `%${search}%` } },
      { leadCode: { [Op.iLike]: `%${search}%` } },
      { organization: { [Op.iLike]: `%${search}%` } },
      { presentAddress: { [Op.iLike]: `%${search}%` } },
      { notes: { [Op.iLike]: `%${search}%` } },
      { initialRemark: { [Op.iLike]: `%${search}%` } },
    ];

    const { rows, count } = await this.leads.findAndCountAll({
      where,
      include: [
        { association: 'category', attributes: ['id', 'name'], required: false },
        { association: 'activities', required: false, separate: true, limit: 1, order: [['activityDate', 'DESC']] },
      ],
      limit,
      offset: (page - 1) * limit,
      order: [['leadDate', 'DESC'], ['id', 'DESC']],
      distinct: true,
    });
    const users = await this.userMap(rows.map(lead => lead.assignedTo));
    return {
      data: rows.map(lead => ({
        ...lead.toJSON(),
        assignedUser: users.get(lead.assignedTo ?? '') ?? null,
        note: lead.initialRemark ?? lead.notes ?? lead.query ?? null,
        lastActivity: lead.activities?.[0] ?? null,
      })),
      meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 },
    };
  }

  async markJunk(dto: JunkLeadActionDto) {
    const ids = await this.resolveLeadIds(dto.ids, dto.uuids);
    if (!ids.length) throw new BadRequestException('ids or uuids are required');
    const [updated] = await this.leads.update(
      { status: 'junk', ...(dto.note ? { notes: dto.note } : {}) },
      { where: { id: { [Op.in]: ids }, status: { [Op.ne]: 'junk' } } },
    );
    return { markedAsJunk: updated };
  }

  async restoreJunk(uuid: string) {
    const lead = await this.leads.findOne({ where: { uuid, status: 'junk' } });
    if (!lead) throw new NotFoundException(`Junk lead ${uuid} not found`);
    await lead.update({ status: 'active' });
    return this.findOne(uuid);
  }

  async bulkRestoreJunk(ids?: number[], uuids?: string[]) {
    const leadIds = await this.resolveLeadIds(ids, uuids);
    if (!leadIds.length) throw new BadRequestException('ids or uuids are required');
    const [restored] = await this.leads.update({ status: 'active' }, { where: { id: { [Op.in]: leadIds }, status: 'junk' } });
    return { restored };
  }

  async deleteJunk(uuid: string) {
    const lead = await this.leads.findOne({ where: { uuid, status: 'junk' } });
    if (!lead) throw new NotFoundException(`Junk lead ${uuid} not found`);
    await lead.destroy();
    return { message: `Junk lead ${uuid} deleted successfully` };
  }

  async bulkDeleteJunk(ids?: number[], uuids?: string[]) {
    const leadIds = await this.resolveLeadIds(ids, uuids);
    if (!leadIds.length) throw new BadRequestException('ids or uuids are required');
    const deleted = await this.leads.destroy({ where: { id: { [Op.in]: leadIds }, status: 'junk' } });
    return { deleted };
  }

  async update(uuid: string, dto: UpdateLeadDto) {
    const row = await this.getActive(uuid);
    const { offerUuid, projectName, ...leadChanges } = dto;
    const changes: Record<string, any> = { ...leadChanges };
    if (offerUuid !== undefined) changes.offerId = offerUuid ? (await this.getActiveOffer(offerUuid)).id : null;
    await row.update(changes);
    if (projectName !== undefined) {
      const current = await LeadPropertyInterest.findOne({ where: { leadId: row.id }, order: [['createdAt', 'DESC']] });
      if (projectName.trim()) {
        if (current) await current.update({ projectName, projectId: dto.projectId ?? row.projectId });
        else await LeadPropertyInterest.create({ leadId: row.id, projectName, projectId: dto.projectId ?? row.projectId } as any);
      } else if (current) await current.destroy();
    }
    return this.findOne(uuid);
  }
  async remove(uuid: string) { const row = await this.getActive(uuid); await row.destroy(); return { message: `Lead ${uuid} deleted successfully` }; }
  async restore(uuid: string) { const row = await this.leads.findOne({ where: { uuid }, paranoid: false }); if (!row) throw new NotFoundException(`Lead ${uuid} not found`); if (!row.deletedAt) throw new BadRequestException('Lead is not deleted'); await row.restore(); return this.findOne(uuid); }

  async dropdown(entity: string) {
    const active = { isActive: true } as any;
    switch (entity.toLowerCase()) {
      case 'stage': case 'stages': return this.stages.findAll({ where: active, attributes: ['id', 'uuid', 'name'], order: [['name', 'ASC']] });
      case 'category': case 'categories': return this.categories.findAll({ where: active, attributes: ['id', 'name', 'code'], order: [['name', 'ASC']] });
      case 'source': case 'sources': return this.sources.findAll({ where: active, attributes: ['id', 'name', 'code'], order: [['name', 'ASC']] });
      case 'campaign': case 'campaigns': return this.campaigns.findAll({ attributes: ['id', 'name', 'channel'], order: [['name', 'ASC']] });
      case 'profession': case 'professions': return this.professions.findAll({ attributes: ['id', 'name'], order: [['name', 'ASC']] });
      case 'area': case 'areas': return this.areas.findAll({ attributes: ['id', 'name', 'city', 'zone'], order: [['name', 'ASC']] });
      case 'price-range': case 'price-ranges': return this.priceRanges.findAll({ attributes: ['id', 'name', 'minPrice', 'maxPrice'], order: [['name', 'ASC']] });
      case 'team': case 'teams': return this.teams.findAll({ where: active, attributes: ['id', 'name'], order: [['name', 'ASC']] });
      case 'user': case 'users': return this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'name', 'designationName', 'userType'], order: [['name', 'ASC']] });
      case 'project': case 'projects': return this.projects.findAll({ attributes: ['uuid', 'name'], order: [['name', 'ASC']] });
      case 'communication-status': case 'communication-statuses': return this.communicationStatuses.findAll({ where: { status: CommunicationStatusState.ACTIVE }, attributes: ['uuid', 'name'], order: [['name', 'ASC']] });
      case 'lead-type': return [{ value: 'new', label: 'New' }, { value: 'prospect', label: 'Prospect' }, { value: 'priority', label: 'Priority' }];
      case 'status': return [{ value: 'active', label: 'Active' }, { value: 'junk', label: 'Junk' }, { value: 'converted', label: 'Converted' }];
      case 'occasion': return [{ value: 'birthDate', label: 'Birthday' }, { value: 'anniversaryDate', label: 'Anniversary' }];
      case 'team-member': case 'team-members': {
        const members = await this.teamMembers.findAll({ where: { isActive: true }, include: [{ association: 'team', required: false }] });
        const users = await this.userMap(members.map(member => member.userId));
        return members.map(member => ({
          ...member.toJSON(),
          user: users.get(member.userId) ?? null,
        }));
      }
      default: throw new BadRequestException(`Unsupported lead dropdown: ${entity}`);
    }
  }

  private async userMap(ids: Array<string | null | undefined>) {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const uuids = [...new Set(ids.filter((id): id is string => typeof id === 'string' && uuidPattern.test(id)))];
    if (!uuids.length) return new Map<string, { uuid: string; name: string }>();
    const users = await this.users.findAll({ where: { uuid: { [Op.in]: uuids } }, attributes: ['uuid', 'name'], paranoid: false });
    return new Map(users.map(user => [user.uuid, { uuid: user.uuid, name: user.name }]));
  }

  async callAssign(dto: any) {
    const ids: number[] = await this.resolveLeadIds(dto.leadIds, dto.leadUuids, dto.leadId ? [dto.leadId] : undefined);
    if (!ids.length) throw new BadRequestException('leadIds or leadUuids are required');
    const leads = await this.leads.findAll({ where: { id: { [Op.in]: ids } } });
    if (leads.length !== ids.length) throw new NotFoundException('One or more leads were not found');
    const date = dto.date ? new Date(dto.date) : new Date();
    return this.callAssignments.sequelize!.transaction(async transaction => {
      const result = [];
      for (const lead of leads) {
        const assignedTo = dto.assignedTo ?? lead.assignedTo;
        if (!assignedTo) throw new BadRequestException(`Lead ${lead.uuid} has no assigned user; assignedTo is required`);
        result.push(await this.callAssignments.create({ leadId: lead.id, assignedFrom: dto.assignedFrom ?? lead.assignedTo ?? assignedTo, assignedTo, assignmentDate: date, dueDate: dto.dueDate, instruction: dto.note, assignedUserType: dto.assignUserType ?? 'Officer/SR', status: 'pending', projectId: lead.projectId }, { transaction }));
        if (dto.assignedTo) await lead.update({ assignedTo }, { transaction });
      }
      return result;
    });
  }

  async transfer(dto: any) {
    const ids: number[] = await this.resolveLeadIds(dto.leadIds, dto.leadUuids);
    if (!ids.length || !Array.isArray(dto.assignments) || !dto.assignments.length) throw new BadRequestException('leadIds/leadUuids and assignments are required');
    const leads = await this.leads.findAll({ where: { id: { [Op.in]: ids } } });
    if (leads.length !== ids.length) throw new NotFoundException('One or more leads were not found');
    const assignments = dto.assignments as Array<{ userId: string; quantity?: number }>;
    let cursor = 0;
    return this.leads.sequelize!.transaction(async transaction => {
      const logs = [];
      for (const assignment of assignments) {
        const quantity = dto.manualSet ? Number(assignment.quantity ?? 0) : Math.ceil(leads.length / assignments.length);
        for (let n = 0; n < quantity && cursor < leads.length; n++, cursor++) {
          const lead = leads[cursor];
          logs.push(await this.transferLogs.create({ leadId: lead.id, transferredFrom: lead.assignedTo ?? dto.transferredFrom ?? assignment.userId, transferredTo: assignment.userId, transferReason: dto.note, transferDate: dto.date ? new Date(dto.date) : new Date(), transferType: dto.assignType ?? 'Officer/SR', followup: !!dto.followup, manualSet: !!dto.manualSet, assignedQuantity: quantity, projectId: lead.projectId }, { transaction }));
          await lead.update({ assignedTo: assignment.userId }, { transaction });
        }
      }
      if (cursor < leads.length) throw new BadRequestException('Assignment quantities do not cover all selected leads');
      return logs;
    });
  }

  async bulkDelete(ids: number[], uuids?: string[]) { const leadIds = await this.resolveLeadIds(ids, uuids); if (!leadIds.length) throw new BadRequestException('ids or uuids are required'); const count = await this.leads.destroy({ where: { id: { [Op.in]: leadIds } } }); return { deleted: count }; }
  async bulkImport(rows: CreateLeadDto[]) {
    if (!Array.isArray(rows) || !rows.length) throw new BadRequestException('rows are required');
    return this.leads.sequelize!.transaction(async transaction => {
      const data = [];
      for (const input of rows) {
        const { projectName, ...leadData } = input;
        const row = await this.leads.create({ ...leadData, leadCode: input.leadCode || await this.nextCode(), leadDate: input.leadDate ?? new Date().toISOString().slice(0, 10) } as any, { transaction });
        if (projectName) await LeadPropertyInterest.create({ leadId: row.id, projectName, projectId: row.projectId } as any, { transaction });
        data.push(row);
      }
      return { imported: data.length, data };
    });
  }
  async addActivity(uuid: string, dto: any) { const lead = await this.getActive(uuid); const row = await this.activities.create({ ...dto, leadId: lead.id, activityDate: dto.activityDate ?? new Date(), projectId: lead.projectId }); return row; }

  private async resolveLeadIds(ids?: Array<number | string>, uuids?: string[], fallback?: Array<number | string>) {
    const numericIds = [...(ids ?? []), ...(fallback ?? [])].map(Number).filter(Number.isInteger);
    const leadUuids = (uuids ?? []).filter(Boolean);
    if (!leadUuids.length) return [...new Set(numericIds)];
    const matches = await this.leads.findAll({ where: { uuid: { [Op.in]: leadUuids } }, attributes: ['id', 'uuid'] });
    if (matches.length !== new Set(leadUuids).size) throw new NotFoundException('One or more leads were not found');
    return [...new Set([...numericIds, ...matches.map((lead) => Number(lead.id))])];
  }

  private async getActive(uuid: string) { const row = await this.leads.findOne({ where: { uuid } }); if (!row) throw new NotFoundException(`Lead ${uuid} not found`); return row; }
  private async getActiveOffer(uuid: string) { const offer = await this.offers.findOne({ where: { uuid, status: 'active' } }); if (!offer) throw new BadRequestException(`Active offer ${uuid} not found`); return offer; }
  private async nextCode() { const row = await this.leads.findOne({ attributes: ['id'], order: [['id', 'DESC']], paranoid: false }); return `L${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${String(Number(row?.id ?? 0) + 1).padStart(5, '0')}`; }
}
