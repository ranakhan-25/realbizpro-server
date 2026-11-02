import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ShareUser, ShareUserRole } from '../../database/models/share-user/share-user.model';
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
} from './dto/share-project.dto';

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
  ) {}

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
    return this.sequelize.transaction(async (transaction) => {
      const project = await this.projectModel.create({
        ownerId,
        categoryId: dto.categoryId,
        name: dto.name,
        description: dto.description,
        location: dto.location,
        thumbnailUrl: dto.thumbnailUrl,
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
      return project.reload({ transaction });
    });
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
        thumbnailUrl: dto.thumbnailUrl,
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

  async adminInvestments(page = 1, limit = 10) {
    const { rows, count } = await this.investmentModel.findAndCountAll({
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
      uuid: row.uuid,
      project: projectByUuid.get(row.projectId) || null,
      investor: investorById.get(row.investorId) || null,
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
    const project = await this.projectModel.findOne({ where: { uuid }, include: this.projectIncludes(), paranoid: false });
    if (!project) throw new NotFoundException('Share Project not found');
    return project;
  }

  async transition(uuid: string, reviewerId: number, nextStatus: ShareProjectStatus, reason?: string) {
    const project = await this.projectModel.findOne({ where: { uuid } });
    if (!project) throw new NotFoundException('Share Project not found');
    return this.sequelize.transaction(async (transaction) => {
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
