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

  private async ensureCategory(categoryId: number) {
    const category = await this.categoryModel.findByPk(categoryId);
    if (!category) throw new BadRequestException('Project category does not exist');
  }

  private async ownProject(uuid: string, ownerId: number) {
    const project = await this.projectModel.findOne({ where: { uuid } });
    if (!project) throw new NotFoundException('Share Project not found');
    if (project.ownerId !== ownerId) throw new ForbiddenException('You can only manage your own projects');
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
    const transaction = await this.sequelize.transaction();
    let project: ShareProject;
    try {
      project = await this.projectModel.create({
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
    const where: any = { ownerId };
    if (status) where.status = status;
    const { rows, count } = await this.projectModel.findAndCountAll({
      where, limit, offset: (page - 1) * limit, order: [['createdAt', 'DESC']], include: this.projectIncludes(),
    });
    return { data: rows, meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) } };
  }

  async userDashboard(ownerId: number) {
    const projects = await this.projectModel.findAll({
      where: { ownerId },
      attributes: ['uuid', 'name', 'status', 'totalInvestmentAmount', 'totalShares', 'pricePerShare', 'updatedAt'],
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
    let totalShareValue = 0;
    for (const project of projects) {
      counts[project.status] = (counts[project.status] || 0) + 1;
      totalShareValue += Number(project.totalShares || 0) * Number(project.pricePerShare || 0);
    }
    return {
      counts,
      totalProjects: projects.length,
      totalShareValue,
      recentProjects: projects.slice(0, 5),
    };
  }

  async userNotifications(ownerId: number) {
    const projects = await this.projectModel.findAll({
      where: { ownerId },
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

    const sharePrice = Number(project.pricePerShare);
    const shareValue = sharePrice * quantity;
    const serviceFee = Math.round(shareValue * 0.01 * 100) / 100;
    const investment = await this.investmentModel.create({
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
    const investments = await this.investmentModel.findAll({
      where: { investorId },
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

  async adminInvestments(page = 1, limit = 10, projectUuid?: string) {
    const where: any = {};
    if (projectUuid) {
      where.projectId = projectUuid;
    }
    const { rows, count } = await this.investmentModel.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });
    const projectUuids = [...new Set(rows.map((row) => row.projectId))];
    const investorIds = [...new Set(rows.map((row) => row.investorId))];
    const projects = projectUuids.length ? await this.projectModel.findAll({
      where: { uuid: { [Op.in]: projectUuids } },
      attributes: ['uuid', 'name', 'location', 'status', 'thumbnailUrl'],
    }) : [];
    const investors = investorIds.length ? await this.shareUserModel.findAll({
      where: { id: { [Op.in]: investorIds } },
      attributes: ['id', 'uuid', 'name', 'email', 'phone'],
    }) : [];
    const projectByUuid = new Map(projects.map((project) => [project.uuid, project]));
    const investorById = new Map(investors.map((investor) => [investor.id, investor]));
    const data = rows.map((row) => ({
      id: row.id,
      uuid: row.uuid,
      code: row.code,
      projectUuid: row.projectId,
      project: projectByUuid.get(row.projectId) || null,
      investor: investorById.get(row.investorId) || null,
      investorName: row.investorName || investorById.get(row.investorId)?.name || null,
      investorEmail: row.investorEmail || investorById.get(row.investorId)?.email || null,
      investorPhone: row.investorPhone || investorById.get(row.investorId)?.phone || null,
      quantity: row.quantity,
      sharePrice: row.sharePrice,
      shareValue: row.shareValue,
      serviceFee: row.serviceFee,
      totalAmount: row.totalAmount,
      status: row.status,
      createdAt: row.createdAt,
    }));
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
    const owner = project.ownerId ? await this.shareUserModel.findByPk(project.ownerId) : null;
    const category = project.categoryId ? await this.categoryModel.findByPk(project.categoryId) : null;
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
    if (project.creatorEmail) {
      const statusLabel = nextStatus === ShareProjectStatus.PUBLISHED ? 'published' : nextStatus === ShareProjectStatus.APPROVED ? 'approved' : nextStatus === ShareProjectStatus.REJECTED ? 'rejected' : nextStatus;
      await this.emailService.sendMail({
        to: project.creatorEmail,
        subject: `Project ${statusLabel} - ${project.name}`,
        html: `<p>Your project <strong>${project.name}</strong> (${project.code || updated.uuid}) has been <strong>${statusLabel}</strong>.</p>${reason ? `<p>Reason: ${reason}</p>` : ''}`,
      } as any);
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
      owner = await this.shareUserModel.create({
        name: dto.creatorName,
        email: dto.creatorEmail,
        phone: dto.creatorPhone,
        passwordHash: await argon2.hash(dto.creatorPassword),
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
    await this.emailService.sendMail({
      to: dto.creatorEmail,
      subject: `Project submitted - ${project.name} (${(project as any).code})`,
      html: `<p>Your project <strong>${project.name}</strong> has been submitted and is pending Super Admin review.</p><p>Project code: <strong>${(project as any).code}</strong></p>`,
    } as any);
    return project;
  }

  async publicInvestmentRequest(dto: PublicInvestmentRequestDto) {
    if (!Number.isInteger(dto.quantity) || dto.quantity < 1) throw new BadRequestException('Share quantity must be a positive integer');
    const project = await this.projectModel.findOne({ where: { uuid: dto.projectUuid, status: ShareProjectStatus.PUBLISHED } });
    if (!project) throw new NotFoundException('Published Share Project not found');
    if (dto.quantity > project.totalShares) throw new BadRequestException('Requested quantity exceeds available project shares');
    let investor = await this.shareUserModel.findOne({ where: { [Op.or]: [{ email: dto.email }, ...(dto.phone ? [{ phone: dto.phone }] : [])] } });
    if (!investor) {
      investor = await this.shareUserModel.create({
        name: dto.name, email: dto.email, phone: dto.phone, passwordHash: await argon2.hash(dto.password),
        role: ShareUserRole.OWNER, status: ShareUserStatus.PENDING, emailVerified: false,
      } as any);
    }
    const sharePrice = Number(project.pricePerShare);
    const shareValue = sharePrice * dto.quantity;
    const serviceFee = Math.round(shareValue * 0.01 * 100) / 100;
    const investment = await this.investmentModel.create({
      projectId: project.uuid,
      investorId: investor.id,
      code: this.generateCode('IN', project.name),
      investorName: dto.name,
      investorEmail: dto.email,
      investorPhone: dto.phone,
      quantity: dto.quantity,
      sharePrice: sharePrice.toFixed(2),
      shareValue: shareValue.toFixed(2),
      serviceFee: serviceFee.toFixed(2),
      totalAmount: (shareValue + serviceFee).toFixed(2),
      status: ShareProjectInvestmentStatus.PREPARED,
    } as any);
    await this.emailService.sendMail({
      to: dto.email,
      subject: `Investment request pending - ${project.name} (${(investment as any).code})`,
      html: `<p>Your investment request for <strong>${project.name}</strong> is pending Super Admin approval.</p><p>Investment code: <strong>${(investment as any).code}</strong></p><p>Quantity: ${dto.quantity}<br>Total: ${(investment as any).totalAmount}</p>`,
    } as any);
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

    if (recipientEmail) {
      try {
        await this.emailService.sendMail({
          to: recipientEmail,
          subject: `Investment ${approved ? 'approved' : 'rejected'} - ${projectName}`,
          html: `<p>Your investment request <strong>${investment.code || ''}</strong> for <strong>${projectName}</strong> has been ${approved ? 'approved' : 'rejected'}.</p>${!approved && reason ? `<p>Reason: ${reason}</p>` : ''}`,
        } as any);
      } catch (mailError) {
        console.error('Failed to send investment review email:', mailError);
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
    const category = await this.categoryModel.findByPk(project.categoryId);
    const item = project.toJSON() as any;
    item.category = category ? { id: category.id, uuid: category.uuid, name: category.name, code: category.code } : null;
    return item;
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
}
