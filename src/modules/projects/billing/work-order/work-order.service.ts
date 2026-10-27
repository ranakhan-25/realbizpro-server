import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindAndCountOptions, Op, WhereOptions } from 'sequelize';

import { WorkOrder } from 'src/database/models/projects/billing/work-order/pr_work_order.model';
import { WorkOrderAttributes } from 'src/database/types/workorder.types';

type AnyPayload = Record<string, any>;

@Injectable()
export class WorkOrderService {
  constructor(
    @InjectModel(WorkOrder)
    private readonly model: typeof WorkOrder,
  ) {}

  private readonly includes = [
    {
      association: 'project',
      attributes: ['uuid', 'code', 'name'],
    },
    {
      association: 'site',
      attributes: ['uuid', 'name'],
    },
    {
      association: 'projectType',
      attributes: ['uuid', 'name'],
    },
    {
      association: 'customer',
      attributes: ['uuid', 'customerName'],
    },
  ];

  private hasOwn(
    obj: AnyPayload,
    key: string,
  ): boolean {
    return Object.prototype.hasOwnProperty.call(
      obj,
      key,
    );
  }

  /**
   * Validate PostgreSQL DATEONLY input.
   * Expected format: YYYY-MM-DD
   */
  private validateDate(value: unknown): string {
    if (
      typeof value !== 'string' ||
      !value.trim()
    ) {
      throw new BadRequestException(
        'Work order date is required in YYYY-MM-DD format',
      );
    }

    const date = value.trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException(
        'Invalid work order date. Use YYYY-MM-DD format',
      );
    }

    const parsed = new Date(
      `${date}T00:00:00.000Z`,
    );

    if (
      Number.isNaN(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== date
    ) {
      throw new BadRequestException(
        'Invalid calendar date',
      );
    }

    return date;
  }

  private getDetails(
    body: AnyPayload,
  ): AnyPayload {
    if (body.details == null) {
      return {};
    }

    if (
      typeof body.details !== 'object' ||
      Array.isArray(body.details)
    ) {
      throw new BadRequestException(
        'details must be an object',
      );
    }

    return body.details;
  }

  private readField(
    body: AnyPayload,
    details: AnyPayload,
    field: string,
  ): unknown {
    if (this.hasOwn(details, field)) {
      return details[field];
    }

    if (this.hasOwn(body, field)) {
      return body[field];
    }

    return undefined;
  }

  private resolveDate(
    body: AnyPayload,
    details: AnyPayload,
  ): unknown {
    if (this.hasOwn(details, 'date')) {
      return details.date;
    }

    if (this.hasOwn(body, 'date')) {
      return body.date;
    }

    if (this.hasOwn(body, 'recordDate')) {
      return body.recordDate;
    }

    return undefined;
  }

  private mapFields(
    body: AnyPayload,
    details: AnyPayload,
    partial = false,
  ): AnyPayload {
    const fields = [
      'projectId',
      'code',
      'customerId',
      'clientOrderNo',
      'projectTypeId',
      'siteId',
      'attachment',
      'poNo',
      'categoryId',
      'subCategoryId',
      'items',
      'subtotal',
      'vatPercent',
      'vatInclude',
      'vatAmount',
      'aitPercent',
      'aitInclude',
      'aitAmount',
    ];

    const payload: AnyPayload = {};

    for (const field of fields) {
      const exists =
        this.hasOwn(details, field) ||
        this.hasOwn(body, field);

      if (!partial || exists) {
        const value = this.readField(
          body,
          details,
          field,
        );

        if (value !== undefined || !partial) {
          payload[field] = value;
        }
      }
    }

    const hasGrandTotal =
      this.hasOwn(details, 'grandTotal') ||
      this.hasOwn(body, 'grandTotal');

    const hasAmount =
      this.hasOwn(details, 'amount') ||
      this.hasOwn(body, 'amount');

    if (!partial || hasGrandTotal || hasAmount) {
      const grandTotal = this.readField(
        body,
        details,
        'grandTotal',
      );

      const amount = this.readField(
        body,
        details,
        'amount',
      );

      payload.grandTotal =
        grandTotal !== undefined
          ? grandTotal
          : amount;
    }

    const hasDate =
      this.hasOwn(details, 'date') ||
      this.hasOwn(body, 'date') ||
      this.hasOwn(body, 'recordDate');

    if (!partial || hasDate) {
      payload.date = this.resolveDate(
        body,
        details,
      );
    }

    return payload;
  }

  async create(body: AnyPayload) {
    if (
      !body ||
      typeof body !== 'object' ||
      Array.isArray(body)
    ) {
      throw new BadRequestException(
        'Request body must be an object',
      );
    }

    const details = this.getDetails(body);
    const payload = this.mapFields(body, details);

    if (
      typeof payload.projectId !== 'string' ||
      !payload.projectId.trim()
    ) {
      throw new BadRequestException(
        'Project is required',
      );
    }

    if (
      typeof payload.code !== 'string' ||
      !payload.code.trim()
    ) {
      throw new BadRequestException(
        'Work order code is required',
      );
    }

    payload.date = this.validateDate(
      payload.date,
    );

    const order =
      await this.model.create(payload);

    return this.findOne(order.uuid);
  }

  async findAll(query: AnyPayload) {
    const page = Math.max(
      Number(query.page) || 1,
      1,
    );

    const limit = Math.min(
      Math.max(Number(query.limit) || 10, 1),
      100,
    );

    const where: WhereOptions<WorkOrderAttributes> = {};

    if (query.projectId) {
      Object.assign(where, {
        projectId: query.projectId,
      });
    }

    if (query.search) {
      Object.assign(where, {
        [Op.or]: [
          {
            code: {
              [Op.iLike]: `%${query.search}%`,
            },
          },
          {
            clientOrderNo: {
              [Op.iLike]: `%${query.search}%`,
            },
          },
        ],
      });
    }

    const options: FindAndCountOptions<WorkOrderAttributes> = {
      where,
      include: this.includes,
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    };

    const { rows, count } =
      await this.model.findAndCountAll(options);

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findOne(uuid: string) {
    const row = await this.model.findOne({
      where: { uuid },
      include: this.includes,
    });

    if (!row) {
      throw new NotFoundException(
        `Work order ${uuid} not found`,
      );
    }

    return row;
  }

  async update(uuid: string, body: AnyPayload) {
    const row = await this.model.findOne({
      where: { uuid },
    });

    if (!row) {
      throw new NotFoundException(
        `Work order ${uuid} not found`,
      );
    }

    if (
      !body ||
      typeof body !== 'object' ||
      Array.isArray(body)
    ) {
      throw new BadRequestException(
        'Request body must be an object',
      );
    }

    const details = this.getDetails(body);
    const payload = this.mapFields(
      body,
      details,
      true,
    );

    if (this.hasOwn(payload, 'projectId')) {
      if (
        typeof payload.projectId !== 'string' ||
        !payload.projectId.trim()
      ) {
        throw new BadRequestException(
          'Project ID cannot be empty',
        );
      }
    }

    if (this.hasOwn(payload, 'code')) {
      if (
        typeof payload.code !== 'string' ||
        !payload.code.trim()
      ) {
        throw new BadRequestException(
          'Work order code cannot be empty',
        );
      }
    }

    if (this.hasOwn(payload, 'date')) {
      payload.date = this.validateDate(
        payload.date,
      );
    }

    await row.update(payload);

    return this.findOne(uuid);
  }

  async remove(uuid: string) {
    const row = await this.model.findOne({
      where: { uuid },
    });

    if (!row) {
      throw new NotFoundException(
        `Work order ${uuid} not found`,
      );
    }

    await row.destroy();

    return {
      message: 'Work order deleted successfully',
    };
  }
}
