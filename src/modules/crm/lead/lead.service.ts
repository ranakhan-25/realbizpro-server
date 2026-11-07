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

  async create(dto: CreateLeadDto, userId?: number, currentUser?: any) {
    const leadCode = dto.leadCode?.trim() || await this.nextCode();
    const { projectName, offerUuid, ...leadData } = dto;
    const offer = offerUuid ? await this.getActiveOffer(offerUuid, currentUser) : undefined;
    const orgId = dto.orgId ?? currentUser?.orgId ?? null;
    const actor = userId ? String(userId) : null;
    const row = await this.leads.create({
      ...leadData,
      ...(offer ? { offerId: offer.id } : {}),
      leadCode,
      leadDate: dto.leadDate ?? new Date().toISOString().slice(0, 10),
      orgId,
      createdBy: actor,
    } as any);
    if (projectName) {
      await LeadPropertyInterest.create({
        leadId: row.id,
        projectName,
        projectId: row.projectId,
        orgId,
        createdBy: actor,
      } as any);
    }
    return this.findOne(row.uuid, currentUser);
  }

  async findAll(query: QueryLeadDto, currentUser?: any) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
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
        const item = this.toPublic(row);
        return {
          ...item,
          assignedUser: users.get(row.assignedTo ?? '') ?? null,
          creditOfficer: users.get(row.creditOfficerId ?? '') ?? null,
        };
      }),
      meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 },
    };
  }

  async findOne(uuid: string, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    const row = await this.leads.findOne({
      where,
      include: ['category', 'stage', 'source', 'campaign', 'profession', 'offer', 'area', 'priceRange', 'activities', 'attachments', 'callAssignments', 'propertyInterests', 'requirements', 'transferLogs'],
    });
    if (!row) throw new NotFoundException(`Lead ${uuid} not found`);
    const users = await this.userMap([row.assignedTo, row.creditOfficerId]);
    const item = this.toPublic(row);
    return {
      ...item,
      assignedUser: users.get(row.assignedTo ?? '') ?? null,
      creditOfficer: users.get(row.creditOfficerId ?? '') ?? null,
    };
  }

  async transferLeadList(query: QueryTransferLeadListDto, currentUser?: any) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
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

  async transferLeadListDropdown(currentUser?: any) {
    const users = await this.users.findAll({
      where: { isActive: true },
      attributes: ['uuid', 'name'],
      order: [['name', 'ASC']],
    });
    const options = users.map(user => ({ uuid: user.uuid, name: user.name }));
    return { fromUsers: options, toUsers: options };
  }

  async transferLeadListDetails(uuid: string, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    const record = await this.transferLogs.findOne({
      where,
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

  async findJunk(query: QueryJunkLeadDto, currentUser?: any) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = { status: 'junk' };
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
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

  async markJunk(dto: JunkLeadActionDto, userId?: number, currentUser?: any) {
    const ids = await this.resolveLeadIds(dto.ids, dto.uuids, undefined, currentUser);
    if (!ids.length) throw new BadRequestException('ids or uuids are required');
    const actor = userId ? String(userId) : null;
    const where: any = { id: { [Op.in]: ids }, status: { [Op.ne]: 'junk' } };
    if (currentUser?.orgId) where.orgId = currentUser.orgId;
    const [updated] = await this.leads.update(
      { status: 'junk', ...(dto.note ? { notes: dto.note } : {}), ...(actor ? { updatedBy: actor } : {}) },
      { where },
    );
    return { markedAsJunk: updated };
  }

  async restoreJunk(uuid: string, userId?: number, currentUser?: any) {
    const where: any = { uuid, status: 'junk' };
    if (currentUser?.orgId) where.orgId = currentUser.orgId;
    const lead = await this.leads.findOne({ where });
    if (!lead) throw new NotFoundException(`Junk lead ${uuid} not found`);
    const actor = userId ? String(userId) : null;
    await lead.update({ status: 'active', ...(actor ? { updatedBy: actor } : {}) });
    return this.findOne(uuid, currentUser);
  }

  async bulkRestoreJunk(ids?: number[], uuids?: string[], userId?: number, currentUser?: any) {
    const leadIds = await this.resolveLeadIds(ids, uuids, undefined, currentUser);
    if (!leadIds.length) throw new BadRequestException('ids or uuids are required');
    const where: any = { id: { [Op.in]: leadIds }, status: 'junk' };
    if (currentUser?.orgId) where.orgId = currentUser.orgId;
    const actor = userId ? String(userId) : null;
    const [restored] = await this.leads.update({ status: 'active', ...(actor ? { updatedBy: actor } : {}) }, { where });
    return { restored };
  }

  async deleteJunk(uuid: string, userId?: number, currentUser?: any) {
    const where: any = { uuid, status: 'junk' };
    if (currentUser?.orgId) where.orgId = currentUser.orgId;
    const lead = await this.leads.findOne({ where });
    if (!lead) throw new NotFoundException(`Junk lead ${uuid} not found`);
    if (userId) await lead.update({ deletedBy: String(userId) });
    await lead.destroy();
    return { message: `Junk lead ${uuid} deleted successfully` };
  }

  async bulkDeleteJunk(ids?: number[], uuids?: string[], userId?: number, currentUser?: any) {
    const leadIds = await this.resolveLeadIds(ids, uuids, undefined, currentUser);
    if (!leadIds.length) throw new BadRequestException('ids or uuids are required');
    const where: any = { id: { [Op.in]: leadIds }, status: 'junk' };
    if (currentUser?.orgId) where.orgId = currentUser.orgId;
    if (userId) await this.leads.update({ deletedBy: String(userId) }, { where });
    const deleted = await this.leads.destroy({ where });
    return { deleted };
  }

  async update(uuid: string, dto: UpdateLeadDto, userId?: number, currentUser?: any) {
    const row = await this.getActive(uuid, currentUser);
    const { offerUuid, projectName, ...leadChanges } = dto;
    const changes: Record<string, any> = { ...leadChanges };
    if (offerUuid !== undefined) changes.offerId = offerUuid ? (await this.getActiveOffer(offerUuid, currentUser)).id : null;
    if (userId) changes.updatedBy = String(userId);
    if (dto.orgId !== undefined) changes.orgId = dto.orgId;
    await row.update(changes);
    if (projectName !== undefined) {
      const current = await LeadPropertyInterest.findOne({ where: { leadId: row.id }, order: [['createdAt', 'DESC']] });
      if (projectName.trim()) {
        if (current) await current.update({ projectName, projectId: dto.projectId ?? row.projectId, ...(userId ? { updatedBy: String(userId) } : {}) });
        else await LeadPropertyInterest.create({ leadId: row.id, projectName, projectId: dto.projectId ?? row.projectId, orgId: row.orgId, createdBy: userId ? String(userId) : null } as any);
      } else if (current) await current.destroy();
    }
    return this.findOne(uuid, currentUser);
  }

  async remove(uuid: string, userId?: number, currentUser?: any) {
    const row = await this.getActive(uuid, currentUser);
    if (userId) await row.update({ deletedBy: String(userId) });
    await row.destroy();
    return { message: `Lead ${uuid} deleted successfully` };
  }

  async restore(uuid: string, userId?: number, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.orgId) where.orgId = currentUser.orgId;
    const row = await this.leads.findOne({ where, paranoid: false });
    if (!row) throw new NotFoundException(`Lead ${uuid} not found`);
    if (!row.deletedAt) throw new BadRequestException('Lead is not deleted');
    await row.restore();
    await row.update({ deletedBy: null, ...(userId ? { updatedBy: String(userId) } : {}) });
    return this.findOne(uuid, currentUser);
  }

  async dropdown(entity: string, currentUser?: any) {
    const active: any = { isActive: true };
    if (currentUser?.orgId) active.orgId = currentUser.orgId;
    switch (entity.toLowerCase()) {
      case 'stage': case 'stages': return this.stages.findAll({ where: { isActive: true }, attributes: ['id', 'uuid', 'name'], order: [['name', 'ASC']] });
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

  async callAssign(dto: any, userId?: number, currentUser?: any) {
    const ids: number[] = await this.resolveLeadIds(dto.leadIds, dto.leadUuids, dto.leadId ? [dto.leadId] : undefined, currentUser);
    if (!ids.length) throw new BadRequestException('leadIds or leadUuids are required');
    const leads = await this.leads.findAll({ where: { id: { [Op.in]: ids } } });
    if (leads.length !== ids.length) throw new NotFoundException('One or more leads were not found');
    const date = dto.date ? new Date(dto.date) : new Date();
    const actor = userId ? String(userId) : null;
    return this.callAssignments.sequelize!.transaction(async transaction => {
      const result = [];
      for (const lead of leads) {
        const assignedTo = dto.assignedTo ?? lead.assignedTo;
        if (!assignedTo) throw new BadRequestException(`Lead ${lead.uuid} has no assigned user; assignedTo is required`);
        result.push(await this.callAssignments.create({
          leadId: lead.id,
          assignedFrom: dto.assignedFrom ?? lead.assignedTo ?? assignedTo,
          assignedTo,
          assignmentDate: date,
          dueDate: dto.dueDate,
          instruction: dto.note,
          assignedUserType: dto.assignUserType ?? 'Officer/SR',
          status: 'pending',
          projectId: lead.projectId,
          orgId: lead.orgId ?? currentUser?.orgId ?? null,
          createdBy: actor,
        } as any, { transaction }));
        if (dto.assignedTo) await lead.update({ assignedTo, updatedBy: actor }, { transaction });
      }
      return result;
    });
  }

  async transfer(dto: any, userId?: number, currentUser?: any) {
    const ids: number[] = await this.resolveLeadIds(dto.leadIds, dto.leadUuids, undefined, currentUser);
    if (!ids.length || !Array.isArray(dto.assignments) || !dto.assignments.length) throw new BadRequestException('leadIds/leadUuids and assignments are required');
    const leads = await this.leads.findAll({ where: { id: { [Op.in]: ids } } });
    if (leads.length !== ids.length) throw new NotFoundException('One or more leads were not found');
    const assignments = dto.assignments as Array<{ userId: string; quantity?: number }>;
    let cursor = 0;
    const actor = userId ? String(userId) : null;
    return this.leads.sequelize!.transaction(async transaction => {
      const logs = [];
      for (const assignment of assignments) {
        const quantity = dto.manualSet ? Number(assignment.quantity ?? 0) : Math.ceil(leads.length / assignments.length);
        for (let n = 0; n < quantity && cursor < leads.length; n++, cursor++) {
          const lead = leads[cursor];
          logs.push(await this.transferLogs.create({
            leadId: lead.id,
            transferredFrom: lead.assignedTo ?? dto.transferredFrom ?? assignment.userId,
            transferredTo: assignment.userId,
            transferReason: dto.note,
            transferDate: dto.date ? new Date(dto.date) : new Date(),
            transferType: dto.assignType ?? 'Officer/SR',
            followup: !!dto.followup,
            manualSet: !!dto.manualSet,
            assignedQuantity: quantity,
            projectId: lead.projectId,
            orgId: lead.orgId ?? currentUser?.orgId ?? null,
            createdBy: actor,
          } as any, { transaction }));
          await lead.update({ assignedTo: assignment.userId, updatedBy: actor }, { transaction });
        }
      }
      if (cursor < leads.length) throw new BadRequestException('Assignment quantities do not cover all selected leads');
      return logs;
    });
  }

  async bulkDelete(ids: number[], uuids?: string[], userId?: number, currentUser?: any) {
    const leadIds = await this.resolveLeadIds(ids, uuids, undefined, currentUser);
    if (!leadIds.length) throw new BadRequestException('ids or uuids are required');
    const where: any = { id: { [Op.in]: leadIds } };
    if (currentUser?.orgId) where.orgId = currentUser.orgId;
    if (userId) await this.leads.update({ deletedBy: String(userId) }, { where });
    const count = await this.leads.destroy({ where });
    return { deleted: count };
  }

  async bulkImport(rows: CreateLeadDto[], userId?: number, currentUser?: any) {
    if (!Array.isArray(rows) || !rows.length) throw new BadRequestException('rows are required');
    const orgId = currentUser?.orgId ?? null;
    const actor = userId ? String(userId) : null;
    return this.leads.sequelize!.transaction(async transaction => {
      const data = [];
      for (const input of rows) {
        const { projectName, ...leadData } = input;
        const row = await this.leads.create({
          ...leadData,
          leadCode: input.leadCode || await this.nextCode(),
          leadDate: input.leadDate ?? new Date().toISOString().slice(0, 10),
          orgId: input.orgId ?? orgId,
          createdBy: actor,
        } as any, { transaction });
        if (projectName) {
          await LeadPropertyInterest.create({
            leadId: row.id,
            projectName,
            projectId: row.projectId,
            orgId: input.orgId ?? orgId,
            createdBy: actor,
          } as any, { transaction });
        }
        data.push(row);
      }
      return { imported: data.length, data };
    });
  }

  async addActivity(uuid: string, dto: any, userId?: number, currentUser?: any) {
    const lead = await this.getActive(uuid, currentUser);
    const actor = userId ? String(userId) : null;
    const row = await this.activities.create({
      ...dto,
      leadId: lead.id,
      activityDate: dto.activityDate ?? new Date(),
      projectId: lead.projectId,
      orgId: lead.orgId ?? currentUser?.orgId ?? null,
      createdBy: actor,
    } as any);
    return row;
  }

  private async resolveLeadIds(ids?: Array<number | string>, uuids?: string[], fallback?: Array<number | string>, currentUser?: any) {
    const numericIds = [...(ids ?? []), ...(fallback ?? [])].map(Number).filter(Number.isInteger);
    const leadUuids = (uuids ?? []).filter(Boolean);
    if (!leadUuids.length) return [...new Set(numericIds)];
    const where: any = { uuid: { [Op.in]: leadUuids } };
    if (currentUser?.orgId) where.orgId = currentUser.orgId;
    const matches = await this.leads.findAll({ where, attributes: ['id', 'uuid'] });
    if (matches.length !== new Set(leadUuids).size) throw new NotFoundException('One or more leads were not found');
    return [...new Set([...numericIds, ...matches.map((lead) => Number(lead.id))])];
  }

  private async getActive(uuid: string, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.orgId) where.orgId = currentUser.orgId;
    const row = await this.leads.findOne({ where });
    if (!row) throw new NotFoundException(`Lead ${uuid} not found`);
    return row;
  }

  private async getActiveOffer(uuid: string, currentUser?: any) {
    const where: any = { uuid, status: 'active' };
    if (currentUser?.orgId) where.orgId = currentUser.orgId;
    const offer = await this.offers.findOne({ where });
    if (!offer) throw new BadRequestException(`Active offer ${uuid} not found`);
    return offer;
  }

  private async nextCode() {
    const row = await this.leads.findOne({ attributes: ['id'], order: [['id', 'DESC']], paranoid: false });
    return `L${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${String(Number(row?.id ?? 0) + 1).padStart(5, '0')}`;
  }

  private async userMap(ids: Array<string | null | undefined>) {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const uuids = [...new Set(ids.filter((id): id is string => typeof id === 'string' && uuidPattern.test(id)))];
    if (!uuids.length) return new Map<string, { uuid: string; name: string }>();
    const users = await this.users.findAll({ where: { uuid: { [Op.in]: uuids } }, attributes: ['uuid', 'name'], paranoid: false });
    return new Map(users.map(user => [user.uuid, { uuid: user.uuid, name: user.name }]));
  }

  private toPublic(row: Lead) {
    const item = row.toJSON() as any;
    item.created_at = item.created_at ?? item.createdAt;
    item.updated_at = item.updated_at ?? item.updatedAt;
    item.deleted_at = item.deleted_at ?? item.deletedAt ?? null;
    delete item.createdAt;
    delete item.updatedAt;
    delete item.deletedAt;
    item.orgId = item.org_id ?? item.orgId ?? null;
    item.org_id = item.org_id ?? item.orgId ?? null;
    item.created_by = item.created_by ?? item.createdBy ?? null;
    item.updated_by = item.updated_by ?? item.updatedBy ?? null;
    item.deleted_by = item.deleted_by ?? item.deletedBy ?? null;
    delete item.createdBy;
    delete item.updatedBy;
    delete item.deletedBy;
    return item;
  }
}
