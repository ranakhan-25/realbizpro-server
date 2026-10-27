import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CrmLeadNegotiation, CrmNegotiationStatus } from 'src/database/models/crm/call-center/crm-lead-negotiation.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadCallAssignment } from 'src/database/models/crm/lead/crm-lead-call-assignment.model';
import { FlatLand } from 'src/database/models/projects/flatland/pr_flatland.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { QueryDealNegotiationActivityDto } from './dto/query-deal-negotiation-activity.dto';
import { ReassignDealNegotiationDto } from './dto/deal-negotiation-action.dto';

@Injectable()
export class DealNegotiationActivityService {
  constructor(
    @InjectModel(CrmLeadNegotiation) private readonly negotiations: typeof CrmLeadNegotiation,
    @InjectModel(Lead) private readonly leads: typeof Lead,
    @InjectModel(Project) private readonly projects: typeof Project,
    @InjectModel(FlatLand) private readonly flatLand: typeof FlatLand,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
    @InjectModel(LeadCallAssignment) private readonly assignments: typeof LeadCallAssignment,
  ) {}

  async list(query: QueryDealNegotiationActivityDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 10, 100);
    const where: any = {};
    if (query.status) where.status = query.status;
    const term = query.search?.trim();
    if (term) {
      where[Op.or] = [
        { status: { [Op.iLike]: `%${term}%` } },
        { '$lead.clientName$': { [Op.iLike]: `%${term}%` } },
        { '$lead.leadCode$': { [Op.iLike]: `%${term}%` } },
        { '$project.name$': { [Op.iLike]: `%${term}%` } },
        { '$flatLand.flatLandNo$': { [Op.iLike]: `%${term}%` } },
      ];
    }
    const { rows, count } = await this.negotiations.findAndCountAll({
      where,
      include: this.relations(),
      order: [['createdAt', 'DESC'], ['id', 'DESC']],
      limit,
      offset: (page - 1) * limit,
      distinct: true,
    });
    return {
      data: rows.map((row, index) => this.toPublic(row, (page - 1) * limit + index + 1)),
      meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    };
  }

  async details(uuid: string) {
    const row = await this.find(uuid);
    return this.toPublic(row);
  }

  async setDecision(uuid: string, status: 'approved' | 'rejected', note?: string) {
    const row = await this.find(uuid);
    if (row.status !== CrmNegotiationStatus.PENDING) throw new BadRequestException('Only pending negotiation activities can be approved or rejected');
    const decisionStatus = status === 'approved' ? CrmNegotiationStatus.APPROVED : CrmNegotiationStatus.REJECTED;
    await row.update({
      status: decisionStatus,
      ...(note !== undefined ? { rejectionReason: note } : {}),
      ...(decisionStatus === CrmNegotiationStatus.APPROVED ? { approvalDate: new Date() } : {}),
    });
    return this.details(uuid);
  }

  async reassign(uuid: string, dto: ReassignDealNegotiationDto) {
    const row = await this.find(uuid);
    if (!row.lead) throw new NotFoundException('Related lead not found');
    const assignee = await this.users.findOne({ where: { uuid: dto.userId, isActive: true }, attributes: ['uuid'] });
    if (!assignee) throw new NotFoundException(`Active user ${dto.userId} not found`);
    await this.negotiations.sequelize!.transaction(async transaction => {
      await this.assignments.create({
        leadId: row.lead!.id,
        assignedFrom: row.lead!.assignedTo ?? row.createdById ?? assignee.uuid,
        assignedTo: assignee.uuid,
        assignmentDate: new Date(),
        instruction: dto.note,
        assignedUserType: 'Officer/SR',
        status: 'pending',
        projectId: row.lead!.projectId,
      }, { transaction });
      await row.lead!.update({ assignedTo: assignee.uuid }, { transaction });
    });
    return { negotiation: await this.details(uuid), assignedTo: { uuid: assignee.uuid }, note: dto.note ?? null };
  }

  private async find(uuid: string) {
    const row = await this.negotiations.findOne({ where: { uuid }, include: this.relations() });
    if (!row) throw new NotFoundException(`Negotiation activity ${uuid} not found`);
    return row;
  }

  private relations() {
    return [
      { association: 'lead', required: false, attributes: ['id', 'uuid', 'leadCode', 'clientName', 'phone'] },
      { association: 'project', required: false, attributes: ['uuid', 'code', 'name'] },
      { association: 'flatLand', required: false, attributes: ['uuid', 'flatLandNo', 'propertyType', 'projectId'] },
      { association: 'creator', required: false, attributes: ['uuid', 'name'] },
      { association: 'approver', required: false, attributes: ['uuid', 'name'] },
    ];
  }

  private toPublic(row: CrmLeadNegotiation, sl?: number) {
    const data = row.toJSON() as any;
    const approval = data.status === CrmNegotiationStatus.APPROVED ? 'Accepted' : data.status === CrmNegotiationStatus.REJECTED ? 'Rejected' : 'Pending';
    const offerPrice = Number(data.clientOfferedPrice ?? 0);
    const discountAmount = Number(data.discountAmount ?? 0);
    return {
      ...(sl !== undefined ? { sl } : {}),
      ...data,
      leadName: data.lead?.clientName ?? null,
      projectName: data.project?.name ?? null,
      flatLandName: data.flatLand?.flatLandNo ?? null,
      finalPrice: data.finalAgreedPrice ?? 0,
      activityType: data.activityType ?? 'offer',
      discountPercent: data.discountPercent ?? (offerPrice > 0 ? Number(((discountAmount / offerPrice) * 100).toFixed(2)) : 0),
      approval,
      createdBy: data.creator?.name ?? null,
      approvedBy: data.approver?.name ?? null,
      note: data.rejectionReason ?? null,
      action: {
        canView: true,
        canApprove: data.status === CrmNegotiationStatus.PENDING,
        canReject: data.status === CrmNegotiationStatus.PENDING,
        canReassign: true,
      },
    };
  }
}
