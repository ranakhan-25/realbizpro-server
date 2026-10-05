/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';

import { CreateCustomerAccountDto } from './dto/create-customer-account.dto';
import { QueryCustomerAccountDto } from './dto/query-customer-account.dto';
import { UpdateCustomerAccountDto } from './dto/update-customer-account.dto';
import {
  CustomerAccount,
  CustomerAccountStatus,
} from 'src/database/models/customer account/ca_customer_accounts_model';

@Injectable()
export class CustomerAccountService {
  constructor(
    @InjectModel(CustomerAccount)
    private readonly customerAccountModel: typeof CustomerAccount,
  ) {}

  async create(
    dto: CreateCustomerAccountDto,
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
      await this.customerAccountModel.create({
        ...dto,
        status:
          dto.status ??
          CustomerAccountStatus.ACTIVE,
      });

    return this.findOne(customerAccount.uuid);
  }

  async findAll(query: QueryCustomerAccountDto) {
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

  async remove(
    uuid: string,
  ): Promise<{ message: string }> {
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
    await customerAccount.update({
      status: CustomerAccountStatus.INACTIVE,
    });

    await customerAccount.destroy();

    return {
      message: `Customer account #${uuid} deleted successfully`,
    };
  }

  async restore(
    uuid: string,
  ): Promise<CustomerAccount> {
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
    await customerAccount.update({
      status: CustomerAccountStatus.ACTIVE,
    });

    return this.findOne(uuid);
  }
}
