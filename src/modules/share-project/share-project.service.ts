import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ShareUser, ShareUserRole, ShareUserStatus } from '../../database/models/share-user/share-user.model';
import { ShareProject, ShareProjectStatus } from '../../database/models/share-project/share-project.model';
import { ShareProjectCategory } from '../../database/models/share-project/share-project-category.model';
import { ShareProjectImage } from '../../database/models/share-project/share-project-image.model';
import { ShareProjectDocument } from '../../database/models/share-project/share-project-document.model';
import { ShareProjectSubmission } from '../../database/models/share-project/share-project-submission.model';
import { ShareProjectReview, ShareProjectReviewDecision } from '../../database/models/share-project/share-project-review.model';
import { ShareProjectStatusHistory } from '../../database/models/share-project/share-project-status-history.model';
import { ShareProjectInvestment, ShareProjectInvestmentStatus } from '../../database/models/share-project/share-project-investment.model';
import {
  CreateShareProjectCategoryDto,
  CreateShareProjectDto,
  RejectShareProjectDto,
  UpdateShareProjectCategoryDto,
  UpdateShareProjectDto,
  PublicCreateShareProjectDto,
  PublicInvestmentRequestDto,
} from './dto/share-project.dto';
import { BANGLADESH_DIVISIONS, ALL_BANGLADESH_DISTRICTS } from '../locations/locations.data';
import { EmailService } from '../email/email.service';
import * as argon2 from 'argon2';

@Injectable()
export class ShareProjectService {
  constructor(
    @InjectModel(ShareProject) private readonly projectModel: typeof ShareProject,
    @InjectModel(ShareUser) private readonly shareUserModel: typeof ShareUser,
    @InjectModel(ShareProjectCategory) private readonly categoryModel: typeof ShareProjectCategory,
    @InjectModel(ShareProjectImage) private readonly imageModel: typeof ShareProjectImage,
    @InjectModel(ShareProjectDocument) private readonly documentModel: typeof ShareProjectDocument,
    @InjectModel(ShareProjectSubmission) private readonly submissionModel: typeof ShareProjectSubmission,
    @InjectModel(ShareProjectReview) private readonly reviewModel: typeof ShareProjectReview,
    @InjectModel(ShareProjectStatusHistory) private readonly historyModel: typeof ShareProjectStatusHistory,
    @InjectModel(ShareProjectInvestment) private readonly investmentModel: typeof ShareProjectInvestment,
    private readonly sequelize: Sequelize,
    private readonly emailService: EmailService,
  ) {}

  private generateCode(prefix: string, name: string) {
    const letters = name.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 2).padEnd(2, 'X');
    const now = new Date();
    const date = `${String(now.getDate()).padStart(2, '0')}${String(now.getMonth() + 1).padStart(2, '0')}${now.getFullYear()}`;
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `${prefix}-${letters}-${date}-${random}`;
  }

  private generateInvestmentCode(investorName: string, investorPhone: string) {
    const cleanName = (investorName || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const namePrefix = (cleanName.slice(0, 2) || 'IN').padEnd(2, 'X');
    const cleanPhone = (investorPhone || '').replace(/[^0-9]/g, '');
    const phoneSuffix = cleanPhone.length >= 2 ? cleanPhone.slice(-2) : (cleanPhone || '00').padStart(2, '0');
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    return `${namePrefix}@${phoneSuffix}-${year}${month}${day}${hours}${mins}${secs}`;
  }

  private async getShareUserIdentity(userId: number) {
    const user = await this.shareUserModel.findByPk(userId, {
      attributes: ['id', 'uuid', 'name', 'email', 'phone'],
    });
    const email = user?.email?.trim().toLowerCase() || null;
    return { user, email };
  }

  private ownerProjectWhere(ownerId: number, email?: string | null) {
    if (!email) return { ownerId };
    return {
      [Op.or]: [
        { ownerId },
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('creator_email')), email),
      ],
    };
  }

  private async ensureCategory(categoryId: number) {
    const category = await this.categoryModel.findByPk(categoryId);
    if (!category) throw new BadRequestException('Project category does not exist');
  }

  private async ownProject(uuid: string, ownerId: number) {
    const project = await this.projectModel.findOne({ where: { uuid } });
    if (!project) throw new NotFoundException('Share Project not found');
    const { email } = await this.getShareUserIdentity(ownerId);
    const matchesEmail = Boolean(email && project.creatorEmail?.trim().toLowerCase() === email);
    if (project.ownerId !== ownerId && !matchesEmail) throw new ForbiddenException('You can only manage your own projects');
    return project;
  }

  private async syncAssets(projectUuid: string, dto: CreateShareProjectDto | UpdateShareProjectDto, transaction: Transaction) {
    await this.imageModel.destroy({ where: { projectId: projectUuid }, transaction });
    await this.documentModel.destroy({ where: { projectId: projectUuid }, transaction });
    if (dto.images?.length) {
      await this.imageModel.bulkCreate(dto.images.map((image, index) => ({
        projectId: projectUuid,
        url: image.url,
        altText: image.altText || image.title,
        sortOrder: image.sortOrder ?? index,
      })) as any, { transaction });
    }
    if (dto.documents?.length) {
      await this.documentModel.bulkCreate(dto.documents.map((document) => ({
        projectId: projectUuid,
        title: document.title || 'Project Document',
        url: document.url,
        fileType: document.fileType,
      })) as any, { transaction });
    }
  }

  private projectIncludes() {
    return [] as any;
  }

  async create(ownerId: number, dto: CreateShareProjectDto) {
    await this.ensureCategory(dto.categoryId);
    const { user, email } = await this.getShareUserIdentity(ownerId);
    const transaction = await this.sequelize.transaction();
    let project: ShareProject;
    try {
      project = await this.projectModel.create({
        code: (dto as any).code || this.generateCode('SP', dto.name),
        creatorName: (dto as any).creatorName || user?.name || null,
        creatorEmail: ((dto as any).creatorEmail || email || '').trim().toLowerCase() || null,
        creatorPhone: (dto as any).creatorPhone || user?.phone || null,
        ownerId,
        categoryId: dto.categoryId,
        name: dto.name,
        description: dto.description,
        location: dto.location,
        thumbnailUrl: dto.thumbnailUrl || dto.images?.[0]?.url || null,
        totalInvestmentAmount: dto.totalInvestmentAmount,
        totalShares: dto.totalShares,
        pricePerShare: dto.pricePerShare,
        minimumInvestment: dto.minimumInvestment,
        expectedAnnualReturn: dto.expectedAnnualReturn,
        startDate: dto.startDate,
        endDate: dto.endDate,
        status: ShareProjectStatus.DRAFT,
      } as any, { transaction });
      await this.syncAssets(project.uuid, dto, transaction);
      await this.historyModel.create({ projectId: project.uuid, fromStatus: ShareProjectStatus.DRAFT, toStatus: ShareProjectStatus.DRAFT, changedBy: ownerId, note: 'Draft created' }, { transaction });
      await transaction.commit();
      return project.reload();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async update(ownerId: number, uuid: string, dto: UpdateShareProjectDto) {
    await this.ensureCategory(dto.categoryId);
    const project = await this.ownProject(uuid, ownerId);
    if (![ShareProjectStatus.DRAFT, ShareProjectStatus.REJECTED].includes(project.status)) throw new BadRequestException('Only draft or rejected projects can be edited');
    return this.sequelize.transaction(async (transaction) => {
      const fromStatus = project.status;
      await project.update({
        categoryId: dto.categoryId,
        name: dto.name,
        description: dto.description,
        location: dto.location,
        thumbnailUrl: dto.thumbnailUrl || dto.images?.[0]?.url || null,
        totalInvestmentAmount: dto.totalInvestmentAmount,
        totalShares: dto.totalShares,
        pricePerShare: dto.pricePerShare,
        minimumInvestment: dto.minimumInvestment,
        expectedAnnualReturn: dto.expectedAnnualReturn,
        startDate: dto.startDate,
        endDate: dto.endDate,
        status: project.status === ShareProjectStatus.REJECTED ? ShareProjectStatus.DRAFT : project.status,
      } as any, { transaction });
      await this.syncAssets(uuid, dto, transaction);
      await this.historyModel.create({ projectId: uuid, fromStatus, toStatus: project.status, changedBy: ownerId, note: 'Project details updated' }, { transaction });
      return project.reload({ transaction });
    });
  }

  async findMine(ownerId: number, page = 1, limit = 10, status?: ShareProjectStatus) {
    const { email } = await this.getShareUserIdentity(ownerId);
    const ownerWhere = this.ownerProjectWhere(ownerId, email);
    const where: any = status ? { [Op.and]: [ownerWhere, { status }] } : ownerWhere;
    const { rows, count } = await this.projectModel.findAndCountAll({
      where, limit, offset: (page - 1) * limit, order: [['createdAt', 'DESC']], include: this.projectIncludes(),
    });
    return { data: rows, meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) } };
  }

  async userDashboard(ownerId: number) {
    const { email } = await this.getShareUserIdentity(ownerId);
    const projects = await this.projectModel.findAll({
      where: this.ownerProjectWhere(ownerId, email),
      attributes: [
        'uuid',
        'name',
        'status',
        'totalInvestmentAmount',
        'totalShares',
        'pricePerShare',
        'startDate',
        'endDate',
        'createdAt',
        'updatedAt',
      ],
      order: [['updatedAt', 'DESC']],
    });

    const counts: Record<string, number> = {
      draft: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      published: 0,
      unpublished: 0,
    };

    const projectValueOf = (p: { totalShares?: number; pricePerShare?: string | number; totalInvestmentAmount?: string | number }) => {
      const shareCalc = Number(p.totalShares || 0) * Number(p.pricePerShare || 0);
      return shareCalc > 0 ? shareCalc : Number(p.totalInvestmentAmount || 0);
    };

    let totalShareValue = 0;
    let totalShares = 0;
    for (const project of projects) {
      counts[project.status] = (counts[project.status] || 0) + 1;
      totalShareValue += projectValueOf(project);
      totalShares += Number(project.totalShares || 0);
    }

    const ownerProjectUuids = projects.map((p) => p.uuid);
    const ownerProjectInvestments = ownerProjectUuids.length
      ? await this.investmentModel.findAll({
          where: { projectId: { [Op.in]: ownerProjectUuids } },
          order: [['createdAt', 'DESC']],
        })
      : [];

    const personalWhere: any = email
      ? {
          [Op.or]: [
            { investorId: ownerId },
            Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('investor_email')), email),
          ],
        }
      : { investorId: ownerId };
    const personalInvestments = await this.investmentModel.findAll({
      where: personalWhere,
      order: [['createdAt', 'DESC']],
    });

    // Lookup names for all referenced projects & investors cleanly without fragile includes
    const allInvestmentsMap = new Map<string, ShareProjectInvestment>();
    for (const inv of ownerProjectInvestments) allInvestmentsMap.set(inv.uuid, inv);
    for (const inv of personalInvestments) {
      if (!allInvestmentsMap.has(inv.uuid)) allInvestmentsMap.set(inv.uuid, inv);
    }
    const allInvestments = Array.from(allInvestmentsMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const projectByUuid = new Map<string, any>(projects.map((p) => [p.uuid, p]));
    const extraProjectUuids = [
      ...new Set(allInvestments.map((i) => i.projectId).filter((id) => id && !projectByUuid.has(id))),
    ];
    if (extraProjectUuids.length) {
      const extraProjects = await this.projectModel.findAll({
        where: { uuid: { [Op.in]: extraProjectUuids } },
        attributes: ['uuid', 'name', 'status', 'totalInvestmentAmount', 'totalShares', 'pricePerShare', 'startDate', 'endDate', 'createdAt'],
      });
      for (const ep of extraProjects) projectByUuid.set(ep.uuid, ep);
    }

    const investorIds = [...new Set(allInvestments.map((i) => Number(i.investorId)).filter(Boolean))];
    const investors = investorIds.length
      ? await this.shareUserModel.findAll({
          where: { id: { [Op.in]: investorIds } },
          attributes: ['id', 'name', 'email'],
        })
      : [];
    const investorById = new Map<number, ShareUser>(investors.map((u) => [Number(u.id), u]));

    const hasOwnedProjects = projects.length > 0;
    const primaryInvestments = hasOwnedProjects ? ownerProjectInvestments : personalInvestments;
    const confirmedPrimary = primaryInvestments.filter((i) => i.status === ShareProjectInvestmentStatus.CONFIRMED);

    // Sold shares & collection metrics
    const soldSharesByProject = new Map<string, number>();
    let soldShares = 0;
    let totalCollected = 0;
    for (const inv of confirmedPrimary) {
      const qty = Number(inv.quantity || 0);
      soldShares += qty;
      totalCollected += Number(inv.totalAmount || inv.shareValue || 0);
      soldSharesByProject.set(inv.projectId, (soldSharesByProject.get(inv.projectId) || 0) + qty);
    }

    let effectiveShareValue = totalShareValue;
    let effectiveTotalProjects = projects.length;
    if (!hasOwnedProjects && confirmedPrimary.length > 0) {
      effectiveShareValue = confirmedPrimary.reduce((s, i) => s + Number(i.totalAmount || i.shareValue || 0), 0);
      effectiveTotalProjects = new Set(confirmedPrimary.map((i) => i.projectId)).size;
      const investedProjectIds = [...new Set(confirmedPrimary.map((i) => i.projectId))];
      totalShares = investedProjectIds.reduce(
        (s, pid) => s + Number(projectByUuid.get(pid)?.totalShares || 0),
        0,
      );
    }
    const remainingShares = Math.max(0, totalShares - soldShares);

    // Trailing 12 months timeline ending in current month
    const now = new Date();
    const months: Array<{
      year: number;
      monthIndex: number;
      endOfMonth: Date;
      startOfMonth: Date;
      shareValue: number;
      collected: number;
      monthlyCollected: number;
      monthlyTarget: number;
      projectCount: number;
      pendingCount: number;
      rejectedCount: number;
    }> = [];

    for (let offset = 11; offset >= 0; offset -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      months.push({
        year: d.getFullYear(),
        monthIndex: d.getMonth(),
        startOfMonth,
        endOfMonth,
        shareValue: 0,
        collected: 0,
        monthlyCollected: 0,
        monthlyTarget: 0,
        projectCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
      });
    }

    const durationMonthsForProject = (p: any) => {
      if (p.startDate && p.endDate) {
        const s = new Date(p.startDate);
        const e = new Date(p.endDate);
        const diff = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth()) + 1;
        if (Number.isFinite(diff) && diff >= 1) return Math.min(diff, 60);
      }
      return 12;
    };

    for (const m of months) {
      let cumShareVal = 0;
      let cumProjCount = 0;
      let cumPending = 0;
      let cumRejected = 0;
      let monthTarget = 0;

      if (hasOwnedProjects) {
        for (const p of projects) {
          const created = new Date(p.createdAt);
          if (created <= m.endOfMonth) {
            const pVal = projectValueOf(p);
            cumShareVal += pVal;
            cumProjCount += 1;
            if (p.status === ShareProjectStatus.PENDING) cumPending += 1;
            if (p.status === ShareProjectStatus.REJECTED) cumRejected += 1;
            monthTarget += pVal / durationMonthsForProject(p);
          }
        }
      } else {
        const seenProj = new Set<string>();
        for (const inv of confirmedPrimary) {
          const created = new Date(inv.createdAt);
          if (created <= m.endOfMonth) {
            cumShareVal += Number(inv.totalAmount || inv.shareValue || 0);
            seenProj.add(inv.projectId);
          }
        }
        cumProjCount = seenProj.size;
      }

      let cumCollected = 0;
      let mCollected = 0;
      for (const inv of confirmedPrimary) {
        const created = new Date(inv.createdAt);
        const amt = Number(inv.totalAmount || inv.shareValue || 0);
        if (created <= m.endOfMonth) cumCollected += amt;
        if (created >= m.startOfMonth && created <= m.endOfMonth) mCollected += amt;
      }

      m.shareValue = Math.round(cumShareVal);
      m.collected = Math.round(cumCollected);
      m.monthlyCollected = Math.round(mCollected);
      m.monthlyTarget = Math.round(monthTarget);
      m.projectCount = cumProjCount;
      m.pendingCount = cumPending;
      m.rejectedCount = cumRejected;
    }

    const currMonth = months[months.length - 1];
    const prevMonth = months[months.length - 2];
    const pctDelta = (curr: number, prev: number) => {
      if (prev > 0) return Number((((curr - prev) / prev) * 100).toFixed(1));
      return curr > 0 ? 100 : 0;
    };

    // Allocation by project (top 4 + Others)
    const allocMap = new Map<string, number>();
    if (hasOwnedProjects) {
      for (const p of projects) {
        const v = projectValueOf(p);
        if (v > 0) allocMap.set(p.name, (allocMap.get(p.name) || 0) + v);
      }
    } else {
      for (const inv of confirmedPrimary) {
        const pname = projectByUuid.get(inv.projectId)?.name || 'Project';
        const v = Number(inv.totalAmount || inv.shareValue || 0);
        if (v > 0) allocMap.set(pname, (allocMap.get(pname) || 0) + v);
      }
    }
    const sortedAlloc = Array.from(allocMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    const allocation = sortedAlloc.slice(0, 4);
    if (sortedAlloc.length > 4) {
      const othersValue = sortedAlloc.slice(4).reduce((s, x) => s + x.value, 0);
      if (othersValue > 0) allocation.push({ name: 'Others', value: othersValue });
    }

    // Top projects by sell-through %
    const topProjectPool = hasOwnedProjects
      ? projects
      : [...new Set(confirmedPrimary.map((i) => i.projectId))]
          .map((pid) => projectByUuid.get(pid))
          .filter(Boolean);
    const topProjects = topProjectPool
      .map((p: any) => {
        const tot = Number(p.totalShares || 0);
        const sold = soldSharesByProject.get(p.uuid) || 0;
        const soldPercent = tot > 0 ? Math.min(100, Math.round((sold / tot) * 100)) : 0;
        return {
          uuid: p.uuid,
          name: p.name,
          soldShares: sold,
          totalShares: tot,
          soldPercent,
          value: projectValueOf(p),
        };
      })
      .sort((a, b) => b.soldPercent - a.soldPercent || b.value - a.value)
      .slice(0, 4);

    // Recent transactions
    const recentTransactions = allInvestments.slice(0, 8).map((inv) => {
      const investorUser = investorById.get(Number(inv.investorId));
      const shareholderName =
        inv.investorName?.trim() ||
        investorUser?.name ||
        inv.investorEmail ||
        investorUser?.email ||
        `Investor #${inv.investorId}`;
      const projectName = projectByUuid.get(inv.projectId)?.name || 'Share Project';
      const status =
        inv.status === ShareProjectInvestmentStatus.CONFIRMED
          ? 'paid'
          : inv.status === ShareProjectInvestmentStatus.PREPARED
            ? 'pending'
            : 'overdue';
      return {
        uuid: inv.uuid,
        code: inv.code || null,
        shareholderName,
        projectUuid: inv.projectId,
        projectName,
        quantity: Number(inv.quantity || 0),
        amount: Number(inv.totalAmount || inv.shareValue || 0),
        status,
        rawStatus: inv.status,
        createdAt: inv.createdAt,
      };
    });

    // Leaderboard based on confirmed investment activity across user's projects / investments
    const leaderMap = new Map<string, { name: string; pts: number; totalAmount: number; shares: number; count: number }>();
    for (const inv of confirmedPrimary) {
      const investorUser = investorById.get(Number(inv.investorId));
      const key =
        (inv.investorEmail || investorUser?.email || '').trim().toLowerCase() ||
        `user:${inv.investorId}`;
      const name =
        inv.investorName?.trim() ||
        investorUser?.name ||
        inv.investorEmail ||
        investorUser?.email ||
        `Investor #${inv.investorId}`;
      const amt = Number(inv.totalAmount || inv.shareValue || 0);
      const qty = Number(inv.quantity || 0);
      const pts = 100 + qty * 25 + Math.round(amt / 1000);
      const prev = leaderMap.get(key) || { name, pts: 0, totalAmount: 0, shares: 0, count: 0 };
      prev.pts += pts;
      prev.totalAmount += amt;
      prev.shares += qty;
      prev.count += 1;
      leaderMap.set(key, prev);
    }
    const leaderboard = Array.from(leaderMap.values())
      .sort((a, b) => b.pts - a.pts || b.totalAmount - a.totalAmount)
      .slice(0, 5);

    return {
      counts,
      totalProjects: effectiveTotalProjects,
      totalShareValue: effectiveShareValue,
      totalCollected,
      totalShares,
      soldShares,
      remainingShares,
      growth: {
        shareValueDeltaPct: pctDelta(currMonth.shareValue, prevMonth.shareValue),
        projectDeltaPct: pctDelta(currMonth.projectCount, prevMonth.projectCount),
        pendingDeltaPct: pctDelta(currMonth.pendingCount, prevMonth.pendingCount),
        rejectedDeltaPct: pctDelta(currMonth.rejectedCount, prevMonth.rejectedCount),
      },
      monthlySeries: months.map((m) => ({
        year: m.year,
        monthIndex: m.monthIndex,
        shareValue: m.shareValue,
        collected: m.collected,
        monthlyCollected: m.monthlyCollected,
        monthlyTarget: m.monthlyTarget,
        projectCount: m.projectCount,
        pendingCount: m.pendingCount,
        rejectedCount: m.rejectedCount,
      })),
      allocation,
      topProjects,
      recentTransactions,
      leaderboard,
      recentProjects: projects.slice(0, 5),
    };
  }

  async userNotifications(ownerId: number) {
    const { email } = await this.getShareUserIdentity(ownerId);
    const projects = await this.projectModel.findAll({
      where: this.ownerProjectWhere(ownerId, email),
      attributes: ['uuid', 'name', 'status', 'rejectionReason', 'updatedAt'],
      order: [['updatedAt', 'DESC']],
    });
    return projects.map((project) => ({
      uuid: project.uuid,
      projectName: project.name,
      type: project.status === ShareProjectStatus.REJECTED ? 'project_rejected' : 'project_update',
      title: project.status === ShareProjectStatus.REJECTED ? 'Project rejected' : `Project ${project.status}`,
      message: project.rejectionReason || `Your project is currently ${project.status}.`,
      read: false,
      createdAt: project.updatedAt,
    }));
  }

  async prepareInvestment(investorId: number, projectUuid: string, quantity: number) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new BadRequestException('Share quantity must be a positive integer');
    }
    const project = await this.projectModel.findOne({
      where: { uuid: projectUuid, status: ShareProjectStatus.PUBLISHED },
    });
    if (!project) throw new NotFoundException('Published Share Project not found');
    if (quantity > project.totalShares) {
      throw new BadRequestException('Requested quantity exceeds available project shares');
    }

    const { user, email } = await this.getShareUserIdentity(investorId);
    const sharePrice = Number(project.pricePerShare);
    const shareValue = sharePrice * quantity;
    const serviceFee = Math.round(shareValue * 0.01 * 100) / 100;
    const investment = await this.investmentModel.create({
      code: this.generateInvestmentCode(user?.name || 'INV', user?.phone || ''),
      investorName: user?.name || null,
      investorEmail: email || null,
      investorPhone: user?.phone || null,
      projectId: project.uuid,
      investorId,
      quantity,
      sharePrice: sharePrice.toFixed(2),
      shareValue: shareValue.toFixed(2),
      serviceFee: serviceFee.toFixed(2),
      totalAmount: (shareValue + serviceFee).toFixed(2),
      status: ShareProjectInvestmentStatus.CONFIRMED,
    } as any);
    return { data: investment, message: 'Investment confirmed successfully' };
  }

  async userPortfolio(investorId: number) {
    const { email } = await this.getShareUserIdentity(investorId);
    const where: any = email
      ? {
          [Op.or]: [
            { investorId },
            Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('investor_email')), email),
          ],
        }
      : { investorId };
    const investments = await this.investmentModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });
    const projectUuids = [...new Set(investments.map((row) => row.projectId))];
    const projects = projectUuids.length ? await this.projectModel.findAll({
      where: { uuid: { [Op.in]: projectUuids } },
      attributes: ['uuid', 'name', 'location', 'status', 'thumbnailUrl'],
    }) : [];
    const projectByUuid = new Map(projects.map((project) => [project.uuid, project]));
    const rows = investments.map((row) => {
      const project = projectByUuid.get(row.projectId);
      return {
        uuid: row.uuid,
        code: row.code,
        projectUuid: row.projectId,
        projectName: project?.name || '',
        location: project?.location || '',
        thumbnailUrl: project?.thumbnailUrl || '',
        quantity: row.quantity,
        sharePrice: row.sharePrice,
        shareValue: row.shareValue,
        serviceFee: row.serviceFee,
        totalAmount: row.totalAmount,
        status: row.status,
        createdAt: row.createdAt,
      };
    });
    return { investments: rows, shares: rows, payments: [], profits: [], reports: [] };
  }

  /**
   * Returns only the signed-in Share User's own project-owner and investor data.
   * This deliberately does not read from RealBiz organization, Accounts or CRM tables.
   */
  async userWorkspace(userId: number) {
    const [dashboard, ownerProjectResult, portfolio] = await Promise.all([
      this.userDashboard(userId),
      this.findMine(userId, 1, 100),
      this.userPortfolio(userId),
    ]);

    const investments = portfolio.investments || [];
    const totalInvestment = investments.reduce(
      (total, investment: any) => total + Number(investment.totalAmount || 0),
      0,
    );
    const totalShares = investments.reduce(
      (total, investment: any) => total + Number(investment.quantity || 0),
      0,
    );

    return {
      dashboard,
      ownerProjects: ownerProjectResult.data,
      investments,
      summary: {
        ownerProjectCount: ownerProjectResult.meta.total,
        investmentCount: investments.length,
        totalInvestment,
        totalShares,
      },
    };
  }

  async adminInvestments(page = 1, limit = 10, projectUuid?: string, trash = false) {
    const where: any = {};
    if (projectUuid) {
      where.projectId = projectUuid;
    }
    if (trash) {
      where.deletedAt = { [Op.ne]: null };
    }
    const { rows, count } = await this.investmentModel.findAndCountAll({
      where,
      paranoid: !trash,
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });
    const projectUuids = [...new Set(rows.map((row) => row.projectId))];
    const investorIds = [...new Set(rows.map((row) => row.investorId))];
    const projects = projectUuids.length ? await this.projectModel.findAll({
      where: { uuid: { [Op.in]: projectUuids } },
      attributes: ['uuid', 'name', 'location', 'status', 'thumbnailUrl'],
      paranoid: false,
    }) : [];
    const investors = investorIds.length ? await this.shareUserModel.findAll({
      where: { id: { [Op.in]: investorIds } },
      attributes: ['id', 'uuid', 'name', 'email', 'phone'],
      paranoid: false,
    }) : [];
    const projectByUuid = new Map(projects.map((project) => [project.uuid, project]));
    const investorById = new Map(investors.map((investor) => [investor.id, investor]));
    const data = rows.map((row) => {
      const user = investorById.get(row.investorId);
      const displayName = row.investorName || user?.name || null;
      const displayEmail = row.investorEmail || user?.email || null;
      const displayPhone = row.investorPhone || user?.phone || null;
      return {
        id: row.id,
        uuid: row.uuid,
        code: row.code,
        projectUuid: row.projectId,
        project: projectByUuid.get(row.projectId) || null,
        investor: user
          ? {
              id: user.id,
              uuid: user.uuid,
              name: displayName,
              email: displayEmail,
              phone: displayPhone,
            }
          : null,
        investorName: displayName,
        investorEmail: displayEmail,
        investorPhone: displayPhone,
        quantity: row.quantity,
        sharePrice: row.sharePrice,
        shareValue: row.shareValue,
        serviceFee: row.serviceFee,
        totalAmount: row.totalAmount,
        status: row.status,
        createdAt: row.createdAt,
        deletedAt: row.deletedAt,
      };
    });
    return { data, meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) } };
  }

  async findMineOne(ownerId: number, uuid: string) {
    const project = await this.ownProject(uuid, ownerId);
    return project.reload({ include: this.projectIncludes() });
  }

  async submit(ownerId: number, uuid: string, resubmit = false) {
    const project = await this.ownProject(uuid, ownerId);
    const allowed = resubmit ? project.status === ShareProjectStatus.REJECTED : [ShareProjectStatus.DRAFT, ShareProjectStatus.REJECTED].includes(project.status);
    if (!allowed) throw new BadRequestException(resubmit ? 'Only rejected projects can be resubmitted' : 'Project cannot be submitted in its current status');
    return this.sequelize.transaction(async (transaction) => {
      const fromStatus = project.status;
      await project.update({ status: ShareProjectStatus.PENDING, rejectionReason: null, submittedAt: new Date() }, { transaction });
      await this.submissionModel.create({ projectId: uuid, type: resubmit ? 'resubmission' : 'submission', submittedBy: ownerId }, { transaction });
      await this.historyModel.create({ projectId: uuid, fromStatus, toStatus: ShareProjectStatus.PENDING, changedBy: ownerId, note: resubmit ? 'Rejected project resubmitted' : 'Project submitted for approval' }, { transaction });
      return project.reload({ transaction });
    });
  }

  async submissionHistory(ownerId: number, uuid: string) {
    await this.ownProject(uuid, ownerId);
    const submissions = await this.submissionModel.findAll({ where: { projectId: uuid }, order: [['createdAt', 'DESC']] });
    const history = await this.historyModel.findAll({ where: { projectId: uuid }, order: [['createdAt', 'DESC']] });
    return { submissions, history };
  }

  async adminList(status?: ShareProjectStatus, page = 1, limit = 10, search?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (search) where[Op.or] = [{ name: { [Op.like]: `%${search}%` } }, { location: { [Op.like]: `%${search}%` } }];
    const { rows, count } = await this.projectModel.findAndCountAll({
      where, limit, offset: (page - 1) * limit, order: [['createdAt', 'DESC']], include: this.projectIncludes(),
    });
    return { data: rows, meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) } };
  }

  async adminDetails(uuid: string) {
    const project = await this.projectModel.findOne({ where: { uuid }, paranoid: false });
    if (!project) throw new NotFoundException('Share Project not found');
    const [owner, category, documents, images] = await Promise.all([
      project.ownerId ? this.shareUserModel.findByPk(project.ownerId) : Promise.resolve(null),
      project.categoryId ? this.categoryModel.findByPk(project.categoryId) : Promise.resolve(null),
      this.documentModel.findAll({ where: { projectId: project.uuid }, order: [['createdAt', 'ASC']] }),
      this.imageModel.findAll({ where: { projectId: project.uuid }, order: [['sortOrder', 'ASC']] }),
    ]);
    const item = project.toJSON() as any;
    item.owner = owner
      ? {
          id: owner.id,
          uuid: owner.uuid,
          name: owner.name,
          email: owner.email,
          phone: owner.phone,
          role: owner.role,
          status: owner.status,
        }
      : null;
    if (!item.owner && (project.creatorName || project.creatorEmail)) {
      item.owner = {
        name: project.creatorName,
        email: project.creatorEmail,
        phone: project.creatorPhone,
        companyName: project.companyName,
        role: 'project-owner',
        status: 'active',
      };
    }
    item.category = category ? { id: category.id, uuid: category.uuid, name: category.name, code: category.code } : null;
    item.documents = documents.map((doc) => doc.toJSON());
    item.images = images.map((img) => img.toJSON());
    return item;
  }

  async transition(uuid: string, reviewerId: number, nextStatus: ShareProjectStatus, reason?: string) {
    const project = await this.projectModel.findOne({ where: { uuid } });
    if (!project) throw new NotFoundException('Share Project not found');
    const updated = await this.sequelize.transaction(async (transaction) => {
      const fromStatus = project.status;
      if (nextStatus === ShareProjectStatus.REJECTED) {
        if (!reason?.trim()) throw new BadRequestException('Rejection reason is required');
        await this.reviewModel.create({ projectId: uuid, reviewedBy: reviewerId, decision: ShareProjectReviewDecision.REJECTED, reason: reason.trim() }, { transaction });
        await project.update({ status: ShareProjectStatus.REJECTED, rejectionReason: reason.trim() }, { transaction });
      } else if (nextStatus === ShareProjectStatus.APPROVED) {
        if (project.status !== ShareProjectStatus.PENDING) throw new BadRequestException('Only pending projects can be approved');
        await this.reviewModel.create({ projectId: uuid, reviewedBy: reviewerId, decision: ShareProjectReviewDecision.APPROVED }, { transaction });
        await project.update({ status: ShareProjectStatus.APPROVED }, { transaction });
      } else if (nextStatus === ShareProjectStatus.PUBLISHED) {
        if (project.status !== ShareProjectStatus.APPROVED && project.status !== ShareProjectStatus.UNPUBLISHED) throw new BadRequestException('Only approved or unpublished projects can be published');
        await project.update({ status: ShareProjectStatus.PUBLISHED, publishedAt: new Date() }, { transaction });
      } else if (nextStatus === ShareProjectStatus.UNPUBLISHED) {
        if (project.status !== ShareProjectStatus.PUBLISHED) throw new BadRequestException('Only published projects can be unpublished');
        await project.update({ status: ShareProjectStatus.UNPUBLISHED }, { transaction });
      }
      await this.historyModel.create({ projectId: uuid, fromStatus, toStatus: nextStatus, changedBy: reviewerId, note: reason || undefined }, { transaction });
      return project.reload({ transaction });
    });

    // Notify Project Creator / Owner via Email
    let recipientEmail = project.creatorEmail;
    let recipientName = project.creatorName;
    if (!recipientEmail && project.ownerId) {
      const owner = await this.shareUserModel.findByPk(project.ownerId);
      if (owner) {
        recipientEmail = owner.email;
        recipientName = recipientName || owner.name;
      }
    }

    if (recipientEmail) {
      try {
        const statusLabel = nextStatus === ShareProjectStatus.PUBLISHED ? 'Published' : nextStatus === ShareProjectStatus.APPROVED ? 'Approved' : nextStatus === ShareProjectStatus.REJECTED ? 'Rejected' : nextStatus;
        const statusColor = nextStatus === ShareProjectStatus.APPROVED || nextStatus === ShareProjectStatus.PUBLISHED ? '#059669' : nextStatus === ShareProjectStatus.REJECTED ? '#e11d48' : '#475569';

        await this.emailService.sendMail({
          to: recipientEmail,
          subject: `[RealBiz Pro] Project ${statusLabel}: ${project.name}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <div style="border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 20px;">
                <h2 style="color: #0f172a; margin: 0; font-size: 20px;">RealBiz Pro - Project Status Update</h2>
              </div>
              <p style="color: #334155; font-size: 15px;">Hello <strong>${recipientName || 'Project Creator'}</strong>,</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.6;">
                Your project <strong>${project.name}</strong> has been updated to:
              </p>
              <div style="background: #f8fafc; border-left: 4px solid ${statusColor}; padding: 16px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">Status: <strong style="color: ${statusColor}; font-size: 16px; text-transform: uppercase;">${statusLabel}</strong></p>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #64748b;">Project Code: <strong style="color: #0f172a;">${project.code || updated.uuid}</strong></p>
                ${reason ? `<p style="margin: 8px 0 0 0; font-size: 14px; color: #e11d48;"><strong>Decision Note / Reason:</strong> ${reason}</p>` : ''}
              </div>
              <p style="color: #64748b; font-size: 13px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
                Thank you for choosing RealBiz Pro. If you have any questions, please contact our support team.
              </p>
            </div>
          `,
        });
      } catch (mailError) {
        console.error('Failed to send project status email:', mailError);
      }
    }
    return updated;
  }

  async softDelete(uuid: string, deletedBy: number) {
    const project = await this.projectModel.findOne({ where: { uuid } });
    if (!project) throw new NotFoundException('Share Project not found');
    await project.destroy();
    await this.historyModel.create({ projectId: uuid, fromStatus: project.status, toStatus: project.status, changedBy: deletedBy, note: 'Project soft deleted' });
    return { message: 'Project soft deleted successfully' };
  }

  async restore(uuid: string) {
    const project = await this.projectModel.findOne({ where: { uuid }, paranoid: false });
    if (!project || !project.deletedAt) throw new NotFoundException('Deleted Share Project not found');
    await project.restore();
    return project.reload();
  }

  async adminTrash(page = 1, limit = 10) {
    const { rows, count } = await this.projectModel.findAndCountAll({
      where: {},
      paranoid: false,
      limit,
      offset: (page - 1) * limit,
      order: [['deletedAt', 'DESC']],
      include: this.projectIncludes(),
    });
    const trash = rows.filter((project) => !!project.deletedAt);
    return {
      data: trash,
      meta: { total: trash.length, page, limit, totalPages: Math.ceil(trash.length / limit) },
    };
  }

  async publicCreateProject(dto: PublicCreateShareProjectDto) {
    await this.ensureCategory(dto.categoryId);
    let owner = await this.shareUserModel.findOne({ where: { email: dto.creatorEmail } });
    if (!owner) {
      const password = dto.creatorPassword || (Math.random().toString(36).slice(-8) + 'Ab1!');
      owner = await this.shareUserModel.create({
        name: dto.creatorName,
        email: dto.creatorEmail,
        phone: dto.creatorPhone,
        passwordHash: await argon2.hash(password),
        role: ShareUserRole.OWNER,
        status: ShareUserStatus.PENDING,
        emailVerified: false,
      } as any);
    }
    const transaction = await this.sequelize.transaction();
    let project: ShareProject;
    try {
    project = await this.projectModel.create({
      ownerId: owner.id,
      categoryId: dto.categoryId,
      name: dto.name,
      description: dto.description,
      location: dto.location,
      totalInvestmentAmount: dto.totalInvestmentAmount.toString(),
      totalShares: dto.totalShares,
      pricePerShare: dto.pricePerShare.toString(),
      minimumInvestment: dto.minimumInvestment.toString(),
      expectedAnnualReturn: dto.expectedAnnualReturn?.toString(),
      startDate: dto.startDate,
      endDate: dto.endDate,
      thumbnailUrl: dto.thumbnailUrl || dto.images?.[0]?.url || null,
      status: ShareProjectStatus.PENDING,
      submittedAt: new Date(),
      code: this.generateCode('SP', dto.name),
      creatorName: dto.creatorName,
      creatorEmail: dto.creatorEmail,
      creatorPhone: dto.creatorPhone,
      companyName: dto.companyName,
    } as any, { transaction });
    await this.syncAssets(project.uuid, dto, transaction);
    await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    try {
      await this.emailService.sendMail({
        to: dto.creatorEmail,
        subject: `[RealBiz Pro] Project Submitted: ${project.name} (${(project as any).code})`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
            <div style="border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 20px;">
              <h2 style="color: #0f172a; margin: 0; font-size: 20px;">Project Submission Received</h2>
            </div>
            <p style="color: #334155; font-size: 15px;">Hello <strong>${dto.creatorName}</strong>,</p>
            <p style="color: #334155; font-size: 14px; line-height: 1.6;">
              Your project <strong>${project.name}</strong> has been successfully submitted and is currently pending review by Super Admin.
            </p>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #64748b;">Project Code: <strong style="color: #0f172a;">${(project as any).code}</strong></p>
              <p style="margin: 0 0 6px 0; font-size: 14px; color: #64748b;">Total Investment Target: <strong style="color: #059669;">৳${Number(dto.totalInvestmentAmount).toLocaleString()}</strong></p>
              <p style="margin: 0; font-size: 14px; color: #64748b;">Total Shares: <strong style="color: #0f172a;">${dto.totalShares}</strong></p>
            </div>
            <p style="color: #64748b; font-size: 13px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
              You will receive an email notification as soon as your project is reviewed and approved.
            </p>
          </div>
        `,
      });
    } catch (createMailErr) {
      console.error('Failed to send project submission email:', createMailErr);
    }
    return project;
  }

  async publicInvestmentRequest(dto: PublicInvestmentRequestDto) {
    if (!Number.isInteger(dto.quantity) || dto.quantity < 1) throw new BadRequestException('Share quantity must be a positive integer');
    const project = await this.projectModel.findOne({ where: { uuid: dto.projectUuid, status: ShareProjectStatus.PUBLISHED } });
    if (!project) throw new NotFoundException('Published Share Project not found');
    if (dto.quantity > project.totalShares) throw new BadRequestException('Requested quantity exceeds available project shares');
    let investor = await this.shareUserModel.findOne({ where: { [Op.or]: [{ email: dto.email }, ...(dto.phone ? [{ phone: dto.phone }] : [])] } });
    if (!investor) {
      const password = dto.password || (Math.random().toString(36).slice(-8) + 'Xy9#');
      investor = await this.shareUserModel.create({
        name: dto.name, email: dto.email, phone: dto.phone, passwordHash: await argon2.hash(password),
        role: ShareUserRole.OWNER, status: ShareUserStatus.PENDING, emailVerified: false,
      } as any);
    }
    const sharePrice = Number(project.pricePerShare);
    const shareValue = sharePrice * dto.quantity;
    const serviceFee = Math.round(shareValue * 0.01 * 100) / 100;
    const isOrg = dto.investorType === 'ORGANIZATION';
    const investorDisplayName = isOrg && dto.organizationName
      ? `${dto.organizationName} (${dto.organizationRepresentativeName || dto.name || 'Representative'}${dto.organizationDesignation ? `, ${dto.organizationDesignation}` : ''})`
      : dto.name;
    const investmentCode = this.generateInvestmentCode(
      isOrg ? (dto.organizationName || dto.name || 'OR') : (dto.name || 'IN'),
      dto.phone || dto.organizationPhone || '',
    );
    const investment = await this.investmentModel.create({
      projectId: project.uuid,
      investorId: investor.id,
      code: investmentCode,
      investorName: investorDisplayName,
      investorEmail: dto.email,
      investorPhone: dto.phone,
      quantity: dto.quantity,
      sharePrice: sharePrice.toFixed(2),
      shareValue: shareValue.toFixed(2),
      serviceFee: serviceFee.toFixed(2),
      totalAmount: (shareValue + serviceFee).toFixed(2),
      status: ShareProjectInvestmentStatus.PREPARED,
    } as any);

    // 1. Send confirmation email to investor
    try {
      const sharePriceNum = Number(sharePrice);
      const totalAmountNum = shareValue + serviceFee;

      await this.emailService.sendMail({
        to: dto.email,
        subject: `[RealBiz Pro] Investment Request Received - ${project.name} (${(investment as any).code})`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
            <div style="border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 20px;">
              <h2 style="color: #0f172a; margin: 0; font-size: 20px;">Investment Request Confirmation</h2>
            </div>
            <p style="color: #334155; font-size: 15px;">Dear <strong>${dto.name}</strong>,</p>
            <p style="color: #334155; font-size: 14px; line-height: 1.6;">
              Thank you for submitting your investment request for <strong>${project.name}</strong>. Your request has been received and is currently pending review by Super Admin.
            </p>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Investment Tracking Code:</td>
                  <td style="padding: 6px 0; font-weight: bold; color: #0f172a; text-align: right;">${(investment as any).code}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Project:</td>
                  <td style="padding: 6px 0; font-weight: bold; color: #0f172a; text-align: right;">${project.name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Quantity (Shares):</td>
                  <td style="padding: 6px 0; font-weight: bold; color: #0f172a; text-align: right;">${dto.quantity}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Price Per Share:</td>
                  <td style="padding: 6px 0; font-weight: bold; color: #0f172a; text-align: right;">৳${sharePriceNum.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Total Amount:</td>
                  <td style="padding: 6px 0; font-weight: bold; color: #059669; text-align: right; font-size: 16px;">৳${totalAmountNum.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Status:</td>
                  <td style="padding: 6px 0; font-weight: bold; color: #d97706; text-align: right;">Pending Admin Approval</td>
                </tr>
              </table>
            </div>
            <p style="color: #334155; font-size: 14px; line-height: 1.6;">
              You can track your investments anytime without login using your email (<strong>${dto.email}</strong>) or tracking code on our portal.
            </p>
            <p style="color: #64748b; font-size: 13px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
              Regards,<br><strong>RealBiz Pro Investment Portal</strong>
            </p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error('Failed to send investment request confirmation email to investor:', mailError);
    }

    // 2. Also notify project creator of new investment request
    try {
      let creatorEmail = project.creatorEmail;
      if (!creatorEmail && project.ownerId) {
        const owner = await this.shareUserModel.findByPk(project.ownerId);
        creatorEmail = owner?.email;
      }
      if (creatorEmail) {
        await this.emailService.sendMail({
          to: creatorEmail,
          subject: `[RealBiz Pro] New Investment Request for ${project.name}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <h3 style="color: #0f172a; margin-top: 0;">New Investment Received</h3>
              <p style="color: #334155; font-size: 14px;">An investor (<strong>${dto.name}</strong>, ${dto.email}) has requested <strong>${dto.quantity} shares</strong> (Total: ৳${(shareValue + serviceFee).toLocaleString()}) for your project <strong>${project.name}</strong>.</p>
              <p style="color: #64748b; font-size: 13px;">Investment Code: <strong>${(investment as any).code}</strong></p>
            </div>
          `,
        });
      }
    } catch (creatorMailErr) {
      console.error('Failed to notify project creator of investment:', creatorMailErr);
    }

    return investment;
  }

  async reviewInvestment(uuid: string, reviewerId: number, approved: boolean, reason?: string) {
    const investment = await this.investmentModel.findOne({ where: { uuid } });
    if (!investment) throw new NotFoundException('Investment request not found');
    if (investment.status !== ShareProjectInvestmentStatus.PREPARED) {
      throw new BadRequestException('Only prepared investment requests can be reviewed');
    }
    if (!approved && !reason?.trim()) {
      throw new BadRequestException('Rejection reason is required');
    }

    await investment.update({
      status: approved ? ShareProjectInvestmentStatus.CONFIRMED : ShareProjectInvestmentStatus.CANCELLED,
    });

    const project = await this.projectModel.findOne({ where: { uuid: investment.projectId } });
    const projectName = project?.name || 'Share Project';

    let recipientEmail = investment.investorEmail;
    if (!recipientEmail && investment.investorId) {
      const investor = await this.shareUserModel.findByPk(investment.investorId);
      recipientEmail = investor?.email;
    }

    // Send review email to investor
    if (recipientEmail) {
      try {
        const statusTitle = approved ? 'Investment Approved & Confirmed' : 'Investment Request Rejected';
        const statusColor = approved ? '#059669' : '#e11d48';

        await this.emailService.sendMail({
          to: recipientEmail,
          subject: `[RealBiz Pro] ${statusTitle} - ${projectName} (${investment.code || ''})`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <div style="border-bottom: 2px solid ${statusColor}; padding-bottom: 16px; margin-bottom: 20px;">
                <h2 style="color: #0f172a; margin: 0; font-size: 20px;">${statusTitle}</h2>
              </div>
              <p style="color: #334155; font-size: 15px;">Dear <strong>${investment.investorName || 'Investor'}</strong>,</p>
              <p style="color: #334155; font-size: 14px; line-height: 1.6;">
                Your investment request for <strong>${projectName}</strong> has been officially <strong>${approved ? 'APPROVED & CONFIRMED' : 'REJECTED'}</strong> by Super Admin.
              </p>
              <div style="background: #f8fafc; border-left: 4px solid ${statusColor}; padding: 18px; border-radius: 8px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr>
                    <td style="padding: 6px 0; color: #64748b;">Investment Code:</td>
                    <td style="padding: 6px 0; font-weight: bold; color: #0f172a; text-align: right;">${investment.code || ''}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b;">Project:</td>
                    <td style="padding: 6px 0; font-weight: bold; color: #0f172a; text-align: right;">${projectName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b;">Shares Quantity:</td>
                    <td style="padding: 6px 0; font-weight: bold; color: #0f172a; text-align: right;">${investment.quantity}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b;">Total Amount:</td>
                    <td style="padding: 6px 0; font-weight: bold; color: #059669; text-align: right; font-size: 16px;">৳${Number(investment.totalAmount).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b;">Status:</td>
                    <td style="padding: 6px 0; font-weight: bold; color: ${statusColor}; text-align: right; text-transform: uppercase;">${approved ? 'Confirmed' : 'Cancelled'}</td>
                  </tr>
                  ${!approved && reason ? `
                  <tr>
                    <td style="padding: 8px 0 0 0; color: #e11d48;" colspan="2"><strong>Decision Note / Reason:</strong> ${reason}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              <p style="color: #64748b; font-size: 13px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px;">
                Thank you for investing with RealBiz Pro. You can view your portfolio anytime on our portal.
              </p>
            </div>
          `,
        });
      } catch (mailError) {
        console.error('Failed to send investment review email to investor:', mailError);
      }
    }

    // Also notify project creator when investment is approved
    if (approved && project) {
      try {
        let creatorEmail = project.creatorEmail;
        if (!creatorEmail && project.ownerId) {
          const owner = await this.shareUserModel.findByPk(project.ownerId);
          creatorEmail = owner?.email;
        }
        if (creatorEmail) {
          await this.emailService.sendMail({
            to: creatorEmail,
            subject: `[RealBiz Pro] Investment Confirmed for ${projectName}`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
                <h3 style="color: #059669; margin-top: 0;">Investment Confirmed!</h3>
                <p style="color: #334155; font-size: 14px;">An investment of <strong>${investment.quantity} shares</strong> (Total: ৳${Number(investment.totalAmount).toLocaleString()}) for your project <strong>${projectName}</strong> has been approved by Super Admin.</p>
                <p style="color: #64748b; font-size: 13px;">Investment Code: <strong>${investment.code || ''}</strong></p>
              </div>
            `,
          });
        }
      } catch (creatorMailErr) {
        console.error('Failed to notify project creator of approved investment:', creatorMailErr);
      }
    }

    return investment;
  }

  async publicList(page = 1, limit = 10) {
    const { rows, count } = await this.projectModel.findAndCountAll({ where: { status: ShareProjectStatus.PUBLISHED }, limit, offset: (page - 1) * limit, order: [['publishedAt', 'DESC']], include: this.projectIncludes() });
    const categoryIds = [...new Set(rows.map((row) => row.categoryId))];
    const categories = await this.categoryModel.findAll({ where: { id: categoryIds } });
    const categoryById = new Map(categories.map((category) => [category.id, { id: category.id, uuid: category.uuid, name: category.name, code: category.code }]));
    const data = rows.map((row) => {
      const item = row.toJSON() as any;
      item.category = categoryById.get(row.categoryId) || null;
      return item;
    });
    return { data, meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) } };
  }

  async publicOne(uuid: string) {
    const project = await this.projectModel.findOne({ where: { uuid, status: ShareProjectStatus.PUBLISHED }, include: this.projectIncludes() });
    if (!project) throw new NotFoundException('Published Share Project not found');
    const [category, documents, images] = await Promise.all([
      this.categoryModel.findByPk(project.categoryId),
      this.documentModel.findAll({ where: { projectId: project.uuid }, order: [['createdAt', 'ASC']] }),
      this.imageModel.findAll({ where: { projectId: project.uuid }, order: [['sortOrder', 'ASC']] }),
    ]);
    const item = project.toJSON() as any;
    item.category = category ? { id: category.id, uuid: category.uuid, name: category.name, code: category.code } : null;
    item.documents = documents.map((doc) => doc.toJSON());
    item.images = images.map((img) => img.toJSON());
    return item;
  }

  async publicPortfolio(query?: { email?: string; phone?: string; code?: string }) {
    const where: any = {};
    const orConditions: any[] = [];
    const searchVal = (query?.email || query?.phone || query?.code || '').trim();

    if (searchVal) {
      orConditions.push({ code: searchVal });
      orConditions.push({ investorEmail: searchVal });
      orConditions.push({ investorPhone: searchVal });

      const matchedUsers = await this.shareUserModel.findAll({
        where: {
          [Op.or]: [
            { email: searchVal },
            { phone: searchVal },
          ],
        },
        attributes: ['id'],
      });
      if (matchedUsers.length > 0) {
        orConditions.push({ investorId: { [Op.in]: matchedUsers.map((u) => u.id) } });
      }
    }

    if (orConditions.length > 0) {
      where[Op.or] = orConditions;
    }

    const investments = await this.investmentModel.findAll({
      where,
      limit: 100,
      order: [['createdAt', 'DESC']],
    });

    const projectUuids = [...new Set(investments.map((row) => row.projectId))];
    const projects = projectUuids.length ? await this.projectModel.findAll({
      where: { uuid: { [Op.in]: projectUuids } },
      attributes: ['uuid', 'name', 'location', 'status', 'thumbnailUrl', 'pricePerShare'],
    }) : [];
    const projectByUuid = new Map(projects.map((project) => [project.uuid, project]));

    const rows = investments.map((row) => {
      const project = projectByUuid.get(row.projectId);
      return {
        uuid: row.uuid,
        code: row.code,
        projectUuid: row.projectId,
        projectName: project?.name || '',
        location: project?.location || '',
        thumbnailUrl: project?.thumbnailUrl || '',
        investorName: row.investorName || '',
        quantity: row.quantity,
        sharePrice: row.sharePrice,
        shareValue: row.shareValue,
        serviceFee: row.serviceFee,
        totalAmount: row.totalAmount,
        status: row.status,
        createdAt: row.createdAt,
      };
    });

    return {
      investments: rows,
      shares: rows.filter((r) => r.status === ShareProjectInvestmentStatus.CONFIRMED || r.status === ShareProjectInvestmentStatus.PREPARED),
      payments: [],
      profits: [],
      reports: [],
    };
  }

  async categoryList(activeOnly = false) {
    const where: any = activeOnly ? { isActive: true } : {};
    return this.categoryModel.findAll({ where, order: [['name', 'ASC']] });
  }
  async createCategory(dto: CreateShareProjectCategoryDto) { return this.categoryModel.create(dto as any); }
  async updateCategory(uuid: string, dto: UpdateShareProjectCategoryDto) {
    const category = await this.categoryModel.findOne({ where: { uuid } });
    if (!category) throw new NotFoundException('Share Project category not found');
    await category.update(dto);
    return category;
  }
  async deleteCategory(uuid: string) {
    const category = await this.categoryModel.findOne({ where: { uuid } });
    if (!category) throw new NotFoundException('Share Project category not found');
    await category.destroy();
    return { message: 'Category deleted successfully' };
  }

  async softDeleteInvestment(uuid: string) {
    const investment = await this.investmentModel.findOne({ where: { uuid } });
    if (!investment) throw new NotFoundException('Investment not found');
    await investment.destroy();
    return { message: 'Investment soft-deleted successfully' };
  }

  async restoreInvestment(uuid: string) {
    const investment = await this.investmentModel.findOne({ where: { uuid }, paranoid: false });
    if (!investment) throw new NotFoundException('Investment not found');
    await investment.restore();
    return { message: 'Investment restored successfully' };
  }

  publicLocations(search?: string) {
    if (!search?.trim()) {
      return {
        totalDivisions: BANGLADESH_DIVISIONS.length,
        totalDistricts: ALL_BANGLADESH_DISTRICTS.length,
        divisions: BANGLADESH_DIVISIONS,
        districts: ALL_BANGLADESH_DISTRICTS,
      };
    }
    const term = search.trim().toLowerCase();
    const filteredDistricts = ALL_BANGLADESH_DISTRICTS.filter(
      (d) =>
        d.name.toLowerCase().includes(term) ||
        d.bnName.toLowerCase().includes(term) ||
        d.divisionName.toLowerCase().includes(term),
    );
    return {
      totalDivisions: BANGLADESH_DIVISIONS.length,
      totalDistricts: filteredDistricts.length,
      divisions: BANGLADESH_DIVISIONS,
      districts: filteredDistricts,
    };
  }
}
