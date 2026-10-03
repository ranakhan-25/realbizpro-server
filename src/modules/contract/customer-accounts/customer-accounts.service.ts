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
import { CustomerAccount } from 'src/database/models/customer account/ca_customer_accounts_model';

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
      });

    return this.findOne(customerAccount.id);
  }

  async findAll(query: QueryCustomerAccountDto) {
    const {
      page = 1,
      limit = 10,
      search,
      underGroup,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;

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
          mobileNo: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          email: {
            [Op.iLike]: `%${search}%`,
          },
        },
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
          address: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    if (underGroup) {
      where.underGroup = underGroup;
    }

    const { rows, count } =
      await this.customerAccountModel.findAndCountAll(
        {
          where,
          limit,
          offset: (page - 1) * limit,
          order: [[sortBy, sortOrder]],
          paranoid: !withDeleted,
        },
      );

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

  async findOne(
    id: string | number,
  ): Promise<CustomerAccount> {
    const customerAccount =
      await this.customerAccountModel.findByPk(
        id,
      );

    if (!customerAccount) {
      throw new NotFoundException(
        `Customer account #${id} not found`,
      );
    }

    return customerAccount;
  }

  async update(
    id: string | number,
    dto: UpdateCustomerAccountDto,
  ): Promise<CustomerAccount> {
    const customerAccount =
      await this.customerAccountModel.findByPk(
        id,
      );

    if (!customerAccount) {
      throw new NotFoundException(
        `Customer account #${id} not found`,
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

    return this.findOne(id);
  }

  async remove(
    id: string | number,
  ): Promise<{ message: string }> {
    const customerAccount =
      await this.customerAccountModel.findByPk(
        id,
      );

    if (!customerAccount) {
      throw new NotFoundException(
        `Customer account #${id} not found`,
      );
    }

    await customerAccount.destroy();

    return {
      message: `Customer account #${id} deleted successfully`,
    };
  }

  async restore(
    id: string | number,
  ): Promise<CustomerAccount> {
    const customerAccount =
      await this.customerAccountModel.findByPk(
        id,
        {
          paranoid: false,
        },
      );

    if (!customerAccount) {
      throw new NotFoundException(
        `Customer account #${id} not found`,
      );
    }

    if (!customerAccount.deletedAt) {
      throw new BadRequestException(
        `Customer account #${id} is not deleted`,
      );
    }

    await customerAccount.restore();

    return this.findOne(id);
  }
}
