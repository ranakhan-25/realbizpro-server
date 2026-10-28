import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadSource } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { QuerySourceWiseLeadReportDto } from './dto/query-source-wise-lead-report.dto';

const SOURCE_COLUMNS = [
  { key: 'coldLead', label: 'Cold Lead', aliases: ['cold lead', 'coldlead'] },
  { key: 'facebook', label: 'Facebook', aliases: ['facebook'] },
  { key: 'fairLeads', label: 'Fair Leads', aliases: ['fair leads', 'fair lead', 'fairleads'] },
  { key: 'google', label: 'Google', aliases: ['google'] },
  { key: 'linkedin', label: 'Linkdin', aliases: ['linkedin', 'linkdin', 'linked in'] },
  { key: 'others', label: 'Others', aliases: ['others', 'other'] },
  { key: 'projectBanner', label: 'Project Banner', aliases: ['project banner', 'projectbanner'] },
  { key: 'purchaseLead', label: 'Purchase Lead', aliases: ['purchase lead', 'purchaselead'] },
  { key: 'reference', label: 'Reference', aliases: ['reference', 'referral'] },
  { key: 'socialMedia', label: 'Social Media', aliases: ['social media', 'socialmedia'] },
  { key: 'tailwindCss', label: 'Tailwind CSS', aliases: ['tailwind css', 'tailwindcss'] },
  { key: 'youtube', label: 'Youtube', aliases: ['youtube', 'you tube'] },
];

type ReportRow = Record<string, string | number>;

@Injectable()
export class SourceWiseLeadReportService {
  constructor(
    @InjectModel(Lead) private readonly leads: typeof Lead,
    @InjectModel(LeadSource) private readonly sources: typeof LeadSource,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
  ) {}

  async dropdowns() {
    const [users, leadSources] = await Promise.all([
      this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'name', 'userCode'], order: [['name', 'ASC']] }),
      this.sources.findAll({ where: { isActive: true }, attributes: ['id', 'uuid', 'name', 'code'], order: [['name', 'ASC']] }),
    ]);
    return { users, leadSources };
  }

  async report(query: QuerySourceWiseLeadReportDto) {
    const where: any = {};
    if (query.dateFrom || query.dateTo) where.leadDate = { ...(query.dateFrom ? { [Op.gte]: query.dateFrom } : {}), ...(query.dateTo ? { [Op.lte]: query.dateTo } : {}) };
    if (query.userId) where.assignedTo = query.userId;
    if (query.leadSourceId) where.leadSourceId = query.leadSourceId;

    const [leads, users] = await Promise.all([
      this.leads.findAll({ where, attributes: ['id', 'assignedTo', 'status', 'leadSourceId'], include: [{ association: 'source', required: false, attributes: ['id', 'name', 'code'] }] }),
      this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'name'], order: [['name', 'ASC']] }),
    ]);

    const userMap = new Map(users.map(user => [user.uuid, user.name]));
    const grouped = new Map<string, Lead[]>();
    for (const lead of leads) {
      const id = lead.assignedTo ?? 'unassigned';
      if (!grouped.has(id)) grouped.set(id, []);
      grouped.get(id)!.push(lead);
    }

    const data = [...grouped.entries()].sort((a, b) => (userMap.get(a[0]) ?? a[0]).localeCompare(userMap.get(b[0]) ?? b[0])).map(([userId, rows]) => this.toRow(userId, userMap.get(userId) ?? 'Unassigned', rows));
    data.push(this.toRow('total', 'Grand Total', leads));
    return {
      data: { columns: [{ key: 'user', label: 'User' }, ...SOURCE_COLUMNS.map(item => ({ key: item.key, label: item.label })), { key: 'junk', label: 'Junk' }, { key: 'total', label: 'Total' }], rows: data },
      meta: { dateFrom: query.dateFrom ?? null, dateTo: query.dateTo ?? null, totalLeads: leads.length, totalUsers: grouped.size },
    };
  }

  private toRow(userId: string, user: string, leads: Lead[]): ReportRow {
    const row: ReportRow = { userId, user };
    const junk = leads.filter(lead => (lead.status ?? '').toLowerCase() === 'junk');
    const activeLeads = leads.filter(lead => (lead.status ?? '').toLowerCase() !== 'junk');
    for (const column of SOURCE_COLUMNS) row[column.key] = activeLeads.filter(lead => column.aliases.some(alias => this.normalize(lead.source?.name ?? '').includes(this.normalize(alias)))).length;
    row.junk = junk.length;
    row.total = leads.length;
    return row;
  }

  private normalize(value: string) { return value.toLowerCase().replace(/[\s_-]/g, ''); }
}
