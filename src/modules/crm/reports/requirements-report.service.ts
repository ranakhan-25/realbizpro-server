import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, QueryTypes } from 'sequelize';
import { LeadArea, LeadRequirementType } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadRequirement } from 'src/database/models/crm/lead/crm-lead-requirement.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { QueryRequirementsReportDto } from './dto/query-requirements-report.dto';

type RequirementRow = { id: number; uuid: string; leadId: number; requirementTypeId?: number; propertyType?: string; preferredArea?: string; sizeSqft?: number; budgetMin?: number; budgetMax?: number; featuresRequired?: unknown; remarks?: string; createdBy?: string };

@Injectable()
export class RequirementsReportService {
  constructor(
    @InjectModel(LeadRequirement) private readonly requirements: typeof LeadRequirement,
    @InjectModel(Lead) private readonly leads: typeof Lead,
    @InjectModel(LeadArea) private readonly areas: typeof LeadArea,
    @InjectModel(LeadRequirementType) private readonly requirementTypes: typeof LeadRequirementType,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
  ) {}

  async dropdowns(currentUser?: any) {
    const [users, areas, requirementTypes] = await Promise.all([
      this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'userCode', 'name'], order: [['name', 'ASC']] }),
      this.areas.findAll({ attributes: ['id', 'uuid', 'name', 'city', 'zone'], order: [['name', 'ASC']] }),
      this.requirementTypes.findAll({ attributes: ['id', 'uuid', 'name'], order: [['name', 'ASC']] }),
    ]);
    return { users, areas, requirementTypes };
  }

  async report(query: QueryRequirementsReportDto, currentUser?: any) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const conditions = ['deleted_at IS NULL'];
    const replacements: Record<string, string | number> = {};
    if (query.requirementTypeId) { conditions.push('requirement_type_id = :requirementTypeId'); replacements.requirementTypeId = query.requirementTypeId; }
    const rows = await this.requirements.sequelize!.query<RequirementRow>(`SELECT id, uuid::text AS uuid, lead_id AS "leadId", requirement_type_id AS "requirementTypeId", property_type AS "propertyType", preferred_area AS "preferredArea", size_sqft AS "sizeSqft", budget_min AS "budgetMin", budget_max AS "budgetMax", features_required AS "featuresRequired", remarks, created_by AS "createdBy" FROM crm_lead_requirements WHERE ${conditions.join(' AND ')} ORDER BY id DESC`, { replacements, type: QueryTypes.SELECT });
    const leadIds = [...new Set(rows.map(row => row.leadId))];
    const [leads, users, areas, requirementTypes] = await Promise.all([
      this.leads.findAll({ where: { id: { [Op.in]: leadIds } }, attributes: ['id', 'uuid', 'leadCode', 'clientName', 'assignedTo', 'createdBy'] }),
      this.users.findAll({ attributes: ['uuid', 'userCode', 'name'] }),
      this.areas.findAll({ attributes: ['id', 'name'] }),
      this.requirementTypes.findAll({ attributes: ['id', 'name'] }),
    ]);
    const leadMap = new Map(leads.map(lead => [lead.id, lead]));
    const userMap = new Map<string, SysUser>();
    for (const user of users) { userMap.set(user.uuid, user); if (user.userCode) userMap.set(user.userCode, user); }
    const areaMap = new Map(areas.map(area => [area.id, area]));
    const typeMap = new Map(requirementTypes.map(type => [type.id, type]));
    const areaName = query.areaId ? areaMap.get(query.areaId)?.name : undefined;
    const term = query.search?.trim().toLowerCase();
    const filtered = rows.filter(row => {
      const lead = leadMap.get(row.leadId);
      const owner = userMap.get(lead?.assignedTo ?? row.createdBy ?? '');
      const areaMatches = !areaName || (row.preferredArea ?? '').toLowerCase().includes(areaName.toLowerCase());
      const userMatches = !query.userId || [lead?.assignedTo, lead?.createdBy, row.createdBy].includes(query.userId) || owner?.uuid === query.userId || owner?.userCode === query.userId;
      const type = typeMap.get(row.requirementTypeId ?? 0)?.name;
      const textMatches = !term || [row.propertyType, type, row.preferredArea, row.sizeSqft, row.budgetMin, row.budgetMax, lead?.clientName, lead?.leadCode, row.remarks, JSON.stringify(row.featuresRequired)].some(value => String(value ?? '').toLowerCase().includes(term));
      return areaMatches && userMatches && textMatches;
    });
    const data = filtered.slice((page - 1) * limit, page * limit).map((row, index) => {
      const lead = leadMap.get(row.leadId);
      const ownerId = lead?.assignedTo ?? row.createdBy ?? null;
      const owner = userMap.get(ownerId ?? '');
      const type = typeMap.get(row.requirementTypeId ?? 0);
      return {
        sl: (page - 1) * limit + index + 1,
        type: type?.name ?? row.propertyType ?? null,
        requirementTypeId: row.requirementTypeId ?? null,
        price: this.price(row.budgetMin, row.budgetMax),
        budgetMin: row.budgetMin ?? null,
        budgetMax: row.budgetMax ?? null,
        size: row.sizeSqft ?? null,
        area: row.preferredArea ?? null,
        lead: lead?.clientName ?? null,
        leadId: lead?.uuid ?? null,
        user: owner?.name ?? ownerId,
        userId: owner?.uuid ?? ownerId,
        description: row.remarks ?? this.features(row.featuresRequired),
        requirementId: row.uuid,
      };
    });
    return { data, meta: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) || 1, userId: query.userId ?? null, areaId: query.areaId ?? null, requirementTypeId: query.requirementTypeId ?? null } };
  }

  private price(min?: number, max?: number) { if (min == null && max == null) return null; if (min == null) return String(max); if (max == null) return String(min); return `${min} - ${max}`; }
  private features(value: unknown) { return value == null ? null : typeof value === 'string' ? value : JSON.stringify(value); }
}
