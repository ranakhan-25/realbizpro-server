/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CustomerAccount } from 'src/database/models/accounts/contact/acc_customers_accounts_model';
import { CreateCustomerAccountDto } from './dto/create-customers_account.dto';
import { QueryCustomerAccountDto } from './dto/query-customers_account.dto';
import { UpdateCustomerAccountDto } from './dto/update-customers_account.dto';

@Injectable()
export class CustomerAccountService {
  constructor(
    @InjectModel(CustomerAccount)
    private readonly customerModel: typeof CustomerAccount,
  ) {}

  async create(dto: CreateCustomerAccountDto): Promise<CustomerAccount> {
    try {
      return await this.customerModel.create(dto as any);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Customer code already exists.');
      }
      throw error;
    }
  }

  async findAll(query: QueryCustomerAccountDto) {
    const { page = '1', limit = '10', search, sortBy = 'createdAt', sortOrder = 'DESC', ...filters } = query;
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    Object.keys(filters).forEach((k) => {
      if (filters[k] !== undefined && filters[k] !== null && filters[k] !== '') {
        where[k] = filters[k];
      }
    });

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } },
        { mobile: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.customerModel.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [[sortBy, sortOrder]],
    });

    return {
      data: rows,
      meta: { total: count, page: pageNum, limit: limitNum, totalPages: Math.ceil(count / limitNum) },
    };
  }

  async findOne(uuid: string): Promise<CustomerAccount> {
    const customer = await this.customerModel.findOne({ where: { uuid } });
    if (!customer) throw new NotFoundException(`Customer ${uuid} not found`);
    return customer;
  }

  async update(uuid: string, dto: UpdateCustomerAccountDto): Promise<CustomerAccount> {
    const customer = await this.findOne(uuid);
    return customer.update(dto as any);
  }

  async remove(uuid: string): Promise<{ message: string }> {
    const customer = await this.findOne(uuid);
    await customer.destroy();
    return { message: 'Customer deleted successfully' };
  }

  async restore(uuid: string): Promise<CustomerAccount> {
    const customer = await this.customerModel.findOne({ where: { uuid }, paranoid: false });
    if (!customer) throw new NotFoundException(`Customer ${uuid} not found`);
    if (!customer.deletedAt) throw new BadRequestException('Customer is not deleted');
    await customer.restore();
    return this.findOne(uuid);
  }
}