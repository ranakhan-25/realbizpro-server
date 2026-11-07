import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CrSaleAgreement } from 'src/database/models/credit-realization/cr_sale_agreement.model';
import { FlatLandBooking } from 'src/database/models/projects/flat-land-booking/pr_flat_land_booking.model';
import { FlatLand } from 'src/database/models/projects/flatland/pr_flatland.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectTeamMember } from 'src/database/models/projects/project-team-member/pr_project_team_member.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { QueryFlatLandSaleReportDto } from './dto/query-flat-land-sale-report.dto';

type AgreementRow = { projectId?: string; unitIdentifier?: string; customerName?: string; agreementDate?: string; handoverDate?: string; totalPrice?: number };

@Injectable()
export class FlatLandSaleReportService {
  constructor(
    @InjectModel(FlatLandBooking) private readonly bookings: typeof FlatLandBooking,
    @InjectModel(FlatLand) private readonly flatLands: typeof FlatLand,
    @InjectModel(Project) private readonly projects: typeof Project,
    @InjectModel(ProjectTeamMember) private readonly teamMembers: typeof ProjectTeamMember,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
    @InjectModel(CrSaleAgreement) private readonly agreements: typeof CrSaleAgreement,
  ) {}

  async dropdowns(currentUser?: any) {
    const [bookings, projects, teams, users] = await Promise.all([
      this.bookings.findAll({ attributes: ['salesBy'], where: { salesBy: { [Op.ne]: null } }, order: [['salesBy', 'ASC']] }),
      this.projects.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.teamMembers.findAll({ attributes: ['uuid', 'projectId', 'name', 'email'], order: [['name', 'ASC']] }),
      this.users.findAll({ attributes: ['uuid', 'userCode', 'name'], order: [['name', 'ASC']] }),
    ]);
    const salesBy = [...new Set(bookings.map(row => row.salesBy).filter(Boolean))].map(value => ({ value, label: value }));
    return { salesBy, teams, projects, users };
  }

  async report(query: QueryFlatLandSaleReportDto, currentUser?: any) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const dateWhere: any = {};
    if (query.dateFrom || query.dateTo) dateWhere.bookingDate = { ...(query.dateFrom ? { [Op.gte]: query.dateFrom } : {}), ...(query.dateTo ? { [Op.lte]: query.dateTo } : {}) };
    if (query.projectId) {
      const project = await this.projects.findOne({ where: { [Op.or]: [{ uuid: query.projectId }, { code: query.projectId }] } as any, attributes: ['uuid'] });
      dateWhere.projectId = project?.uuid ?? query.projectId;
    }
    if (query.salesBy) dateWhere.salesBy = { [Op.iLike]: `%${query.salesBy.trim()}%` };

    const [bookings, projects, flatLands, teams, users, agreements] = await Promise.all([
      this.bookings.findAll({ where: dateWhere, attributes: ['id', 'uuid', 'projectId', 'flatLandId', 'code', 'bookingDate', 'customerName', 'salesBy', 'rate', 'otherCost', 'parking', 'utilityCharge', 'discount', 'subtotal', 'grandTotal', 'paid', 'due'], order: [['bookingDate', 'DESC'], ['id', 'DESC']] }),
      this.projects.findAll({ attributes: ['uuid', 'code', 'name'] }),
      this.flatLands.findAll({ attributes: ['uuid', 'projectId', 'flatLandNo', 'size'] }),
      this.teamMembers.findAll({ attributes: ['uuid', 'projectId', 'name', 'email'] }),
      this.users.findAll({ attributes: ['uuid', 'userCode', 'name'] }),
      this.agreements.findAll({ attributes: ['projectId', 'unit_identifier', 'customer_name', 'agreement_date', 'handover_date', 'total_price'] }).catch(() => [] as CrSaleAgreement[]),
    ]);
    const projectMap = new Map(projects.map(row => [row.uuid, row]));
    const propertyMap = new Map(flatLands.map(row => [row.uuid, row]));
    const teamMap = new Map(teams.map(row => [row.uuid, row]));
    const userMap = new Map<string, SysUser>();
    for (const user of users) { userMap.set(user.uuid, user); if (user.userCode) userMap.set(user.userCode, user); }
    const agreementMap = new Map<string, AgreementRow>();
    for (const agreement of agreements) agreementMap.set(`${agreement.projectId ?? ''}:${agreement.unit_identifier ?? ''}`, agreement as AgreementRow);
    const selectedTeam = query.teamId ? teamMap.get(query.teamId) ?? teams.find(team => [team.name, team.email, team.uuid].some(value => value?.toLowerCase() === query.teamId?.toLowerCase())) : undefined;
    const term = query.search?.trim().toLowerCase();
    const filtered = bookings.filter(booking => {
      const property = propertyMap.get(booking.flatLandId);
      const project = projectMap.get(booking.projectId);
      const salesUser = userMap.get(booking.salesBy ?? '');
      const teamMatches = !selectedTeam || selectedTeam.projectId === booking.projectId || [selectedTeam.name, selectedTeam.email, selectedTeam.uuid].some(value => value?.toLowerCase() === booking.salesBy?.toLowerCase());
      const agreement = agreementMap.get(`${booking.projectId}:${property?.flatLandNo ?? ''}`);
      const values = [booking.id, project?.name, project?.code, booking.customerName, booking.code, property?.flatLandNo, property?.size, booking.rate, booking.grandTotal, booking.paid, booking.due, booking.parking, booking.utilityCharge, booking.otherCost, booking.discount, agreement?.agreementDate, agreement?.handoverDate, booking.salesBy, salesUser?.name];
      return teamMatches && (!term || values.some(value => String(value ?? '').toLowerCase().includes(term)));
    });
    const data = filtered.slice((page - 1) * limit, page * limit).map((booking, index) => this.toRow(booking, index + (page - 1) * limit, projectMap, propertyMap, agreementMap, userMap));
    const totals = filtered.reduce((sum, booking) => { const property = propertyMap.get(booking.flatLandId); const size = this.number(property?.size); const rate = this.number(booking.rate); sum.sftSize += size; sum.rate += rate; sum.total += size * rate; sum.parking += this.number(booking.parking); sum.utilityCharge += this.number(booking.utilityCharge); sum.otherCost += this.number(booking.otherCost); sum.discount += this.number(booking.discount); sum.adjustment += 0; sum.grandTotal += this.number(booking.grandTotal); sum.paid += this.number(booking.paid); sum.due += this.number(booking.due); return sum; }, { sftSize: 0, rate: 0, total: 0, parking: 0, utilityCharge: 0, otherCost: 0, discount: 0, adjustment: 0, grandTotal: 0, paid: 0, due: 0 });
    return { data, totals, meta: { page, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) || 1, dateFrom: query.dateFrom ?? null, dateTo: query.dateTo ?? null, salesBy: query.salesBy ?? null, teamId: query.teamId ?? null, projectId: query.projectId ?? null } };
  }

  private toRow(booking: FlatLandBooking, index: number, projectMap: Map<string, Project>, propertyMap: Map<string, FlatLand>, agreementMap: Map<string, AgreementRow>, userMap: Map<string, SysUser>) {
    const property = propertyMap.get(booking.flatLandId);
    const project = projectMap.get(booking.projectId);
    const agreement = agreementMap.get(`${booking.projectId}:${property?.flatLandNo ?? ''}`);
    const salesUser = userMap.get(booking.salesBy ?? '');
    const size = this.number(property?.size);
    const rate = this.number(booking.rate);
    return { id: booking.id, sl: index + 1, project: project?.name ?? property?.projectName ?? null, projectId: booking.projectId, customerName: booking.customerName, saleCode: booking.code, flatLandNo: property?.flatLandNo ?? null, flatLandId: booking.flatLandId, sftSize: size, rate, total: size * rate, parking: this.number(booking.parking), utilityCharge: this.number(booking.utilityCharge), otherCost: this.number(booking.otherCost), discount: this.number(booking.discount), adjustment: 0, grandTotal: this.number(booking.grandTotal), paid: this.number(booking.paid), due: this.number(booking.due), agreementDate: agreement?.agreementDate ?? null, handoverDate: agreement?.handoverDate ?? null, salesBy: salesUser?.name ?? booking.salesBy ?? null, salesById: salesUser?.uuid ?? booking.salesBy ?? null, bookingDate: booking.bookingDate, bookingId: booking.uuid };
  }

  private number(value: unknown): number {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    const parsed = Number.parseFloat(String(value ?? '').replace(/,/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  }
}
