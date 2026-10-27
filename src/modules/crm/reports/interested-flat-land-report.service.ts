import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, QueryTypes } from 'sequelize';
import { LeadStage } from 'src/database/models/crm/configuration/crm-lead-stage.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadPropertyInterest } from 'src/database/models/crm/lead/crm-lead-property-interest.model';
import { FlatLand } from 'src/database/models/projects/flatland/pr_flatland.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { QueryInterestedFlatLandReportDto } from './dto/query-interested-flat-land-report.dto';

@Injectable()
export class InterestedFlatLandReportService {
  constructor(
    @InjectModel(LeadPropertyInterest) private readonly interests: typeof LeadPropertyInterest,
    @InjectModel(Lead) private readonly leads: typeof Lead,
    @InjectModel(LeadStage) private readonly stages: typeof LeadStage,
    @InjectModel(Project) private readonly projects: typeof Project,
    @InjectModel(FlatLand) private readonly flatLands: typeof FlatLand,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
  ) {}

  async dropdowns() {
    const [projects, flatLands] = await Promise.all([
      this.projects.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.flatLands.findAll({ attributes: ['uuid', 'projectId', 'projectName', 'flatLandNo', 'propertyType'], order: [['projectName', 'ASC'], ['flatLandNo', 'ASC']] }),
    ]);
    return { projects, flatLands };
  }

  async report(query: QueryInterestedFlatLandReportDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    if (query.projectId) where.projectId = query.projectId;
    if (query.flatLandId) {
      const property = await this.flatLands.findOne({ where: { uuid: query.flatLandId } as any, attributes: ['uuid', 'projectId', 'flatLandNo'] });
      where.plotFlatNo = property?.flatLandNo ?? '__no_matching_flat_land__';
      if (property?.projectId && !query.projectId) where.projectId = property.projectId;
    }

    const conditions = ['deleted_at IS NULL'];
    const replacements: Record<string, string> = {};
    if (query.projectId) { conditions.push('project_id = :projectId'); replacements.projectId = query.projectId; }
    if (where.plotFlatNo) { conditions.push('plot_flat_no = :plotFlatNo'); replacements.plotFlatNo = where.plotFlatNo; }
    const records = await this.interests.sequelize!.query<{
      id: number; uuid: string; leadId: number; projectId?: string; projectName?: string; plotFlatNo?: string; status?: string; createdBy?: string; createdAt: Date;
    }>(`SELECT id, uuid::text AS uuid, lead_id AS "leadId", project_id AS "projectId", project_name AS "projectName", plot_flat_no AS "plotFlatNo", status, created_by AS "createdBy", created_at AS "createdAt" FROM crm_lead_property_interests WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC, id DESC`, { replacements, type: QueryTypes.SELECT });

    const leadIds = [...new Set(records.map(item => item.leadId))];
    const [leads, projects, stages, users] = await Promise.all([
      this.leads.findAll({ where: { id: { [Op.in]: leadIds } }, attributes: ['id', 'uuid', 'leadCode', 'clientName', 'leadStageId', 'createdBy'] }),
      this.projects.findAll({ attributes: ['uuid', 'code', 'name'] }),
      this.stages.findAll({ attributes: ['id', 'uuid', 'name'] }),
      this.users.findAll({ attributes: ['uuid', 'userCode', 'name'] }),
    ]);
    const leadMap = new Map(leads.map(lead => [lead.id, lead]));
    const projectMap = new Map(projects.map(project => [project.uuid, project]));
    const stageMap = new Map(stages.map(stage => [stage.id, stage]));
    const term = query.search?.trim().toLowerCase();
    const filtered = records.filter(item => {
      const lead = leadMap.get(item.leadId);
      const project = projectMap.get(item.projectId ?? '');
      return !term || [lead?.clientName, lead?.leadCode, project?.name, item.projectName, item.plotFlatNo].some(value => String(value ?? '').toLowerCase().includes(term));
    });
    const userMap = new Map<string, SysUser>();
    for (const user of users) { userMap.set(user.uuid, user); if (user.userCode) userMap.set(user.userCode, user); }
    const properties = await this.flatLands.findAll({ attributes: ['uuid', 'projectId', 'flatLandNo'] });
    const propertyMap = new Map(properties.map(property => [`${property.projectId ?? ''}:${property.flatLandNo ?? ''}`, property.uuid]));
    const rows = filtered.slice((page - 1) * limit, page * limit).map((item, index) => {
      const lead = leadMap.get(item.leadId);
      const project = projectMap.get(item.projectId ?? '');
      const stage = lead?.leadStageId ? stageMap.get(lead.leadStageId) : undefined;
      const sourcerId = lead?.createdBy ?? item.createdBy ?? null;
      const sourcer = userMap.get(sourcerId ?? '');
      return {
        sl: (page - 1) * limit + index + 1,
        lead: lead?.clientName ?? null,
        leadId: lead?.uuid ?? null,
        leadStage: stage?.name ?? null,
        leadStageId: lead?.leadStageId ?? null,
        project: project?.name ?? project?.code ?? item.projectName ?? null,
        projectId: item.projectId ?? null,
        flatLand: item.plotFlatNo ?? null,
        flatLandId: propertyMap.get(`${item.projectId ?? ''}:${item.plotFlatNo ?? ''}`) ?? null,
        sourcer: sourcer?.name ?? sourcerId,
        sourcerId,
        interestId: item.uuid,
        status: item.status ?? null,
      };
    });
    return { data: rows, meta: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) || 1, projectId: query.projectId ?? null, flatLandId: query.flatLandId ?? null } };
  }
}
