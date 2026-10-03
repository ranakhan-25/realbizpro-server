/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';

import { CreateSupplierAccountDto } from './dto/create-supplier-account.dto';
import { QuerySupplierAccountDto } from './dto/query-supplier-account.dto';
import { UpdateSupplierAccountDto } from './dto/update-supplier-account.dto';
import { SupplierAccounts } from 'src/database/models/supplier accounts/sa_supplier_accounts_model';

@Injectable()
export class SupplierAccountsService {
  constructor(
    @InjectModel(SupplierAccounts)
    private readonly supplierAccountsModel: typeof SupplierAccounts,
  ) {}

  // CREATE
  async create(
    dto: CreateSupplierAccountDto,
  ): Promise<SupplierAccounts> {
    const existing =
      await this.supplierAccountsModel.findOne({
        where: {
          supplierCode: dto.supplierCode,
        },
      });

    if (existing) {
      throw new BadRequestException(
        `Supplier account code "${dto.supplierCode}" already exists`,
      );
    }

    const { dueDate, ...supplierData } = dto;

    const supplierAccount =
      await this.supplierAccountsModel.create({
        ...supplierData,
        ...(dueDate
          ? { dueDate: new Date(dueDate) }
          : {}),
      });

    return this.findOne(supplierAccount.id);
  }

  // FIND ALL
  async findAll(query: QuerySupplierAccountDto) {
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
          supplierCode: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          supplierName: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          businessName: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          email: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          phone: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          address: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          underGroup: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    if (underGroup) {
      where.underGroup = underGroup;
    }

    const { rows, count } =
      await this.supplierAccountsModel.findAndCountAll(
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

  // FIND ONE
  async findOne(
    id: string | number,
  ): Promise<SupplierAccounts> {
    const supplierAccount =
      await this.supplierAccountsModel.findByPk(
        id,
      );

    if (!supplierAccount) {
      throw new NotFoundException(
        `Supplier account #${id} not found`,
      );
    }

    return supplierAccount;
  }

  // UPDATE
  async update(
    id: string | number,
    dto: UpdateSupplierAccountDto,
  ): Promise<SupplierAccounts> {
    const supplierAccount =
      await this.supplierAccountsModel.findByPk(
        id,
      );

    if (!supplierAccount) {
      throw new NotFoundException(
        `Supplier account #${id} not found`,
      );
    }

    if (
      dto.supplierCode &&
      dto.supplierCode !==
        supplierAccount.supplierCode
    ) {
      const exists =
        await this.supplierAccountsModel.findOne({
          where: {
            supplierCode: dto.supplierCode,
          },
        });

      if (exists) {
        throw new BadRequestException(
          `Supplier account code "${dto.supplierCode}" already exists`,
        );
      }
    }

    const { dueDate, ...supplierData } = dto;

    await supplierAccount.update({
      ...supplierData,
      ...(dueDate
        ? { dueDate: new Date(dueDate) }
        : {}),
    });

    return this.findOne(id);
  }

  // REMOVE
  async remove(
    id: string | number,
  ): Promise<{ message: string }> {
    const supplierAccount =
      await this.supplierAccountsModel.findByPk(
        id,
      );

    if (!supplierAccount) {
      throw new NotFoundException(
        `Supplier account #${id} not found`,
      );
    }

    await supplierAccount.destroy();

    return {
      message: `Supplier account #${id} deleted successfully`,
    };
  }

  // RESTORE
  async restore(
    id: string | number,
  ): Promise<SupplierAccounts> {
    const supplierAccount =
      await this.supplierAccountsModel.findByPk(
        id,
        {
          paranoid: false,
        },
      );

    if (!supplierAccount) {
      throw new NotFoundException(
        `Supplier account #${id} not found`,
      );
    }

    if (!supplierAccount.deletedAt) {
      throw new BadRequestException(
        `Supplier account #${id} is not deleted`,
      );
    }

    await supplierAccount.restore();

    return this.findOne(id);
  }
}
