import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CrmLeadNegotiation, CrmNegotiationStatus } from 'src/database/models/crm/call-center/crm-lead-negotiation.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { FlatLand } from 'src/database/models/projects/flatland/pr_flatland.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { QueryDealNegotiationReportDto } from './dto/query-deal-negotiation-report.dto';

@Injectable()
export class DealNegotiationReportService {
  constructor(
    @InjectModel(CrmLeadNegotiation) private readonly negotiations: typeof CrmLeadNegotiation,
    @InjectModel(Lead) private readonly leads: typeof Lead,
    @InjectModel(Project) private readonly projects: typeof Project,
    @InjectModel(FlatLand) private readonly flatLands: typeof FlatLand,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
  ) {}

  async dropdowns(currentUser?: any) {
    const [projects, flatLands, leads, users] = await Promise.all([
      this.projects.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.flatLands.findAll({ attributes: ['uuid', 'projectId', 'flatLandNo', 'projectName'], order: [['flatLandNo', 'ASC']] }),
      this.leads.findAll({ attributes: ['id', 'uuid', 'leadCode', 'clientName'], order: [['clientName', 'ASC']] }),
      this.users.findAll({ attributes: ['uuid', 'userCode', 'name'], where: { isActive: true }, order: [['name', 'ASC']] }),
    ]);
    return {
      projects,
      flatLands,
      leads,
      users,
      activityTypes: [{ value: 'offer', label: 'Offer' }, { value: 'counter_offer', label: 'Counter Offer' }],
      statuses: Object.values(CrmNegotiationStatus).map(value => ({ value, label: value[0].toUpperCase() + value.slice(1) })),
    };
  }

  async report(query: QueryDealNegotiationReportDto, currentUser?: any) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);
    const [rows, projects, flatLands, leads, users] = await Promise.all([
      this.negotiations.findAll({ include: this.relations(), order: [['createdAt', 'DESC'], ['id', 'DESC']] }),
      this.projects.findAll({ attributes: ['uuid', 'code', 'name'] }),
      this.flatLands.findAll({ attributes: ['uuid', 'projectId', 'flatLandNo', 'projectName'] }),
      this.leads.findAll({ attributes: ['id', 'uuid', 'leadCode', 'clientName'] }),
      this.users.findAll({ attributes: ['uuid', 'userCode', 'name'] }),
    ]);
    const projectMap = new Map(projects.flatMap(row => [[row.uuid, row], [row.code, row]]));
    const flatLandMap = new Map(flatLands.map(row => [row.flatLandNo, row]));
    const leadMap = new Map(leads.flatMap(row => [[String(row.id), row], [row.uuid, row], [row.leadCode, row]]));
    const userMap = new Map(users.flatMap(row => [[row.uuid, row], [row.userCode ?? '', row], [row.name, row]]));
    const term = query.search?.trim().toLowerCase();
    const filtered = rows.filter(row => {
      const data = row.toJSON() as any;
      const project = projectMap.get(data.projectId) ?? data.project;
      const flatLand = flatLandMap.get(data.flatLandId) ?? flatLands.find(item => item.uuid === data.flatLandId);
      const lead = leadMap.get(String(data.leadId)) ?? data.lead;
      const creator = userMap.get(data.createdById) ?? data.creator;
      const date = new Date(data.createdAt);
      const dateMatches = (!query.dateFrom || date >= new Date(`${query.dateFrom}T00:00:00.000Z`)) && (!query.dateTo || date <= new Date(`${query.dateTo}T23:59:59.999Z`));
      const projectMatches = !query.projectId || [project?.uuid, project?.code, project?.name, data.projectId].some(value => String(value ?? '').toLowerCase() === query.projectId!.trim().toLowerCase());
      const flatMatches = !query.flatLandNo || String(flatLand?.flatLandNo ?? data.flatLandId).toLowerCase().includes(query.flatLandNo.trim().toLowerCase());
      const leadMatches = !query.leadId || [lead?.id, lead?.uuid, lead?.leadCode, lead?.clientName, data.leadId].some(value => String(value ?? '').toLowerCase() === query.leadId!.trim().toLowerCase());
      const activityType = data.activityType ?? 'offer';
      const activityMatches = !query.activityType || activityType.toLowerCase() === query.activityType.trim().toLowerCase();
      const statusMatches = !query.status || String(data.status ?? '').toLowerCase() === query.status.trim().toLowerCase();
      const creatorMatches = !query.createdBy || [creator?.uuid, creator?.userCode, creator?.name, data.createdById].some(value => String(value ?? '').toLowerCase() === query.createdBy!.trim().toLowerCase());
      const searchable = [lead?.clientName, lead?.leadCode, project?.name, flatLand?.flatLandNo, activityType, data.status, creator?.name, data.clientOfferedPrice, data.counterPrice, data.finalAgreedPrice];
      return dateMatches && projectMatches && flatMatches && leadMatches && activityMatches && statusMatches && creatorMatches && (!term || searchable.some(value => String(value ?? '').toLowerCase().includes(term)));
    });
    const data = filtered.slice((page - 1) * limit, page * limit).map((row, index) => this.toRow(row, index + (page - 1) * limit + 1));
    const totals = filtered.reduce((sum, row) => { const item = this.toRow(row, 0); sum.clientOfferPrice += item.clientOfferPrice; sum.counterPrice += item.counterPrice ?? 0; sum.finalPrice += item.finalPrice ?? 0; return sum; }, { clientOfferPrice: 0, counterPrice: 0, finalPrice: 0 });
    return { data, totals, meta: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) || 1, dateFrom: query.dateFrom ?? null, dateTo: query.dateTo ?? null, projectId: query.projectId ?? null, flatLandNo: query.flatLandNo ?? null, leadId: query.leadId ?? null, activityType: query.activityType ?? null, status: query.status ?? null, createdBy: query.createdBy ?? null } };
  }

  private relations() {
    return [
      { association: 'lead', required: false, attributes: ['id', 'uuid', 'leadCode', 'clientName'] },
      { association: 'project', required: false, attributes: ['uuid', 'code', 'name'] },
      { association: 'flatLand', required: false, attributes: ['uuid', 'flatLandNo', 'projectId', 'projectName'] },
      { association: 'creator', required: false, attributes: ['uuid', 'userCode', 'name'] },
      { association: 'approver', required: false, attributes: ['uuid', 'userCode', 'name'] },
    ];
  }

  private toRow(row: CrmLeadNegotiation, sl: number) {
    const data = row.toJSON() as any;
    const finalPrice = data.finalAgreedPrice == null ? null : Number(data.finalAgreedPrice);
    return {
      id: data.id, uuid: data.uuid, sl,
      leadName: data.lead?.clientName ?? null,
      leadId: data.lead?.uuid ?? data.leadId,
      leadCode: data.lead?.leadCode ?? null,
      project: data.project?.name || data.projectId || null,
      projectId: data.project?.uuid || data.projectId || null,
      flatLand: data.flatLand?.flatLandNo ?? data.flatLandId ?? null,
      flatLandId: data.flatLand?.uuid ?? data.flatLandId,
      activityType: data.activityType ?? 'offer',
      clientOfferPrice: Number(data.clientOfferedPrice ?? 0),
      counterPrice: data.counterPrice == null ? null : Number(data.counterPrice),
      finalPrice,
      round: data.roundNo == null ? null : Number(data.roundNo),
      status: data.status ?? null,
      statusLabel: data.status === 'approved' ? 'Approved' : data.status === 'rejected' ? 'Rejected' : 'Pending',
      createdBy: data.creator?.name || data.createdById || null,
      createdById: data.creator?.uuid || data.createdById || null,
      approvedBy: data.approver?.name || data.approvedById || null,
      approvedById: data.approver?.uuid || data.approvedById || null,
      date: data.createdAt,
    };
  }
}
