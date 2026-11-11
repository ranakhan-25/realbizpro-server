import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';

import { CreateSupplierAccountDto } from './dto/create_supplier_account.dto';
import { QuerySupplierAccountDto } from './dto/query_supplier_account.dto';
import { UpdateSupplierAccountDto } from './dto/update_supplier_account.dto';
import {
  SupplierAccounts,
  SupplierAccountsStatus,
} from 'src/database/models/projects/contract/pr_supplier_accounts.model';

@Injectable()
export class SupplierAccountsService {
  constructor(
    @InjectModel(SupplierAccounts)
    private readonly supplierAccountsModel: typeof SupplierAccounts,
  ) {}

  async create(
    dto: CreateSupplierAccountDto,
    userId?: number,
    currentUser?: any,
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
      await this.supplierAccountsModel.create(({
        createdBy: userId ? String(userId) : null,
        orgId: currentUser?.orgId ?? null,
        projectId: currentUser?.projectId ?? null,
        ...supplierData,
        status:
          dto.status ??
          SupplierAccountsStatus.ACTIVE,
        ...(dueDate
          ? { dueDate: new Date(dueDate) }
          : {}),
      }) as any);

    return this.findOne(supplierAccount.uuid);
  }

  async findAll(
    query: QuerySupplierAccountDto,
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
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
        {
          address: { [Op.iLike]: `%${search}%` },
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

    if (status) {
      where.status = status;
    }

    const { rows, count } =
      await this.supplierAccountsModel.findAndCountAll(
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
  ): Promise<SupplierAccounts> {
    const supplierAccount =
      await this.supplierAccountsModel.findOne({
        where: { uuid } as any,
      });

    if (!supplierAccount) {
      throw new NotFoundException(
        `Supplier account #${uuid} not found`,
      );
    }

    return supplierAccount;
  }

  async update(
    uuid: string,
    dto: UpdateSupplierAccountDto,
    userId?: number,
    currentUser?: any,
  ): Promise<SupplierAccounts> {
    const supplierAccount =
      await this.supplierAccountsModel.findOne({
        where: { uuid } as any,
      });

    if (!supplierAccount) {
      throw new NotFoundException(
        `Supplier account #${uuid} not found`,
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

    await supplierAccount.update(({
      ...supplierData,
      ...(dueDate
        ? { dueDate: new Date(dueDate) }
        : {}),
    }) as any);

    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const supplierAccount =
      await this.supplierAccountsModel.findOne({
        where: { uuid } as any,
      });

    if (!supplierAccount) {
      throw new NotFoundException(
        `Supplier account #${uuid} not found`,
      );
    }

    // status → inactive + soft delete
    await supplierAccount.update(({
      status: SupplierAccountsStatus.INACTIVE,
    }) as any);

    await supplierAccount.destroy();

    return {
      message: `Supplier account #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<SupplierAccounts> {
    const supplierAccount =
      await this.supplierAccountsModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!supplierAccount) {
      throw new NotFoundException(
        `Supplier account #${uuid} not found`,
      );
    }

    if (!supplierAccount.deletedAt) {
      throw new BadRequestException(
        `Supplier account #${uuid} is not deleted`,
      );
    }

    // status → active + restore
    await supplierAccount.restore();
    await supplierAccount.update(({
      status: SupplierAccountsStatus.ACTIVE,
    }) as any);

    return this.findOne(uuid);
  }
}
