import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';


import { SupplierAccount } from 'src/database/models/accounts/contact/acc_supplier_accounts_model';
import { CustomerAccount } from 'src/database/models/accounts/contact/acc_customers_accounts_model';
import { CreateSupplierAccountDto } from './dto/create-supplier_account.dto';
import { QuerySupplierAccountDto } from './dto/query-supplier_account.dto';
import { UpdateSupplierAccountDto } from './dto/update-supplier_account.dto';


@Injectable()
export class SupplierAccountsService {
  constructor(
    @InjectModel(SupplierAccount)
    private readonly supplierRepo: typeof SupplierAccount,
    @InjectModel(CustomerAccount)
    private readonly customerRepo: typeof CustomerAccount,
  ) {}

  // ─────────────── CREATE ───────────────
  async create(dto: CreateSupplierAccountDto): Promise<SupplierAccount> {
    // unique code check
    const existing = await this.supplierRepo.findOne({
      where: { code: dto.code },
    });
    if (existing) {
      throw new ConflictException(
        `Supplier with code "${dto.code}" already exists`,
      );
    }

    // customer account validation
    if (dto.customerAccountId) {
      const customer = await this.customerRepo.findByPk(dto.customerAccountId);
      if (!customer) {
        throw new BadRequestException(
          `CustomerAccount ${dto.customerAccountId} not found`,
        );
      }
    }

    return this.supplierRepo.create({ ...dto } as any);
  }

  // ─────────────── FIND ALL (pagination + filter + search) ───────────────
  async findAll(query: QuerySupplierAccountDto) {
    const {
      page = 1,
      limit = 10,
      search,
      under,
      customerAccountId,
      sortBy = 'id',
      sortOrder = 'DESC',
    } = query;

    const where: any = {};

    if (under) where.under = under;
    if (customerAccountId) where.customerAccountId = customerAccountId;

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phoneMobile: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.supplierRepo.findAndCountAll({
      where,
      include: [
        {
          model: CustomerAccount,
          as: 'customerAccount',
          required: false,
        },
      ],
      order: [[sortBy, sortOrder]],
      limit,
      offset: (page - 1) * limit,
      distinct: true,
    });

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

  // ─────────────── FIND ONE ───────────────
  async findOne(id: number): Promise<SupplierAccount> {
    const supplier = await this.supplierRepo.findByPk(id, {
      include: [
        { model: CustomerAccount, as: 'customerAccount', required: false },
      ],
    });
    if (!supplier) {
      throw new NotFoundException(`SupplierAccount ${id} not found`);
    }
    return supplier;
  }

  // ─────────────── FIND BY CODE ───────────────
  async findByCode(code: string): Promise<SupplierAccount> {
    const supplier = await this.supplierRepo.findOne({
      where: { code },
      include: [
        { model: CustomerAccount, as: 'customerAccount', required: false },
      ],
    });
    if (!supplier) {
      throw new NotFoundException(`SupplierAccount code "${code}" not found`);
    }
    return supplier;
  }

  // ─────────────── FIND BY CUSTOMER ───────────────
  async findByCustomer(customerAccountId: number): Promise<SupplierAccount[]> {
    return this.supplierRepo.findAll({
      where: { customerAccountId },
      include: [
        { model: CustomerAccount, as: 'customerAccount', required: false },
      ],
      order: [['id', 'DESC']],
    });
  }

  // ─────────────── UPDATE ───────────────
  async update(
    id: number,
    dto: UpdateSupplierAccountDto,
  ): Promise<SupplierAccount> {
    const supplier = await this.findOne(id);

    if (dto.code && dto.code !== supplier.code) {
      const existing = await this.supplierRepo.findOne({
        where: { code: dto.code },
      });
      if (existing) {
        throw new ConflictException(
          `Supplier with code "${dto.code}" already exists`,
        );
      }
    }

    if (dto.customerAccountId) {
      const customer = await this.customerRepo.findByPk(dto.customerAccountId);
      if (!customer) {
        throw new BadRequestException(
          `CustomerAccount ${dto.customerAccountId} not found`,
        );
      }
    }

    await supplier.update(dto as any);
    return this.findOne(id);
  }

  // ─────────────── DELETE ───────────────
  async remove(id: number): Promise<{ message: string }> {
    const supplier = await this.findOne(id);
    await supplier.destroy();
    return { message: `SupplierAccount ${id} deleted successfully` };
  }
}