import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CrmEmployeeKpi } from 'src/database/models/crm/kpi/crm-employee-kpi.model';
import { LeadTeam } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { CreateEmployeeKpiDto, EmployeeKpiType } from './dto/create-employee-kpi.dto';
import { QueryEmployeeKpiDto } from './dto/query-employee-kpi.dto';
import { UpdateEmployeeKpiDto } from './dto/update-employee-kpi.dto';

@Injectable()
export class EmployeeKpiService {
  private readonly workTypes = ['Call Task', 'Visit Task', 'Sales Task'];

  constructor(
    @InjectModel(CrmEmployeeKpi) private readonly kpis: typeof CrmEmployeeKpi,
    @InjectModel(LeadTeam) private readonly teams: typeof LeadTeam,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
  ) {}

  async create(dto: CreateEmployeeKpiDto, userId?: number, currentUser?: any) {
    const relations = await this.validateRelations(dto, currentUser?.orgId);
    const orgId = dto.orgId ?? currentUser?.orgId ?? null;
    const createdBy = userId ? String(userId) : (dto.createdBy ?? null);
    const persistenceData = {
      ...this.toPersistence(dto, relations),
      orgId,
      createdBy,
    };
    const kpi = await this.kpis.create(persistenceData as any);
    return this.findOne(kpi.uuid, currentUser);
  }

  async findAll(query: QueryEmployeeKpiDto, currentUser?: any) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;
    if (query.search?.trim()) {
      const search = query.search.trim();
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { type: { [Op.iLike]: `%${search}%` } },
        { status: { [Op.iLike]: `%${search}%` } },
        { workType1: { [Op.iLike]: `%${search}%` } },
        { workType2: { [Op.iLike]: `%${search}%` } },
        { workType3: { [Op.iLike]: `%${search}%` } },
      ];
    }
    const { rows, count } = await this.kpis.findAndCountAll({
      where,
      paranoid: !query.withDeleted,
      include: this.includes(),
      order: [['createdAt', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });
    return {
      data: rows.map(row => this.toPublic(row)),
      meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 },
    };
  }

  async findOne(uuid: string, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    const kpi = await this.kpis.findOne({ where, include: this.includes() });
    if (!kpi) throw new NotFoundException(`Employee KPI ${uuid} not found`);
    return this.toPublic(kpi);
  }

  async update(uuid: string, dto: UpdateEmployeeKpiDto, userId?: number, currentUser?: any) {
    const kpi = await this.getActive(uuid, currentUser);
    const next = { ...this.toPublic(kpi), ...dto } as CreateEmployeeKpiDto;
    const relations = await this.validateRelations(next, currentUser?.orgId);
    const changes: Record<string, any> = this.toPersistence(next, relations, dto);
    if (userId) changes.updatedBy = String(userId);
    if (dto.orgId !== undefined) changes.orgId = dto.orgId;
    await kpi.update(changes as any);
    return this.findOne(uuid, currentUser);
  }

  async remove(uuid: string, userId?: number, currentUser?: any) {
    const kpi = await this.getActive(uuid, currentUser);
    if (userId) await kpi.update({ deletedBy: String(userId) });
    await kpi.destroy({ force: false });
    return { message: `Employee KPI ${uuid} deleted successfully` };
  }

  async restore(uuid: string, userId?: number, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    const kpi = await this.kpis.findOne({ where, paranoid: false });
    if (!kpi) throw new NotFoundException(`Employee KPI ${uuid} not found`);
    if (!kpi.deletedAt) throw new BadRequestException(`Employee KPI ${uuid} is not deleted`);
    if (userId) await kpi.update({ updatedBy: String(userId) });
    await kpi.restore();
    return this.findOne(uuid, currentUser);
  }

  async dropdowns(currentUser?: any) {
    const teamWhere: any = { isActive: true };
    const userWhere: any = { isActive: true };
    if (currentUser?.orgId) {
      teamWhere.orgId = currentUser.orgId;
      userWhere.orgId = currentUser.orgId;
    }
    const [users, teams] = await Promise.all([
      this.users.findAll({ where: userWhere, attributes: ['uuid', 'userCode', 'name'], order: [['name', 'ASC']] }),
      this.teams.findAll({ where: teamWhere, attributes: ['id', 'uuid', 'name'], order: [['name', 'ASC']] }),
    ]);
    return { types: Object.values(EmployeeKpiType), statuses: ['ACTIVE', 'INACTIVE'], workTypes: this.workTypes, users, teams };
  }

  private includes() {
    return [
      { association: 'user', required: false, attributes: ['uuid', 'userCode', 'name'] },
      { association: 'team', required: false, attributes: ['id', 'uuid', 'name'] },
    ];
  }

  private async validateRelations(dto: CreateEmployeeKpiDto, orgId?: number) {
    this.validateDates(dto.fromDate, dto.toDate);
    if (dto.type === EmployeeKpiType.TEAM) {
      if (!dto.teamId) throw new BadRequestException('teamId is required for TEAM KPI');
      const team = await this.teams.findOne({ where: { id: dto.teamId, isActive: true, ...(orgId ? { orgId } : {}) } });
      if (!team) throw new BadRequestException('Selected team is missing or inactive');
      return { team, user: undefined };
    }
    if (dto.teamId) throw new BadRequestException('teamId is not allowed for INDIVIDUAL KPI');
    if (dto.userId) {
      const user = await this.users.findOne({ where: { uuid: dto.userId, isActive: true, ...(orgId ? { orgId } : {}) } });
      if (!user) throw new BadRequestException('Selected employee is missing or inactive');
      return { team: undefined, user };
    }
    return { team: undefined, user: undefined };
  }

  private toPersistence(dto: CreateEmployeeKpiDto, relations: { team?: LeadTeam; user?: SysUser }, update?: UpdateEmployeeKpiDto) {
    const name = dto.type === EmployeeKpiType.TEAM ? relations.team?.name ?? dto.name : relations.user?.name ?? dto.name ?? 'N/A';
    return {
      type: dto.type,
      name: name?.trim() || 'N/A',
      userId: dto.type === EmployeeKpiType.INDIVIDUAL ? dto.userId ?? null : null,
      teamId: dto.type === EmployeeKpiType.TEAM ? dto.teamId ?? null : null,
      workType1: dto.workType1, target1: dto.target1,
      workType2: dto.workType2, target2: dto.target2,
      workType3: dto.workType3, target3: dto.target3,
      fromDate: dto.fromDate, toDate: dto.toDate,
      status: dto.status ?? 'ACTIVE',
      ...(update?.createdBy !== undefined ? { updatedBy: update.createdBy } : {}),
      ...(!update && dto.createdBy ? { createdBy: dto.createdBy } : {}),
    };
  }

  private toPublic(kpi: CrmEmployeeKpi) {
    const data = kpi.toJSON() as any;
    const toDate = new Date(`${data.toDate}T23:59:59`);
    const leftDays = Math.max(0, Math.ceil((toDate.getTime() - Date.now()) / 86400000));
    const orgId = data.org_id ?? data.orgId ?? null;
    const createdBy = data.created_by ?? data.createdBy ?? null;
    const updatedBy = data.updated_by ?? data.updatedBy ?? null;
    const deletedBy = data.deleted_by ?? data.deletedBy ?? null;
    const createdAt = data.created_at ?? data.createdAt;
    const updatedAt = data.updated_at ?? data.updatedAt;
    const deletedAt = data.deleted_at ?? data.deletedAt ?? null;
    delete data.createdAt;
    delete data.updatedAt;
    delete data.deletedAt;
    delete data.addedBy;
    delete data.createdBy;
    delete data.updatedBy;
    delete data.deletedBy;
    return {
      ...data,
      orgId,
      org_id: orgId,
      created_by: createdBy,
      updated_by: updatedBy,
      deleted_by: deletedBy,
      created_at: createdAt,
      updated_at: updatedAt,
      deleted_at: deletedAt,
      target1: Number(data.target1), target2: Number(data.target2), target3: Number(data.target3),
      leftDays,
      user: data.user ?? null,
      team: data.team ?? null,
    };
  }

  private validateDates(fromDate?: string, toDate?: string) {
    if (!fromDate || !toDate || fromDate > toDate) throw new BadRequestException('fromDate must be before or equal to toDate');
  }

  private async getActive(uuid: string, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    const kpi = await this.kpis.findOne({ where });
    if (!kpi) throw new NotFoundException(`Employee KPI ${uuid} not found`);
    return kpi;
  }
}
