/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';

import { CreateCustomerAccountDto } from './dto/create_customer_account.dto';
import { QueryCustomerAccountDto } from './dto/query_customer_account.dto';
import { UpdateCustomerAccountDto } from './dto/update_customer_account.dto';
import {
  CustomerAccount,
  CustomerAccountStatus,
} from 'src/database/models/projects/contract/pr_customer_accounts.model';

@Injectable()
export class CustomerAccountService {
  constructor(
    @InjectModel(CustomerAccount)
    private readonly customerAccountModel: typeof CustomerAccount,
  ) {}

  async create(
    dto: CreateCustomerAccountDto,
    userId?: number,
    currentUser?: any,
  ): Promise<CustomerAccount> {
    const existing =
      await this.customerAccountModel.findOne({
        where: {
          customerCode: dto.customerCode,
        },
      });

    if (existing) {
      throw new BadRequestException(
        `Customer account code "${dto.customerCode}" already exists`,
      );
    }

    const customerAccount =
      await this.customerAccountModel.create(({
        createdBy: userId ? String(userId) : null,
        orgId: currentUser?.orgId ?? null,
        projectId: currentUser?.projectId ?? null,
        ...dto,
        status:
          dto.status ??
          CustomerAccountStatus.ACTIVE,
      }) as any);

    return this.findOne(customerAccount.uuid);
  }

  async findAll(
    query: QueryCustomerAccountDto,
    currentUser?: any,
  ) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      underGroup,
      status,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;

    const offset =
      skip !== undefined && skip !== null
        ? skip
        : (page - 1) * limit;

    const where: any = {};
    const effectiveOrgId = (query as any)?.orgId ?? currentUser?.orgId;
    if (effectiveOrgId) {
      where.orgId = effectiveOrgId;
    }
    const effectiveProjectId = (query as any)?.projectId ?? currentUser?.projectId;
    if (effectiveProjectId) {
      where.projectId = effectiveProjectId;
    }
    if ((query as any)?.orgId) {
      where.orgId = (query as any).orgId;
    }
    if ((query as any)?.projectId) {
      where.projectId = (query as any).projectId;
    }
    if ((query as any)?.orgId) {
      where.orgId = (query as any).orgId;
    }
    if ((query as any)?.projectId) {
      where.projectId = (query as any).projectId;
    }

    if (search) {
      where[Op.or] = [
        {
          customerCode: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          customerName: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          mobileNo: { [Op.iLike]: `%${search}%` },
        },
        { email: { [Op.iLike]: `%${search}%` } },
        {
          businessName: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          nidOrPassport: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          underGroup: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          address: { [Op.iLike]: `%${search}%` },
        },
      ];
    }

    if (underGroup) {
      where.underGroup = underGroup;
    }

    if (status) {
      where.status = status;
    }

    const { rows, count } =
      await this.customerAccountModel.findAndCountAll(
        {
          where,
          limit,
          offset,
          order: [[sortBy, sortOrder]],
          paranoid: !withDeleted,
        },
      );

    const totalPages =
      Math.ceil(count / limit) || 1;
    const currentPage =
      skip !== undefined && skip !== null
        ? Math.floor(skip / limit) + 1
        : page;

    const nextPage =
      currentPage < totalPages
        ? currentPage + 1
        : null;

    const previousPage =
      currentPage > 1 ? currentPage - 1 : null;

    return {
      data: rows,
      meta: {
        page: currentPage,
        pageNo: currentPage,
        nextPage,
        previousPage,
        limit,
        skip: offset,
        total: count,
        totalPages,
      },
    };
  }

  async findOne(
    uuid: string,
    currentUser?: any,
  ): Promise<CustomerAccount> {
    const customerAccount =
      await this.customerAccountModel.findOne({
        where: { uuid } as any,
      });

    if (!customerAccount) {
      throw new NotFoundException(
        `Customer account #${uuid} not found`,
      );
    }

    return customerAccount;
  }

  async update(
    uuid: string,
    dto: UpdateCustomerAccountDto,
    userId?: number,
    currentUser?: any,
  ): Promise<CustomerAccount> {
    const customerAccount =
      await this.customerAccountModel.findOne({
        where: { uuid } as any,
      });

    if (!customerAccount) {
      throw new NotFoundException(
        `Customer account #${uuid} not found`,
      );
    }

    if (
      dto.customerCode &&
      dto.customerCode !==
        customerAccount.customerCode
    ) {
      const exists =
        await this.customerAccountModel.findOne({
          where: {
            customerCode: dto.customerCode,
          },
        });

      if (exists) {
        throw new BadRequestException(
          `Customer account code "${dto.customerCode}" already exists`,
        );
      }
    }

    await customerAccount.update(dto);

    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const customerAccount =
      await this.customerAccountModel.findOne({
        where: { uuid } as any,
      });

    if (!customerAccount) {
      throw new NotFoundException(
        `Customer account #${uuid} not found`,
      );
    }

    // status → inactive + soft delete
    await customerAccount.update(({
      status: CustomerAccountStatus.INACTIVE,
    }) as any);

    await customerAccount.destroy();

    return {
      message: `Customer account #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<CustomerAccount> {
    const customerAccount =
      await this.customerAccountModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!customerAccount) {
      throw new NotFoundException(
        `Customer account #${uuid} not found`,
      );
    }

    if (!customerAccount.deletedAt) {
      throw new BadRequestException(
        `Customer account #${uuid} is not deleted`,
      );
    }

    // status → active + restore
    await customerAccount.restore();
    await customerAccount.update(({
      status: CustomerAccountStatus.ACTIVE,
    }) as any);

    return this.findOne(uuid);
  }
}
