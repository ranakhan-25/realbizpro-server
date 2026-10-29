import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, col, fn } from 'sequelize';
import { LeadRequirement } from 'src/database/models/crm/lead/crm-lead-requirement.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { CrmLeadPipeline } from 'src/database/models/crm/lead/crm-lead-pipeline.model';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { QueryPipelineDto } from './dto/query-pipeline.dto';
import { UpdatePipelineDto } from './dto/update-pipeline.dto';

type CountRow = { projectId: string; count: number | string };
type ValueRow = { projectId: string; value: number | string };
type ProjectMetrics = { totalLeads: number; activeDeals: number; newThisQuarter: number; estimatedPipelineValue: number };

@Injectable()
export class PipelineService {
  constructor(
    @InjectModel(Project) private readonly projects: typeof Project,
    @InjectModel(Lead) private readonly leads: typeof Lead,
    @InjectModel(LeadRequirement) private readonly requirements: typeof LeadRequirement,
    @InjectModel(CrmLeadPipeline) private readonly pipelineRecords: typeof CrmLeadPipeline,
  ) {}

  async projectDropdown() {
    const projects = await this.projects.findAll({
      attributes: ['uuid', 'code', 'name', 'status'],
      order: [['name', 'ASC']],
    });
    return projects.map(project => ({ uuid: project.uuid, code: project.code, name: project.name, status: project.status }));
  }

  async findAll(query: QueryPipelineDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    if (query.projectUuid) where.uuid = query.projectUuid;
    const search = query.search?.trim();
    if (search) where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { code: { [Op.iLike]: `%${search}%` } },
    ];

    const { rows, count } = await this.projects.findAndCountAll({
      attributes: ['uuid', 'code', 'name', 'status'],
      where,
      order: [['name', 'ASC']],
      limit,
      offset: (page - 1) * limit,
    });
    const metrics = await this.getMetrics(rows);
    const pipelineRows = await this.pipelineRecords.findAll({ where: { projectId: { [Op.in]: rows.map(project => project.uuid) } } as any });
    const byProject = new Map(pipelineRows.map(row => [row.projectId, row]));
    const data = rows.map(project => this.toPublic(project, metrics.get(project.uuid), byProject.get(project.uuid)));
    return {
      data,
      meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 },
    };
  }

  async findOne(projectUuid: string) {
    const project = await this.projects.findOne({ where: { uuid: projectUuid } as any, attributes: ['uuid', 'code', 'name', 'status'] });
    if (!project) throw new NotFoundException(`Project ${projectUuid} not found`);
    const metrics = await this.getMetrics([project]);
    const pipelineRecord = await this.pipelineRecords.findOne({ where: { projectId: project.uuid } as any });
    return this.toPublic(project, metrics.get(project.uuid), pipelineRecord ?? undefined);
  }

  async create(dto: CreatePipelineDto, actorUuid?: string) {
    const project = await this.projects.findOne({ where: { uuid: dto.projectUuid } as any });
    if (!project) throw new NotFoundException(`Project ${dto.projectUuid} not found`);
    const existing = await this.pipelineRecords.findOne({ where: { projectId: project.uuid } as any });
    if (existing) throw new BadRequestException(`A pipeline record already exists for project ${project.uuid}`);
    return this.pipelineRecords.create({
      projectId: project.uuid,
      initialLeadsCount: dto.initialLeadsCount ?? 0,
      estimatedPipelineValue: dto.estimatedPipelineValue ?? 0,
      createdBy: actorUuid,
    } as any, { include: [{ association: 'project' }] });
  }

  async update(uuid: string, dto: UpdatePipelineDto, actorUuid?: string) {
    const record = await this.getRecord(uuid);
    if (dto.projectUuid) {
      const project = await this.projects.findOne({ where: { uuid: dto.projectUuid } as any });
      if (!project) throw new NotFoundException(`Project ${dto.projectUuid} not found`);
      const duplicate = await this.pipelineRecords.findOne({ where: { projectId: project.uuid, uuid: { [Op.ne]: uuid } } as any });
      if (duplicate) throw new BadRequestException(`A pipeline record already exists for project ${project.uuid}`);
      record.projectId = project.uuid;
    }
    if (dto.initialLeadsCount !== undefined) record.initialLeadsCount = dto.initialLeadsCount;
    if (dto.estimatedPipelineValue !== undefined) record.estimatedPipelineValue = dto.estimatedPipelineValue;
    record.updatedBy = actorUuid;
    await record.save();
    return this.pipelineRecords.findOne({ where: { uuid } as any, include: [{ association: 'project' }] });
  }

  async remove(uuid: string, actorUuid?: string) {
    const record = await this.getRecord(uuid);
    await record.update({ deletedBy: actorUuid });
    await record.destroy();
    return { message: `Pipeline record ${uuid} soft-deleted successfully` };
  }

  async restore(uuid: string) {
    const record = await this.pipelineRecords.findOne({ where: { uuid } as any, paranoid: false });
    if (!record) throw new NotFoundException(`Pipeline record ${uuid} not found`);
    if (!record.deletedAt) throw new BadRequestException(`Pipeline record ${uuid} is not deleted`);
    await record.restore();
    await record.update({ deletedBy: null });
    return this.pipelineRecords.findOne({ where: { uuid } as any, include: [{ association: 'project' }] });
  }

  private async getRecord(uuid: string) {
    const record = await this.pipelineRecords.findOne({ where: { uuid } as any, include: [{ association: 'project' }] });
    if (!record) throw new NotFoundException(`Pipeline record ${uuid} not found`);
    return record;
  }

  private async getMetrics(projects: Project[]) {
    const projectForRef = new Map<string, string>();
    for (const project of projects) {
      projectForRef.set(project.uuid, project.uuid);
      if (project.code) projectForRef.set(project.code, project.uuid);
    }
    const keys = [...projectForRef.keys()];
    const result = new Map<string, ProjectMetrics>();
    if (!keys.length) return result;

    const groupedCount = async (extraWhere: Record<string, unknown> = {}) => this.leads.findAll({
      attributes: ['projectId', [fn('COUNT', col('id')), 'count']],
      where: { projectId: { [Op.in]: keys }, ...extraWhere } as any,
      group: ['projectId'],
      raw: true,
    }) as unknown as Promise<CountRow[]>;
    const now = new Date();
    const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    const [allLeads, activeDeals, quarterLeads, values] = await Promise.all([
      groupedCount(),
      groupedCount({ status: 'active' }),
      groupedCount({ createdAt: { [Op.gte]: quarterStart } }),
      this.requirements.findAll({
        attributes: ['projectId', [fn('SUM', col('budget_max')), 'value']],
        where: { projectId: { [Op.in]: keys }, budgetMax: { [Op.ne]: null } } as any,
        group: ['projectId'],
        raw: true,
      }) as unknown as Promise<ValueRow[]>,
    ]);

    for (const project of projects) result.set(project.uuid, { totalLeads: 0, activeDeals: 0, newThisQuarter: 0, estimatedPipelineValue: 0 });
    for (const row of allLeads) { const uuid = projectForRef.get(row.projectId); if (uuid) result.get(uuid)!.totalLeads = Number(row.count); }
    for (const row of activeDeals) { const uuid = projectForRef.get(row.projectId); if (uuid) result.get(uuid)!.activeDeals = Number(row.count); }
    for (const row of quarterLeads) { const uuid = projectForRef.get(row.projectId); if (uuid) result.get(uuid)!.newThisQuarter = Number(row.count); }
    for (const row of values) { const uuid = projectForRef.get(row.projectId); if (uuid) result.get(uuid)!.estimatedPipelineValue = Number(row.value); }
    return result;
  }

  private toPublic(project: Project, metrics?: ProjectMetrics, pipelineRecord?: CrmLeadPipeline) {
    const estimatedPipelineValue = metrics?.estimatedPipelineValue ?? 0;
    return {
      projectUuid: project.uuid,
      projectCode: project.code,
      projectName: project.name,
      projectStatus: project.status,
      pipelineUuid: pipelineRecord?.uuid ?? null,
      initialLeadsCount: pipelineRecord?.initialLeadsCount ?? 0,
      totalLeads: metrics?.totalLeads ?? 0,
      activeDeals: metrics?.activeDeals ?? 0,
      newThisQuarter: metrics?.newThisQuarter ?? 0,
      estimatedPipelineValue,
      pipelineValueBdt: estimatedPipelineValue,
      pipelineValueLakhs: estimatedPipelineValue / 100000,
    };
  }
}
