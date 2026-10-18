import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { WorkOrder } from 'src/database/models/projects/billing/work-order/pr_work_order.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { Site } from 'src/database/models/projects/project-site/pr_project_site.model';
import { ProjectType } from 'src/database/models/projects/project-type/pr_project_type.model';
import { CustomerAccount } from 'src/database/models/projects/contract/pr_customer_accounts.model';

@Injectable()
export class WorkOrderService {
  constructor(@InjectModel(WorkOrder) private readonly model: typeof WorkOrder) {}
  private readonly includes = [
    { model: Project, as: 'project', attributes: ['uuid', 'code', 'name'] },
    { model: Site, as: 'site', attributes: ['uuid', 'name'] },
    { model: ProjectType, as: 'projectType', attributes: ['uuid', 'name'] },
    { model: CustomerAccount, as: 'customer', attributes: ['uuid', 'customerName'] },
  ];

  async create(body: any) {
    const details = body.details ?? {};
    if (!body.projectId || !body.code || !(details.date ?? body.recordDate)) throw new BadRequestException('Project, code, and date are required');
    const order = await this.model.create({
      projectId: body.projectId,
      date: details.date ?? body.recordDate,
      code: body.code,
      customerId: details.customerId,
      clientOrderNo: details.clientOrderNo,
      projectTypeId: details.projectTypeId,
      siteId: details.siteId,
      attachment: details.attachment,
      poNo: details.poNo,
      categoryId: details.categoryId,
      subCategoryId: details.subCategoryId,
      items: details.items ?? [],
      subtotal: details.subtotal ?? 0,
      vatPercent: details.vatPercent ?? 0,
      vatInclude: details.vatInclude ?? false,
      vatAmount: details.vatAmount ?? 0,
      aitPercent: details.aitPercent ?? 0,
      aitInclude: details.aitInclude ?? false,
      aitAmount: details.aitAmount ?? 0,
      grandTotal: details.grandTotal ?? body.amount ?? 0,
    });
    return this.findOne(order.uuid);
  }
  async findAll(query: any) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const where: any = {};
    if (query.projectId) where.projectId = query.projectId;
    if (query.search) where[Op.or] = [
      { code: { [Op.iLike]: `%${query.search}%` } },
      { clientOrderNo: { [Op.iLike]: `%${query.search}%` } },
    ];
    const { rows, count } = await this.model.findAndCountAll({ where, include: this.includes, limit, offset: (page - 1) * limit, order: [['createdAt', 'DESC']] });
    return { data: rows, meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) } };
  }
  async findOne(uuid: string) {
    const row = await this.model.findByPk(uuid, { include: this.includes });
    if (!row) throw new NotFoundException(`Work order ${uuid} not found`);
    return row;
  }
  async update(uuid: string, body: any) {
    const row = await this.model.findByPk(uuid);
    if (!row) throw new NotFoundException(`Work order ${uuid} not found`);
    await row.update(body);
    return this.findOne(uuid);
  }
  async remove(uuid: string) {
    const row = await this.model.findByPk(uuid);
    if (!row) throw new NotFoundException(`Work order ${uuid} not found`);
    await row.destroy();
    return { message: 'Work order deleted successfully' };
  }
}
