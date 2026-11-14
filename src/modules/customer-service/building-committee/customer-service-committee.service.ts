import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CsCommitteeMember } from 'src/database/models/customer-service/cs_committee_member.model';
import { CsCommitteeDecision } from 'src/database/models/customer-service/cs_committee_decision.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { extractUserContext } from '../common/customer-service-context.helper';
import {
  CreateCommitteeMemberDto,
  UpdateCommitteeMemberDto,
  QueryCommitteeMemberDto,
  CreateCommitteeDecisionDto,
  UpdateCommitteeDecisionDto,
  QueryCommitteeDecisionDto,
} from './dto';

// Pure snake_case mappers
export function toSnakeCaseMember(item: CsCommitteeMember) {
  return {
    id: item.id,
    uuid: item.uuid,
    organization_id: item.organizationId ?? null,
    project_id: item.projectId,
    project_name: item.project?.name ?? null,
    member_type: item.memberType,
    flat_number: item.flatNumber ?? null,
    name: item.name,
    designation: item.designation,
    responsibility: item.responsibility ?? null,
    phone: item.phone,
    email: item.email ?? null,
    term_start: item.termStart,
    term_end: item.termEnd ?? null,
    status: item.status,
    notes: item.notes ?? null,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

export function toSnakeCaseDecision(item: CsCommitteeDecision) {
  return {
    id: item.id,
    uuid: item.uuid,
    organization_id: item.organizationId ?? null,
    project_id: item.projectId,
    project_name: item.project?.name ?? null,
    title: item.title,
    meeting_date: item.meetingDate,
    agenda_category: item.agendaCategory,
    resolution_notes: item.resolutionNotes,
    status: item.status,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

@Injectable()
export class CustomerServiceCommitteeService {
  private readonly logger = new Logger(CustomerServiceCommitteeService.name);

  constructor(
    @InjectModel(CsCommitteeMember)
    private readonly memberModel: typeof CsCommitteeMember,
    @InjectModel(CsCommitteeDecision)
    private readonly decisionModel: typeof CsCommitteeDecision,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
  ) {}

  // =========================================================================
  // 1. COMMITTEE MEMBERS
  // =========================================================================

  async createMember(user: any, dto: CreateCommitteeMemberDto) {
    const ctx = extractUserContext(user);

    if (!dto.project_id) {
      throw new BadRequestException('Project ID is required');
    }

    const member = await this.memberModel.create({
      organizationId: ctx.orgId,
      projectId: dto.project_id,
      memberType: dto.member_type,
      flatNumber: dto.member_type === 'FLAT_OWNER' ? dto.flat_number : null,
      name: dto.name,
      designation: dto.designation,
      responsibility: dto.responsibility ?? null,
      phone: dto.phone,
      email: dto.email ?? null,
      termStart: dto.term_start,
      termEnd: dto.term_end ?? null,
      status: dto.status ?? 'ACTIVE',
      notes: dto.notes ?? null,
      createdBy: ctx.userId,
    });

    const reloaded = await this.memberModel.findByPk(member.id, {
      include: [{ model: this.projectModel, as: 'project', required: false }],
    });

    return toSnakeCaseMember(reloaded!);
  }

  async listMembers(user: any, query: QueryCommitteeMemberDto) {
    const ctx = extractUserContext(user);
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.max(1, Math.min(100, Number(query.limit || 25)));
    const offset = (page - 1) * limit;

    const where: any = {};

    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }
    if (query.project_id) {
      where.projectId = query.project_id;
    }
    if (query.member_type && query.member_type !== 'all') {
      where.memberType = query.member_type;
    }
    if (query.status && query.status !== 'all') {
      where.status = query.status;
    }
    if (query.search) {
      const s = `%${query.search.trim()}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: s } },
        { phone: { [Op.iLike]: s } },
        { flatNumber: { [Op.iLike]: s } },
        { responsibility: { [Op.iLike]: s } },
        { designation: { [Op.iLike]: s } },
      ];
    }

    const { count, rows } = await this.memberModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [
        ['status', 'ASC'],
        ['designation', 'ASC'],
        ['name', 'ASC'],
      ],
      include: [{ model: this.projectModel, as: 'project', required: false }],
    });

    // Compute stats for overview
    const allFiltered = await this.memberModel.findAll({
      where: query.project_id ? { projectId: query.project_id } : {},
      attributes: ['memberType', 'status'],
    });

    let activeCount = 0;
    let devRepCount = 0;
    let flatOwnerCount = 0;

    for (const m of allFiltered) {
      if (m.status === 'ACTIVE') activeCount++;
      if (m.memberType === 'DEVELOPER_REP') devRepCount++;
      if (m.memberType === 'FLAT_OWNER') flatOwnerCount++;
    }

    return {
      items: rows.map(toSnakeCaseMember),
      meta: {
        total: count,
        page,
        limit,
        total_pages: Math.ceil(count / limit),
      },
      stats: {
        total_members: allFiltered.length,
        active_members: activeCount,
        developer_reps_count: devRepCount,
        flat_owners_count: flatOwnerCount,
      },
    };
  }

  async getMember(user: any, uuid: string) {
    const ctx = extractUserContext(user);

    const member = await this.memberModel.findOne({
      where: {
        uuid,
        ...(ctx.isSuperAdmin || !ctx.orgId ? {} : { organizationId: ctx.orgId }),
      },
      include: [{ model: this.projectModel, as: 'project', required: false }],
    });

    if (!member) {
      throw new NotFoundException('Committee member not found');
    }

    return toSnakeCaseMember(member);
  }

  async updateMember(user: any, uuid: string, dto: UpdateCommitteeMemberDto) {
    const ctx = extractUserContext(user);

    const member = await this.memberModel.findOne({
      where: {
        uuid,
        ...(ctx.isSuperAdmin || !ctx.orgId ? {} : { organizationId: ctx.orgId }),
      },
    });

    if (!member) {
      throw new NotFoundException('Committee member not found');
    }

    await member.update({
      memberType: dto.member_type ?? member.memberType,
      flatNumber: dto.flat_number !== undefined ? dto.flat_number : member.flatNumber,
      name: dto.name ?? member.name,
      designation: dto.designation ?? member.designation,
      responsibility: dto.responsibility !== undefined ? dto.responsibility : member.responsibility,
      phone: dto.phone ?? member.phone,
      email: dto.email !== undefined ? dto.email : member.email,
      termStart: dto.term_start ?? member.termStart,
      termEnd: dto.term_end !== undefined ? dto.term_end : member.termEnd,
      status: dto.status ?? member.status,
      notes: dto.notes !== undefined ? dto.notes : member.notes,
      updatedBy: ctx.userId ?? null,
    });

    const reloaded = await this.memberModel.findByPk(member.id, {
      include: [{ model: this.projectModel, as: 'project', required: false }],
    });

    return toSnakeCaseMember(reloaded!);
  }

  async deleteMember(user: any, uuid: string) {
    const ctx = extractUserContext(user);

    const member = await this.memberModel.findOne({
      where: {
        uuid,
        ...(ctx.isSuperAdmin || !ctx.orgId ? {} : { organizationId: ctx.orgId }),
      },
    });

    if (!member) {
      throw new NotFoundException('Committee member not found');
    }

    await member.update({ deletedBy: ctx.userId ?? null });
    await member.destroy();
    return { success: true, message: 'Committee member deleted' };
  }

  // =========================================================================
  // 2. COMMITTEE DECISIONS & RESOLUTIONS
  // =========================================================================

  async createDecision(user: any, dto: CreateCommitteeDecisionDto) {
    const ctx = extractUserContext(user);

    if (!dto.project_id) {
      throw new BadRequestException('Project ID is required');
    }

    const decision = await this.decisionModel.create({
      organizationId: ctx.orgId,
      projectId: dto.project_id,
      title: dto.title,
      meetingDate: dto.meeting_date,
      agendaCategory: dto.agenda_category ?? 'General Body',
      resolutionNotes: dto.resolution_notes,
      status: dto.status ?? 'APPROVED',
      createdBy: ctx.userId,
    });

    const reloaded = await this.decisionModel.findByPk(decision.id, {
      include: [{ model: this.projectModel, as: 'project', required: false }],
    });

    return toSnakeCaseDecision(reloaded!);
  }

  async listDecisions(user: any, query: QueryCommitteeDecisionDto) {
    const ctx = extractUserContext(user);
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.max(1, Math.min(100, Number(query.limit || 25)));
    const offset = (page - 1) * limit;

    const where: any = {};

    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }
    if (query.project_id) {
      where.projectId = query.project_id;
    }
    if (query.status && query.status !== 'all') {
      where.status = query.status;
    }
    if (query.agenda_category && query.agenda_category !== 'all') {
      where.agendaCategory = query.agenda_category;
    }
    if (query.search) {
      const s = `%${query.search.trim()}%`;
      where[Op.or] = [
        { title: { [Op.iLike]: s } },
        { resolutionNotes: { [Op.iLike]: s } },
        { agendaCategory: { [Op.iLike]: s } },
      ];
    }

    const { count, rows } = await this.decisionModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['meetingDate', 'DESC'], ['id', 'DESC']],
      include: [{ model: this.projectModel, as: 'project', required: false }],
    });

    const allFiltered = await this.decisionModel.findAll({
      where: query.project_id ? { projectId: query.project_id } : {},
      attributes: ['status'],
    });

    let approvedCount = 0;
    let inProgressCount = 0;
    let implementedCount = 0;

    for (const d of allFiltered) {
      if (d.status === 'APPROVED') approvedCount++;
      if (d.status === 'IN_PROGRESS') inProgressCount++;
      if (d.status === 'IMPLEMENTED') implementedCount++;
    }

    return {
      items: rows.map(toSnakeCaseDecision),
      meta: {
        total: count,
        page,
        limit,
        total_pages: Math.ceil(count / limit),
      },
      stats: {
        total_decisions: allFiltered.length,
        approved_count: approvedCount,
        in_progress_count: inProgressCount,
        implemented_count: implementedCount,
      },
    };
  }

  async updateDecision(
    user: any,
    uuid: string,
    dto: UpdateCommitteeDecisionDto,
  ) {
    const ctx = extractUserContext(user);

    const decision = await this.decisionModel.findOne({
      where: {
        uuid,
        ...(ctx.isSuperAdmin || !ctx.orgId ? {} : { organizationId: ctx.orgId }),
      },
    });

    if (!decision) {
      throw new NotFoundException('Committee decision not found');
    }

    await decision.update({
      title: dto.title ?? decision.title,
      meetingDate: dto.meeting_date ?? decision.meetingDate,
      agendaCategory: dto.agenda_category ?? decision.agendaCategory,
      resolutionNotes: dto.resolution_notes ?? decision.resolutionNotes,
      status: dto.status ?? decision.status,
      updatedBy: ctx.userId ?? null,
    });

    const reloaded = await this.decisionModel.findByPk(decision.id, {
      include: [{ model: this.projectModel, as: 'project', required: false }],
    });

    return toSnakeCaseDecision(reloaded!);
  }

  async deleteDecision(user: any, uuid: string) {
    const ctx = extractUserContext(user);

    const decision = await this.decisionModel.findOne({
      where: {
        uuid,
        ...(ctx.isSuperAdmin || !ctx.orgId ? {} : { organizationId: ctx.orgId }),
      },
    });

    if (!decision) {
      throw new NotFoundException('Committee decision not found');
    }

    await decision.update({ deletedBy: ctx.userId ?? null });
    await decision.destroy();
    return { success: true, message: 'Committee decision deleted' };
  }

  async getOverviewStats(user: any, projectId?: string) {
    const ctx = extractUserContext(user);
    const where: any = {};
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }
    if (projectId) {
      where.projectId = projectId;
    }

    const members = await this.memberModel.findAll({ where });
    const decisions = await this.decisionModel.findAll({ where });

    let activeMembers = 0;
    let devReps = 0;
    let flatOwners = 0;

    for (const m of members) {
      if (m.status === 'ACTIVE') activeMembers++;
      if (m.memberType === 'DEVELOPER_REP') devReps++;
      if (m.memberType === 'FLAT_OWNER') flatOwners++;
    }

    let approvedDecisions = 0;
    let implementedDecisions = 0;
    for (const d of decisions) {
      if (d.status === 'APPROVED') approvedDecisions++;
      if (d.status === 'IMPLEMENTED') implementedDecisions++;
    }

    return {
      members: {
        total: members.length,
        active: activeMembers,
        developer_representatives: devReps,
        flat_owners: flatOwners,
      },
      decisions: {
        total: decisions.length,
        approved: approvedDecisions,
        implemented: implementedDecisions,
      },
    };
  }
}

