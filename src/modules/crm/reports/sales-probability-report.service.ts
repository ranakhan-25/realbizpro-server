import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, QueryTypes } from 'sequelize';
import { LeadStage } from 'src/database/models/crm/configuration/crm-lead-stage.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { QuerySalesProbabilityReportDto } from './dto/query-sales-probability-report.dto';

type ProbabilityRow = { id: number; probability: number | null };

@Injectable()
export class SalesProbabilityReportService {
  constructor(
    @InjectModel(Lead) private readonly leads: typeof Lead,
    @InjectModel(LeadStage) private readonly stages: typeof LeadStage,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
  ) {}

  async dropdowns(currentUser?: any) {
    const [users, leadStages] = await Promise.all([
      this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'userCode', 'name'], order: [['name', 'ASC']] }),
      this.stages.findAll({ where: { isActive: true }, attributes: ['id', 'uuid', 'name', 'sortOrder'], order: [['sortOrder', 'ASC'], ['name', 'ASC']] }),
    ]);
    return { users, leadStages };
  }

  async report(query: QuerySalesProbabilityReportDto, currentUser?: any) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const [leads, users, stages] = await Promise.all([
      this.leads.findAll({
        attributes: ['id', 'uuid', 'leadCode', 'clientName', 'assignedTo', 'createdBy', 'leadStageId'],
        include: [{ association: 'stage', required: false, attributes: ['id', 'uuid', 'name', 'sortOrder'] }],
        order: [['id', 'DESC']],
      }),
      this.users.findAll({ attributes: ['uuid', 'userCode', 'name'] }),
      this.stages.findAll({ attributes: ['id', 'uuid', 'name', 'sortOrder'] }),
    ]);

    const probabilities = await this.readProbabilities();
    const probabilityMap = new Map(probabilities.map(row => [row.id, row.probability]));
    const userMap = new Map<string, SysUser>();
    for (const user of users) { userMap.set(user.uuid, user); if (user.userCode) userMap.set(user.userCode, user); }
    const stageMap = new Map(stages.map(stage => [stage.id, stage]));
    const term = query.search?.trim().toLowerCase();

    const filtered = leads.filter(lead => {
      const owner = userMap.get(lead.assignedTo ?? lead.createdBy ?? '');
      const probability = probabilityMap.get(lead.leadStageId ?? 0) ?? null;
      const userMatches = !query.userId || [lead.assignedTo, lead.createdBy, owner?.uuid, owner?.userCode].includes(query.userId);
      const percentageMatches = probabilities.length === 0 || ((query.minimumPercentage == null || (probability != null && probability >= query.minimumPercentage)) && (query.maximumPercentage == null || (probability != null && probability <= query.maximumPercentage)));
      const stage = stageMap.get(lead.leadStageId ?? 0);
      const textMatches = !term || [lead.clientName, lead.leadCode, stage?.name, owner?.name, probability].some(value => String(value ?? '').toLowerCase().includes(term));
      return userMatches && percentageMatches && textMatches;
    });

    const data = filtered.slice((page - 1) * limit, page * limit).map((lead, index) => {
      const owner = userMap.get(lead.assignedTo ?? lead.createdBy ?? '');
      const stage = stageMap.get(lead.leadStageId ?? 0);
      return { sl: (page - 1) * limit + index + 1, lead: lead.clientName, leadId: lead.uuid, stage: stage?.name ?? null, stageId: stage?.uuid ?? null, user: owner?.name ?? lead.assignedTo ?? null, userId: owner?.uuid ?? lead.assignedTo ?? null, probability: probabilityMap.get(lead.leadStageId ?? 0) ?? null };
    });
    return { data, meta: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) || 1, userId: query.userId ?? null, minimumPercentage: query.minimumPercentage ?? null, maximumPercentage: query.maximumPercentage ?? null, probabilityConfigured: probabilities.length > 0 } };
  }

  private async readProbabilities(): Promise<ProbabilityRow[]> {
    const sequelize = this.leads.sequelize!;
    const columns = await sequelize.query<{ column_name: string }>(`SELECT column_name FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'crm_lead_stages' AND column_name = 'sales_probability'`, { type: QueryTypes.SELECT });
    if (!columns.length) return [];
    return sequelize.query<ProbabilityRow>(`SELECT id, sales_probability AS probability FROM crm_lead_stages WHERE deleted_at IS NULL`, { type: QueryTypes.SELECT });
  }
}
