import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { CsSecurityCompany } from 'src/database/models/customer-service/cs_security_company.model';
import { CsSecurityGuard } from 'src/database/models/customer-service/cs_security_guard.model';
import { CsSecurityRoster } from 'src/database/models/customer-service/cs_security_roster.model';
import { CsSecurityVisitorLog } from 'src/database/models/customer-service/cs_security_visitor_log.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { extractUserContext } from '../common/customer-service-context.helper';
import {
  CreateSecurityCompanyDto,
  UpdateSecurityCompanyDto,
  QuerySecurityCompanyDto,
  CreateSecurityGuardDto,
  UpdateSecurityGuardDto,
  QuerySecurityGuardDto,
  CreateSecurityRosterDto,
  UpdateSecurityRosterDto,
  UpdateRosterStatusDto,
  QuerySecurityRosterDto,
  CheckInVisitorDto,
  CheckOutVisitorDto,
  QueryVisitorLogDto,
} from './dto';
import type {
  SecurityCompanyStatus,
  GuardSource,
  GuardStatus,
  RosterStatus,
  ShiftName,
  VisitorPurpose,
  VisitorStatus,
} from 'src/database/models/customer-service/cs_security.types';

// Helper to convert time strings (HH:MM or HH:MM:SS) to minutes from 00:00
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h * 60 + m;
}

// Overlap detector: returns true if two shifts on the same day overlap
export function checkShiftOverlap(
  s1Str: string,
  e1Str: string,
  s2Str: string,
  e2Str: string,
): boolean {
  let s1 = parseTimeToMinutes(s1Str);
  let e1 = parseTimeToMinutes(e1Str);
  let s2 = parseTimeToMinutes(s2Str);
  let e2 = parseTimeToMinutes(e2Str);

  // If shift wraps past midnight (e.g. 22:00 to 06:00)
  if (e1 <= s1) e1 += 1440;
  if (e2 <= s2) e2 += 1440;

  return s1 < e2 && e1 > s2;
}

// Pure snake_case mappers
export function toSnakeCaseCompany(item: CsSecurityCompany) {
  const today = new Date().toISOString().slice(0, 10);
  let computedStatus: SecurityCompanyStatus = item.status;
  let isExpiringSoon = false;
  let isExpired = false;
  let daysUntilExpiry = 0;

  if (item.contractEnd) {
    const end = new Date(item.contractEnd);
    const now = new Date();
    daysUntilExpiry = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (item.contractEnd < today) {
      isExpired = true;
      if (item.status === 'ACTIVE') computedStatus = 'EXPIRED';
    } else if (daysUntilExpiry <= 30) {
      isExpiringSoon = true;
      if (item.status === 'ACTIVE') computedStatus = 'EXPIRING_SOON';
    }
  }

  return {
    id: item.id,
    uuid: item.uuid,
    organization_id: item.organizationId ?? null,
    project_id: item.projectId ?? null,
    project_name: item.project?.name ?? null,
    name: item.name,
    contact_person: item.contactPerson,
    phone: item.phone,
    email: item.email ?? null,
    contract_start: item.contractStart,
    contract_end: item.contractEnd,
    monthly_cost: Number(item.monthlyCost || 0),
    monthly_cost_formatted: `৳ ${Number(item.monthlyCost || 0).toLocaleString('en-IN')}`,
    liability_note: item.liabilityNote,
    status: computedStatus,
    is_expiring_soon: isExpiringSoon,
    is_expired: isExpired,
    days_until_expiry: daysUntilExpiry,
    created_by: item.createdBy ?? null,
    updated_by: item.updatedBy ?? null,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

export function toSnakeCaseGuard(item: CsSecurityGuard) {
  return {
    id: item.id,
    uuid: item.uuid,
    organization_id: item.organizationId ?? null,
    project_id: item.projectId ?? null,
    project_name: item.project?.name ?? null,
    name: item.name,
    phone: item.phone,
    national_id: item.nationalId,
    source: item.source,
    company_id: item.companyId ?? null,
    company: item.company
      ? {
          id: item.company.id,
          uuid: item.company.uuid,
          name: item.company.name,
          contact_person: item.company.contactPerson,
          phone: item.company.phone,
          status: item.company.status,
        }
      : null,
    badge_number: item.badgeNumber ?? null,
    status: item.status,
    joined_date: item.joinedDate,
    emergency_contact: item.emergencyContact ?? null,
    created_by: item.createdBy ?? null,
    updated_by: item.updatedBy ?? null,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

export function toSnakeCaseRoster(item: CsSecurityRoster) {
  return {
    id: item.id,
    uuid: item.uuid,
    organization_id: item.organizationId ?? null,
    project_id: item.projectId,
    project_name: item.project?.name ?? null,
    guard_id: item.guardId,
    guard: item.guard
      ? {
          id: item.guard.id,
          uuid: item.guard.uuid,
          name: item.guard.name,
          phone: item.guard.phone,
          source: item.guard.source,
          badge_number: item.guard.badgeNumber ?? null,
          company_name: item.guard.company?.name ?? null,
        }
      : null,
    duty_date: item.dutyDate,
    shift_name: item.shiftName,
    shift_start: item.shiftStart,
    shift_end: item.shiftEnd,
    shift_timing: `${item.shiftStart?.slice(0, 5)} - ${item.shiftEnd?.slice(0, 5)}`,
    post_location: item.postLocation,
    status: item.status,
    notes: item.notes ?? null,
    created_by: item.createdBy ?? null,
    updated_by: item.updatedBy ?? null,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

export function toSnakeCaseVisitorLog(item: CsSecurityVisitorLog) {
  return {
    id: item.id,
    uuid: item.uuid,
    organization_id: item.organizationId ?? null,
    project_id: item.projectId,
    project_name: item.project?.name ?? null,
    visitor_name: item.visitorName,
    phone: item.phone,
    flat_visited: item.flatVisited,
    purpose: item.purpose,
    in_time: item.inTime,
    out_time: item.outTime ?? null,
    guard_on_duty_id: item.guardOnDutyId ?? null,
    guard_on_duty: item.guardOnDuty
      ? {
          id: item.guardOnDuty.id,
          uuid: item.guardOnDuty.uuid,
          name: item.guardOnDuty.name,
          badge_number: item.guardOnDuty.badgeNumber ?? null,
        }
      : null,
    vehicle_number: item.vehicleNumber ?? null,
    national_id_or_badge: item.nationalIdOrBadge ?? null,
    status: item.status,
    remarks: item.remarks ?? null,
    created_by: item.createdBy ?? null,
    updated_by: item.updatedBy ?? null,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

@Injectable()
export class CustomerServiceSecurityService {
  private readonly logger = new Logger(CustomerServiceSecurityService.name);

  constructor(
    @InjectModel(CsSecurityCompany)
    private readonly companyModel: typeof CsSecurityCompany,
    @InjectModel(CsSecurityGuard)
    private readonly guardModel: typeof CsSecurityGuard,
    @InjectModel(CsSecurityRoster)
    private readonly rosterModel: typeof CsSecurityRoster,
    @InjectModel(CsSecurityVisitorLog)
    private readonly visitorLogModel: typeof CsSecurityVisitorLog,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
  ) {}

  // Helper to validate and build scoped organization where-clause
  private buildOrgWhere(user: any): Record<string, any> {
    const ctx = extractUserContext(user);
    if (!ctx.isSuperAdmin && ctx.orgId) {
      return { organizationId: ctx.orgId };
    }
    return {};
  }

  // =========================================================================
  // 1. SECURITY COMPANIES
  // =========================================================================

  async createCompany(user: any, dto: CreateSecurityCompanyDto) {
    const ctx = extractUserContext(user);
    const orgId = ctx.orgId;

    if (dto.project_id) {
      const proj = await this.projectModel.findOne({
        where: {
          uuid: dto.project_id,
        } as any,
      });
      if (!proj) {
        throw new NotFoundException(`Project ${dto.project_id} not found`);
      }
    }

    const company = await this.companyModel.create({
      organizationId: orgId,
      projectId: dto.project_id ?? null,
      name: dto.name,
      contactPerson: dto.contact_person,
      phone: dto.phone,
      email: dto.email ?? null,
      contractStart: dto.contract_start,
      contractEnd: dto.contract_end,
      monthlyCost: dto.monthly_cost,
      liabilityNote: dto.liability_note,
      status: dto.status ?? 'ACTIVE',
      createdBy: ctx.userId ?? null,
    } as any);

    return toSnakeCaseCompany(company);
  }

  async getCompanies(user: any, query: QuerySecurityCompanyDto) {
    const orgWhere = this.buildOrgWhere(user);
    const where: any = { ...orgWhere };

    if (query.project_id && query.project_id !== 'all') {
      where.projectId = query.project_id;
    }

    if (query.status && query.status !== 'all') {
      where.status = query.status;
    }

    if (query.search?.trim()) {
      const s = `%${query.search.trim()}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: s } },
        { contactPerson: { [Op.iLike]: s } },
        { phone: { [Op.iLike]: s } },
      ];
    }

    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.max(1, Math.min(100, Number(query.limit || 10)));
    const offset = (page - 1) * limit;

    const { rows, count } = await this.companyModel.findAndCountAll({
      where,
      include: [
        {
          model: this.projectModel,
          as: 'project',
          attributes: ['id', 'uuid', 'name', 'code'],
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return {
      items: rows.map(toSnakeCaseCompany),
      meta: {
        total: count,
        page,
        limit,
        total_pages: Math.ceil(count / limit) || 1,
      },
    };
  }

  async getExpiringCompanies(user: any, projectId?: string) {
    const orgWhere = this.buildOrgWhere(user);
    const where: any = { ...orgWhere };

    if (projectId && projectId !== 'all') {
      where.projectId = projectId;
    }

    // Next 30 days from today
    const now = new Date();
    const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    where.contractEnd = {
      [Op.lte]: next30Days,
    };
    where.status = {
      [Op.ne]: 'TERMINATED',
    };

    const companies = await this.companyModel.findAll({
      where,
      include: [
        {
          model: this.projectModel,
          as: 'project',
          attributes: ['id', 'uuid', 'name', 'code'],
          required: false,
        },
      ],
      order: [['contractEnd', 'ASC']],
    });

    return {
      items: companies.map(toSnakeCaseCompany),
      count: companies.length,
    };
  }

  async getCompanyByUuid(user: any, uuid: string) {
    const orgWhere = this.buildOrgWhere(user);
    const company = await this.companyModel.findOne({
      where: { uuid, ...orgWhere },
      include: [
        {
          model: this.projectModel,
          as: 'project',
          attributes: ['id', 'uuid', 'name', 'code'],
          required: false,
        },
        {
          model: this.guardModel,
          as: 'guards',
          attributes: ['id', 'uuid', 'name', 'phone', 'status'],
          required: false,
        },
      ],
    });

    if (!company) {
      throw new NotFoundException(`Security company ${uuid} not found in your organization`);
    }

    return toSnakeCaseCompany(company);
  }

  async updateCompany(user: any, uuid: string, dto: UpdateSecurityCompanyDto) {
    const orgWhere = this.buildOrgWhere(user);
    const company = await this.companyModel.findOne({
      where: { uuid, ...orgWhere },
    });

    if (!company) {
      throw new NotFoundException(`Security company ${uuid} not found in your organization`);
    }

    const ctx = extractUserContext(user);

    if (dto.project_id) {
      const proj = await this.projectModel.findOne({
        where: {
          uuid: dto.project_id,
        } as any,
      });
      if (!proj) {
        throw new NotFoundException(`Project ${dto.project_id} not found`);
      }
    }

    await company.update({
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.contact_person !== undefined && { contactPerson: dto.contact_person }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.contract_start !== undefined && { contractStart: dto.contract_start }),
      ...(dto.contract_end !== undefined && { contractEnd: dto.contract_end }),
      ...(dto.monthly_cost !== undefined && { monthlyCost: dto.monthly_cost }),
      ...(dto.liability_note !== undefined && { liabilityNote: dto.liability_note }),
      ...(dto.status !== undefined && { status: dto.status }),
      ...(dto.project_id !== undefined && { projectId: dto.project_id }),
      updatedBy: ctx.userId ?? null,
    } as any);

    return toSnakeCaseCompany(company);
  }

  async deleteCompany(user: any, uuid: string) {
    const orgWhere = this.buildOrgWhere(user);
    const company = await this.companyModel.findOne({
      where: { uuid, ...orgWhere },
    });

    if (!company) {
      throw new NotFoundException(`Security company ${uuid} not found in your organization`);
    }

    const ctx = extractUserContext(user);
    await company.update({ deletedBy: ctx.userId ?? null });
    await company.destroy();
    return { success: true, message: 'Security company deleted successfully' };
  }

  // =========================================================================
  // 2. SECURITY GUARDS
  // =========================================================================

  async createGuard(user: any, dto: CreateSecurityGuardDto) {
    const ctx = extractUserContext(user);
    const orgId = ctx.orgId;

    // Rule: If source is COMPANY, company_id is mandatory!
    if (dto.source === 'COMPANY') {
      if (!dto.company_id) {
        throw new BadRequestException('company_id is required when guard source is COMPANY');
      }

      const company = await this.companyModel.findOne({
        where: {
          id: dto.company_id,
          ...(orgId && !ctx.isSuperAdmin ? { organizationId: orgId } : {}),
        },
      });

      if (!company) {
        throw new NotFoundException(`Security company with ID ${dto.company_id} not found in your organization`);
      }
    }

    if (dto.project_id) {
      const proj = await this.projectModel.findOne({
        where: {
          uuid: dto.project_id,
        } as any,
      });
      if (!proj) {
        throw new NotFoundException(`Project ${dto.project_id} not found`);
      }
    }

    const guard = await this.guardModel.create({
      organizationId: orgId,
      projectId: dto.project_id ?? null,
      name: dto.name,
      phone: dto.phone,
      nationalId: dto.national_id,
      source: dto.source,
      companyId: dto.source === 'COMPANY' ? dto.company_id : null,
      badgeNumber: dto.badge_number ?? null,
      status: dto.status ?? 'ACTIVE',
      joinedDate: dto.joined_date,
      emergencyContact: dto.emergency_contact ?? null,
      createdBy: ctx.userId ?? null,
    } as any);

    return toSnakeCaseGuard(guard);
  }

  async getGuards(user: any, query: QuerySecurityGuardDto) {
    const orgWhere = this.buildOrgWhere(user);
    const where: any = { ...orgWhere };

    if (query.project_id && query.project_id !== 'all') {
      where.projectId = query.project_id;
    }

    if (query.source && query.source !== 'all') {
      where.source = query.source;
    }

    if (query.company_id) {
      where.companyId = query.company_id;
    }

    if (query.status && query.status !== 'all') {
      where.status = query.status;
    }

    if (query.search?.trim()) {
      const s = `%${query.search.trim()}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: s } },
        { phone: { [Op.iLike]: s } },
        { nationalId: { [Op.iLike]: s } },
        { badgeNumber: { [Op.iLike]: s } },
      ];
    }

    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.max(1, Math.min(100, Number(query.limit || 10)));
    const offset = (page - 1) * limit;

    const { rows, count } = await this.guardModel.findAndCountAll({
      where,
      include: [
        {
          model: this.projectModel,
          as: 'project',
          attributes: ['id', 'uuid', 'name', 'code'],
          required: false,
        },
        {
          model: this.companyModel,
          as: 'company',
          attributes: ['id', 'uuid', 'name', 'contactPerson', 'phone', 'status'],
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return {
      items: rows.map(toSnakeCaseGuard),
      meta: {
        total: count,
        page,
        limit,
        total_pages: Math.ceil(count / limit) || 1,
      },
    };
  }

  async getGuardByUuid(user: any, uuid: string) {
    const orgWhere = this.buildOrgWhere(user);
    const guard = await this.guardModel.findOne({
      where: { uuid, ...orgWhere },
      include: [
        {
          model: this.projectModel,
          as: 'project',
          attributes: ['id', 'uuid', 'name', 'code'],
          required: false,
        },
        {
          model: this.companyModel,
          as: 'company',
          attributes: ['id', 'uuid', 'name', 'contactPerson', 'phone', 'status'],
          required: false,
        },
      ],
    });

    if (!guard) {
      throw new NotFoundException(`Security guard ${uuid} not found in your organization`);
    }

    return toSnakeCaseGuard(guard);
  }

  async updateGuard(user: any, uuid: string, dto: UpdateSecurityGuardDto) {
    const orgWhere = this.buildOrgWhere(user);
    const guard = await this.guardModel.findOne({
      where: { uuid, ...orgWhere },
    });

    if (!guard) {
      throw new NotFoundException(`Security guard ${uuid} not found in your organization`);
    }

    const ctx = extractUserContext(user);
    const newSource = dto.source ?? guard.source;

    if (newSource === 'COMPANY') {
      const companyId = dto.company_id ?? guard.companyId;
      if (!companyId) {
        throw new BadRequestException('company_id is required when guard source is COMPANY');
      }
      const company = await this.companyModel.findOne({
        where: {
          id: companyId,
          ...(ctx.orgId && !ctx.isSuperAdmin ? { organizationId: ctx.orgId } : {}),
        },
      });
      if (!company) {
        throw new NotFoundException(`Security company with ID ${companyId} not found in your organization`);
      }
    }

    if (dto.project_id) {
      const proj = await this.projectModel.findOne({
        where: {
          uuid: dto.project_id,
        } as any,
      });
      if (!proj) {
        throw new NotFoundException(`Project ${dto.project_id} not found`);
      }
    }

    await guard.update({
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.national_id !== undefined && { nationalId: dto.national_id }),
      ...(dto.source !== undefined && { source: dto.source }),
      ...(dto.company_id !== undefined && { companyId: newSource === 'COMPANY' ? dto.company_id : null }),
      ...(dto.badge_number !== undefined && { badgeNumber: dto.badge_number }),
      ...(dto.status !== undefined && { status: dto.status }),
      ...(dto.joined_date !== undefined && { joinedDate: dto.joined_date }),
      ...(dto.emergency_contact !== undefined && { emergencyContact: dto.emergency_contact }),
      ...(dto.project_id !== undefined && { projectId: dto.project_id }),
      updatedBy: ctx.userId ?? null,
    } as any);

    return toSnakeCaseGuard(guard);
  }

  async deleteGuard(user: any, uuid: string) {
    const orgWhere = this.buildOrgWhere(user);
    const guard = await this.guardModel.findOne({
      where: { uuid, ...orgWhere },
    });

    if (!guard) {
      throw new NotFoundException(`Security guard ${uuid} not found in your organization`);
    }

    const ctx = extractUserContext(user);
    await guard.update({ deletedBy: ctx.userId ?? null });
    await guard.destroy();
    return { success: true, message: 'Security guard removed successfully' };
  }

  // =========================================================================
  // 3. DUTY ROSTER & SHIFTS
  // =========================================================================

  async createRoster(user: any, dto: CreateSecurityRosterDto) {
    const ctx = extractUserContext(user);
    const orgId = ctx.orgId;

    // 1. Verify project exists
    const proj = await this.projectModel.findOne({
      where: {
        uuid: dto.project_id,
      } as any,
    });
    if (!proj) {
      throw new NotFoundException(`Project ${dto.project_id} not found`);
    }

    // 2. Verify guard exists in org
    const guard = await this.guardModel.findOne({
      where: {
        id: dto.guard_id,
        ...(orgId && !ctx.isSuperAdmin ? { organizationId: orgId } : {}),
      },
    });
    if (!guard) {
      throw new NotFoundException(`Security guard with ID ${dto.guard_id} not found in your organization`);
    }

    // 3. Reject Overlapping Shifts for the same guard on the same date!
    const existingRosters = await this.rosterModel.findAll({
      where: {
        guardId: dto.guard_id,
        dutyDate: dto.duty_date,
        status: { [Op.ne]: 'ABSENT' },
      },
    });

    for (const existing of existingRosters) {
      if (checkShiftOverlap(dto.shift_start, dto.shift_end, existing.shiftStart, existing.shiftEnd)) {
        throw new BadRequestException(
          `Shift overlaps with existing roster (#${existing.id}: ${existing.shiftName} ${existing.shiftStart}-${existing.shiftEnd} at ${existing.postLocation}) for this guard on ${dto.duty_date}`,
        );
      }
    }

    const roster = await this.rosterModel.create({
      organizationId: orgId,
      projectId: dto.project_id,
      guardId: dto.guard_id,
      dutyDate: dto.duty_date,
      shiftName: dto.shift_name,
      shiftStart: dto.shift_start,
      shiftEnd: dto.shift_end,
      postLocation: dto.post_location,
      status: dto.status ?? 'SCHEDULED',
      notes: dto.notes ?? null,
      createdBy: ctx.userId ?? null,
    } as any);

    return toSnakeCaseRoster(roster);
  }

  async getRosters(user: any, query: QuerySecurityRosterDto) {
    const orgWhere = this.buildOrgWhere(user);
    const where: any = { ...orgWhere };

    if (query.project_id && query.project_id !== 'all') {
      where.projectId = query.project_id;
    }

    if (query.guard_id) {
      where.guardId = query.guard_id;
    }

    if (query.duty_date) {
      where.dutyDate = query.duty_date;
    } else if (query.start_date && query.end_date) {
      where.dutyDate = {
        [Op.between]: [query.start_date, query.end_date],
      };
    } else if (query.start_date) {
      where.dutyDate = { [Op.gte]: query.start_date };
    } else if (query.end_date) {
      where.dutyDate = { [Op.lte]: query.end_date };
    }

    if (query.status && query.status !== 'all') {
      where.status = query.status;
    }

    if (query.shift_name && query.shift_name !== 'all') {
      where.shiftName = query.shift_name;
    }

    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.max(1, Math.min(200, Number(query.limit || 50)));
    const offset = (page - 1) * limit;

    const { rows, count } = await this.rosterModel.findAndCountAll({
      where,
      include: [
        {
          model: this.projectModel,
          as: 'project',
          attributes: ['id', 'uuid', 'name', 'code'],
          required: false,
        },
        {
          model: this.guardModel,
          as: 'guard',
          attributes: ['id', 'uuid', 'name', 'phone', 'source', 'badgeNumber'],
          required: false,
          include: [
            {
              model: this.companyModel,
              as: 'company',
              attributes: ['id', 'name'],
              required: false,
            },
          ],
        },
      ],
      order: [
        ['dutyDate', 'DESC'],
        ['shiftStart', 'ASC'],
      ],
      limit,
      offset,
    });

    return {
      items: rows.map(toSnakeCaseRoster),
      meta: {
        total: count,
        page,
        limit,
        total_pages: Math.ceil(count / limit) || 1,
      },
    };
  }

  async getWeeklyRoster(user: any, projectId: string, startDate?: string) {
    const orgWhere = this.buildOrgWhere(user);

    // Default to start of current week (Monday) or given date
    const start = startDate ? new Date(startDate) : new Date();
    const dayOfWeek = start.getDay(); // 0 is Sunday
    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(start);
    monday.setDate(start.getDate() + distanceToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const startIso = monday.toISOString().slice(0, 10);
    const endIso = sunday.toISOString().slice(0, 10);

    const where: any = {
      ...orgWhere,
      dutyDate: {
        [Op.between]: [startIso, endIso],
      },
    };

    if (projectId && projectId !== 'all') {
      where.projectId = projectId;
    }

    const rosters = await this.rosterModel.findAll({
      where,
      include: [
        {
          model: this.guardModel,
          as: 'guard',
          attributes: ['id', 'uuid', 'name', 'phone', 'source', 'badgeNumber'],
          required: false,
          include: [
            {
              model: this.companyModel,
              as: 'company',
              attributes: ['id', 'name'],
              required: false,
            },
          ],
        },
      ],
      order: [
        ['dutyDate', 'ASC'],
        ['shiftStart', 'ASC'],
      ],
    });

    // Generate list of 7 days
    const weekDays: Array<{ date: string; dayName: string }> = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDays.push({
        date: d.toISOString().slice(0, 10),
        dayName: dayNames[i],
      });
    }

    return {
      start_date: startIso,
      end_date: endIso,
      week_days: weekDays,
      items: rosters.map(toSnakeCaseRoster),
    };
  }

  async updateRosterStatus(user: any, uuid: string, dto: UpdateRosterStatusDto) {
    const orgWhere = this.buildOrgWhere(user);
    const roster = await this.rosterModel.findOne({
      where: { uuid, ...orgWhere },
    });

    if (!roster) {
      throw new NotFoundException(`Roster shift ${uuid} not found in your organization`);
    }

    const ctx = extractUserContext(user);
    await roster.update({
      status: dto.status,
      ...(dto.notes && { notes: dto.notes }),
      updatedBy: ctx.userId ?? null,
    });

    return toSnakeCaseRoster(roster);
  }

  async updateRoster(user: any, uuid: string, dto: UpdateSecurityRosterDto) {
    const orgWhere = this.buildOrgWhere(user);
    const roster = await this.rosterModel.findOne({
      where: { uuid, ...orgWhere },
    });

    if (!roster) {
      throw new NotFoundException(`Roster shift ${uuid} not found in your organization`);
    }

    const ctx = extractUserContext(user);
    const targetGuardId = dto.guard_id ?? roster.guardId;
    const targetDate = dto.duty_date ?? roster.dutyDate;
    const targetStart = dto.shift_start ?? roster.shiftStart;
    const targetEnd = dto.shift_end ?? roster.shiftEnd;

    // Check overlap if timing or date or guard changed
    if (dto.shift_start || dto.shift_end || dto.duty_date || dto.guard_id) {
      const existingRosters = await this.rosterModel.findAll({
        where: {
          guardId: targetGuardId,
          dutyDate: targetDate,
          id: { [Op.ne]: roster.id },
          status: { [Op.ne]: 'ABSENT' },
        },
      });

      for (const existing of existingRosters) {
        if (checkShiftOverlap(targetStart, targetEnd, existing.shiftStart, existing.shiftEnd)) {
          throw new BadRequestException(
            `Shift overlaps with existing roster (#${existing.id}: ${existing.shiftName} ${existing.shiftStart}-${existing.shiftEnd} at ${existing.postLocation}) for this guard on ${targetDate}`,
          );
        }
      }
    }

    await roster.update({
      ...(dto.project_id && { projectId: dto.project_id }),
      ...(dto.guard_id && { guardId: dto.guard_id }),
      ...(dto.duty_date && { dutyDate: dto.duty_date }),
      ...(dto.shift_name && { shiftName: dto.shift_name }),
      ...(dto.shift_start && { shiftStart: dto.shift_start }),
      ...(dto.shift_end && { shiftEnd: dto.shift_end }),
      ...(dto.post_location && { postLocation: dto.post_location }),
      ...(dto.status && { status: dto.status }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
      updatedBy: ctx.userId ?? null,
    });

    return toSnakeCaseRoster(roster);
  }

  async deleteRoster(user: any, uuid: string) {
    const orgWhere = this.buildOrgWhere(user);
    const roster = await this.rosterModel.findOne({
      where: { uuid, ...orgWhere },
    });

    if (!roster) {
      throw new NotFoundException(`Roster shift ${uuid} not found in your organization`);
    }

    const ctx = extractUserContext(user);
    await roster.update({ deletedBy: ctx.userId ?? null });
    await roster.destroy();
    return { success: true, message: 'Shift deleted successfully' };
  }

  // =========================================================================
  // 4. VISITOR LOG
  // =========================================================================

  async checkInVisitor(user: any, dto: CheckInVisitorDto) {
    const ctx = extractUserContext(user);
    const orgId = ctx.orgId;

    const proj = await this.projectModel.findOne({
      where: {
        uuid: dto.project_id,
      } as any,
    });
    if (!proj) {
      throw new NotFoundException(`Project ${dto.project_id} not found`);
    }

    if (dto.guard_on_duty_id) {
      const guard = await this.guardModel.findOne({
        where: {
          id: dto.guard_on_duty_id,
          ...(orgId && !ctx.isSuperAdmin ? { organizationId: orgId } : {}),
        },
      });
      if (!guard) {
        throw new NotFoundException(`Guard with ID ${dto.guard_on_duty_id} not found in your organization`);
      }
    }

    const visitorLog = await this.visitorLogModel.create({
      organizationId: orgId,
      projectId: dto.project_id,
      visitorName: dto.visitor_name,
      phone: dto.phone,
      flatVisited: dto.flat_visited,
      purpose: dto.purpose,
      inTime: dto.in_time ? new Date(dto.in_time) : new Date(),
      guardOnDutyId: dto.guard_on_duty_id ?? null,
      vehicleNumber: dto.vehicle_number ?? null,
      nationalIdOrBadge: dto.national_id_or_badge ?? null,
      status: 'CHECKED_IN',
      remarks: dto.remarks ?? null,
      createdBy: ctx.userId ?? null,
    } as any);

    return toSnakeCaseVisitorLog(visitorLog);
  }

  async checkOutVisitor(user: any, uuid: string, dto: CheckOutVisitorDto) {
    const orgWhere = this.buildOrgWhere(user);
    const log = await this.visitorLogModel.findOne({
      where: { uuid, ...orgWhere },
    });

    if (!log) {
      throw new NotFoundException(`Visitor log entry ${uuid} not found in your organization`);
    }

    const ctx = extractUserContext(user);
    await log.update({
      outTime: dto.out_time ? new Date(dto.out_time) : new Date(),
      status: 'CHECKED_OUT',
      ...(dto.remarks && { remarks: dto.remarks }),
      updatedBy: ctx.userId ?? null,
    });

    return toSnakeCaseVisitorLog(log);
  }

  async getVisitorLogs(user: any, query: QueryVisitorLogDto) {
    const orgWhere = this.buildOrgWhere(user);
    const where: any = { ...orgWhere };

    if (query.project_id && query.project_id !== 'all') {
      where.projectId = query.project_id;
    }

    if (query.status && query.status !== 'all') {
      where.status = query.status;
    }

    if (query.date) {
      const startOfDay = new Date(`${query.date}T00:00:00.000Z`);
      const endOfDay = new Date(`${query.date}T23:59:59.999Z`);
      where.inTime = {
        [Op.between]: [startOfDay, endOfDay],
      };
    }

    if (query.search?.trim()) {
      const s = `%${query.search.trim()}%`;
      where[Op.or] = [
        { visitorName: { [Op.iLike]: s } },
        { phone: { [Op.iLike]: s } },
        { flatVisited: { [Op.iLike]: s } },
        { vehicleNumber: { [Op.iLike]: s } },
      ];
    }

    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.max(1, Math.min(100, Number(query.limit || 20)));
    const offset = (page - 1) * limit;

    const { rows, count } = await this.visitorLogModel.findAndCountAll({
      where,
      include: [
        {
          model: this.projectModel,
          as: 'project',
          attributes: ['id', 'uuid', 'name', 'code'],
          required: false,
        },
        {
          model: this.guardModel,
          as: 'guardOnDuty',
          attributes: ['id', 'uuid', 'name', 'badgeNumber'],
          required: false,
        },
      ],
      order: [['inTime', 'DESC']],
      limit,
      offset,
    });

    return {
      items: rows.map(toSnakeCaseVisitorLog),
      meta: {
        total: count,
        page,
        limit,
        total_pages: Math.ceil(count / limit) || 1,
      },
    };
  }

  async getVisitorLogByUuid(user: any, uuid: string) {
    const orgWhere = this.buildOrgWhere(user);
    const log = await this.visitorLogModel.findOne({
      where: { uuid, ...orgWhere },
      include: [
        {
          model: this.projectModel,
          as: 'project',
          attributes: ['id', 'uuid', 'name', 'code'],
          required: false,
        },
        {
          model: this.guardModel,
          as: 'guardOnDuty',
          attributes: ['id', 'uuid', 'name', 'badgeNumber'],
          required: false,
        },
      ],
    });

    if (!log) {
      throw new NotFoundException(`Visitor log entry ${uuid} not found in your organization`);
    }

    return toSnakeCaseVisitorLog(log);
  }

  async deleteVisitorLog(user: any, uuid: string) {
    const orgWhere = this.buildOrgWhere(user);
    const log = await this.visitorLogModel.findOne({
      where: { uuid, ...orgWhere },
    });

    if (!log) {
      throw new NotFoundException(`Visitor log entry ${uuid} not found in your organization`);
    }

    const ctx = extractUserContext(user);
    await log.update({ deletedBy: ctx.userId ?? null });
    await log.destroy();
    return { success: true, message: 'Visitor log deleted successfully' };
  }

  // =========================================================================
  // 5. MONTHLY SECURITY COST & STATS (Feeds Service Charge Expenses in Prompt 9)
  // =========================================================================

  async getMonthlySecurityCost(user: any, projectId?: string) {
    const orgWhere = this.buildOrgWhere(user);
    const companyWhere: any = {
      ...orgWhere,
      status: { [Op.in]: ['ACTIVE', 'EXPIRING_SOON'] },
    };

    if (projectId && projectId !== 'all') {
      // Company can be project-scoped or org-wide (projectId null)
      companyWhere[Op.or] = [
        { projectId: projectId },
        { projectId: { [Op.is]: null } },
      ];
    }

    const companies = await this.companyModel.findAll({
      where: companyWhere,
      attributes: ['id', 'name', 'monthlyCost', 'contractEnd', 'status'],
    });

    const totalCompanyCost = companies.reduce(
      (sum, c) => sum + Number(c.monthlyCost || 0),
      0,
    );

    const guardWhere: any = {
      ...orgWhere,
      status: 'ACTIVE',
    };
    if (projectId && projectId !== 'all') {
      guardWhere.projectId = projectId;
    }

    const [inHouseCount, companyGuardCount] = await Promise.all([
      this.guardModel.count({ where: { ...guardWhere, source: 'IN_HOUSE' } }),
      this.guardModel.count({ where: { ...guardWhere, source: 'COMPANY' } }),
    ]);

    return {
      project_id: projectId ?? null,
      month: new Date().toLocaleString('en-US', { month: 'long' }),
      year: new Date().getFullYear(),
      company_contracts_total: totalCompanyCost,
      active_companies_count: companies.length,
      in_house_guards_count: inHouseCount,
      company_guards_count: companyGuardCount,
      total_active_guards: inHouseCount + companyGuardCount,
      grand_monthly_cost: totalCompanyCost,
      formatted_monthly_cost: `৳ ${totalCompanyCost.toLocaleString('en-IN')}`,
      contracts: companies.map((c) => ({
        id: c.id,
        name: c.name,
        monthly_cost: Number(c.monthlyCost),
        monthly_cost_formatted: `৳ ${Number(c.monthlyCost).toLocaleString('en-IN')}`,
      })),
    };
  }

  async getSecurityStats(user: any, projectId?: string) {
    const orgWhere = this.buildOrgWhere(user);
    const pWhere: any = { ...orgWhere };
    if (projectId && projectId !== 'all') {
      pWhere.projectId = projectId;
    }

    const today = new Date().toISOString().slice(0, 10);
    const next30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const [
      totalGuards,
      inHouseCount,
      companyGuardsCount,
      activeCompaniesCount,
      expiringCompaniesCount,
      onDutyTodayCount,
      activeVisitorsCount,
      costInfo,
    ] = await Promise.all([
      this.guardModel.count({ where: pWhere }),
      this.guardModel.count({ where: { ...pWhere, source: 'IN_HOUSE' } }),
      this.guardModel.count({ where: { ...pWhere, source: 'COMPANY' } }),
      this.companyModel.count({
        where: {
          ...orgWhere,
          status: 'ACTIVE',
          ...(projectId && projectId !== 'all' ? { [Op.or]: [{ projectId }, { projectId: null }] } : {}),
        },
      }),
      this.companyModel.count({
        where: {
          ...orgWhere,
          contractEnd: { [Op.lte]: next30Days },
          status: { [Op.ne]: 'TERMINATED' },
          ...(projectId && projectId !== 'all' ? { [Op.or]: [{ projectId }, { projectId: null }] } : {}),
        },
      }),
      this.rosterModel.count({
        where: {
          ...pWhere,
          dutyDate: today,
          status: { [Op.in]: ['ON_DUTY', 'SCHEDULED'] },
        },
      }),
      this.visitorLogModel.count({
        where: {
          ...pWhere,
          status: 'CHECKED_IN',
        },
      }),
      this.getMonthlySecurityCost(user, projectId),
    ]);

    return {
      total_guards: totalGuards,
      in_house_guards: inHouseCount,
      company_guards: companyGuardsCount,
      active_companies: activeCompaniesCount,
      expiring_contracts_count: expiringCompaniesCount,
      on_duty_today: onDutyTodayCount,
      active_visitors_inside: activeVisitorsCount,
      monthly_cost: costInfo.grand_monthly_cost,
      monthly_cost_formatted: costInfo.formatted_monthly_cost,
    };
  }

  // =========================================================================
  // 6. DROPDOWN METADATA
  // =========================================================================

  async getDropdownMeta(user: any, projectId?: string) {
    const orgWhere = this.buildOrgWhere(user);
    const companyWhere: any = { ...orgWhere, status: 'ACTIVE' };
    if (projectId && projectId !== 'all') {
      companyWhere[Op.or] = [{ projectId }, { projectId: null }];
    }

    const guardWhere: any = { ...orgWhere, status: 'ACTIVE' };
    if (projectId && projectId !== 'all') {
      guardWhere.projectId = projectId;
    }

    const [companies, guards] = await Promise.all([
      this.companyModel.findAll({
        where: companyWhere,
        attributes: ['id', 'uuid', 'name', 'contactPerson', 'phone'],
        order: [['name', 'ASC']],
      }),
      this.guardModel.findAll({
        where: guardWhere,
        attributes: ['id', 'uuid', 'name', 'phone', 'source', 'badgeNumber'],
        order: [['name', 'ASC']],
      }),
    ]);

    return {
      companies: companies.map((c) => ({
        id: c.id,
        uuid: c.uuid,
        name: c.name,
        contact_person: c.contactPerson,
        phone: c.phone,
      })),
      guards: guards.map((g) => ({
        id: g.id,
        uuid: g.uuid,
        name: g.name,
        phone: g.phone,
        source: g.source,
        badge_number: g.badgeNumber ?? null,
      })),
      sources: ['IN_HOUSE', 'COMPANY'] as GuardSource[],
      guard_statuses: ['ACTIVE', 'ON_LEAVE', 'INACTIVE', 'TERMINATED'] as GuardStatus[],
      shift_names: ['Morning', 'Evening', 'Night', 'Custom'] as ShiftName[],
      roster_statuses: ['SCHEDULED', 'ON_DUTY', 'COMPLETED', 'ABSENT', 'RELIEVED'] as RosterStatus[],
      purposes: [
        'Delivery',
        'Guest / Personal',
        'Contractor / Maintenance',
        'Official / Courier',
        'Other',
      ] as VisitorPurpose[],
    };
  }
}
