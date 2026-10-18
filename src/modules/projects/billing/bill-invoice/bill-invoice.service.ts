/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { CreateBillInvoiceDto } from './dto/create-bill-invoice.dto';
import { UpdateBillInvoiceDto } from './dto/update-bill-invoice.dto';
import { QueryBillInvoiceDto } from './dto/query-bill-invoice.dto';

import { Invoice } from 'src/database/models/projects/billing/pr_invoice.model';
import { InvoiceItem } from 'src/database/models/projects/billing/pr_invoice_item.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectType } from 'src/database/models/projects/project-type/pr_project_type.model';
import { CustomerAccount } from 'src/database/models/projects/contract/pr_customer_accounts.model';

@Injectable()
export class BillInvoiceService {
  constructor(
    @InjectModel(Invoice)
    private readonly invoiceModel: typeof Invoice,
    @InjectModel(InvoiceItem)
    private readonly invoiceItemModel: typeof InvoiceItem,
    @InjectModel(CustomerAccount)
    private readonly customerModel: typeof CustomerAccount,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(ProjectType)
    private readonly projectTypeModel: typeof ProjectType,
  ) {}

  async create(dto: CreateBillInvoiceDto) {
    // 1. Verify relations
    if (dto.customerId) {
      const customer =
        await this.customerModel.findByPk(
          dto.customerId,
        );
      if (!customer)
        throw new BadRequestException(
          'Customer not found',
        );
    }
    if (dto.projectId) {
      const project =
        await this.projectModel.findByPk(
          dto.projectId,
        );
      if (!project)
        throw new BadRequestException(
          'Project not found',
        );
    }
    if (dto.projectTypeId) {
      const type =
        await this.projectTypeModel.findByPk(
          dto.projectTypeId,
        );
      if (!type)
        throw new BadRequestException(
          'Project Type not found',
        );
    }

    // 2. Create Invoice
    const { items, ...invoiceData } = dto;
    const invoice =
      await this.invoiceModel.create(invoiceData);

    // 3. Bulk create items
    if (items && items.length > 0) {
      await this.invoiceItemModel.bulkCreate(
        items.map((i) => ({
          ...i,
          invoiceId: invoice.uuid,
        })),
      );
    }

    return this.findOne(invoice.uuid);
  }

  async findAll(query: QueryBillInvoiceDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip =
      query.skip !== undefined
        ? Number(query.skip)
        : (page - 1) * limit;

    const where: any = {};
    if (query.customerId)
      where.customerId = query.customerId;
    if (query.projectId)
      where.projectId = query.projectId;
    if (query.projectTypeId)
      where.projectTypeId = query.projectTypeId;
    if (query.paymentMethod)
      where.paymentMethod = query.paymentMethod;

    if (query.search) {
      where[Op.or] = [
        {
          code: {
            [Op.iLike]: `%${query.search}%`,
          },
        },
        {
          contentBody: {
            [Op.iLike]: `%${query.search}%`,
          },
        },
      ];
    }

    const { rows, count } =
      await this.invoiceModel.findAndCountAll({
        where,
        limit,
        offset: skip,
        order: [['createdAt', 'DESC']],
        paranoid: query.withDeleted
          ? false
          : true,
        distinct: true,
      });

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        skip,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findOne(uuid: string) {
    const invoice =
      await this.invoiceModel.findOne({
        where: { uuid },
      });
    if (!invoice)
      throw new NotFoundException(
        `Invoice "${uuid}" not found`,
      );
    const items = await this.invoiceItemModel.findAll({
      where: { invoiceId: uuid },
    });
    return { ...invoice.get({ plain: true }), items };
  }

  async update(
    uuid: string,
    dto: UpdateBillInvoiceDto,
  ) {
    const invoice = await this.invoiceModel.findOne({
      where: { uuid },
    });
    if (!invoice)
      throw new NotFoundException(
        `Invoice "${uuid}" not found`,
      );
    const { items, ...invoiceData } = dto;

    await invoice.update(invoiceData);

    // Items replace (delete old + create new)
    if (items !== undefined) {
      await this.invoiceItemModel.destroy({
        where: { invoiceId: uuid },
      });
      if (items.length > 0) {
        await this.invoiceItemModel.bulkCreate(
          items.map((i) => ({
            ...i,
            invoiceId: uuid,
          })),
        );
      }
    }

    return this.findOne(uuid);
  }

  async remove(uuid: string) {
    const invoice = await this.invoiceModel.findOne({
      where: { uuid },
    });
    if (!invoice)
      throw new NotFoundException(
        `Invoice "${uuid}" not found`,
      );
    await invoice.destroy();
    return {
      message: `Invoice "${uuid}" deleted successfully`,
    };
  }

  async restore(uuid: string) {
    const invoice =
      await this.invoiceModel.findOne({
        where: { uuid },
        paranoid: false,
      });
    if (!invoice)
      throw new NotFoundException(
        `Invoice "${uuid}" not found`,
      );
    if (!invoice.deletedAt)
      throw new BadRequestException(
        'Invoice is not deleted',
      );
    await invoice.restore();
    return invoice;
  }
}
