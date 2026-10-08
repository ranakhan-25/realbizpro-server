// src/modules/system/company.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import {
  ForeignKeyConstraintError,
  ValidationError as SequelizeValidationError,
  UniqueConstraintError,
} from 'sequelize';

import { CreateCompanyDto } from './dto/create-sys-company.dto';
import { UpdateCompanyDto } from './dto/update-sys-company.dto';
import { SysCompany } from '@/database/models/system/sys_company.model';
import { PaginateParams } from '@/common/decorators/paginate.decorator';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(SysCompany)
    private companyModel: typeof SysCompany,
  ) {}

  async create(
    createDto: CreateCompanyDto,
    createdById?: number,
  ): Promise<SysCompany> {
    // name or VAT uniqueness checks (example: check name)
    const existing =
      await this.companyModel.findOne({
        where: {
          [Op.or]: [{ name: createDto.name }],
        },
      });
    if (existing) {
      throw new ConflictException(
        'Company with this name or VAT already exists',
      );
    }

    try {
      const payload: Partial<SysCompany> = {
        name: createDto.name,
        address: createDto.address,
        bnName: createDto.bnName,
        bnAddress: createDto.bnAddress,
        mobile: createDto.mobile,
        telephone: createDto.telephone,
        ipPhone: createDto.ipPhone,
        vatRegNum: createDto.vatRegNum,
        email: createDto.email,
        website: createDto.website,
        logo: createDto.logo,
        status: createDto.status ?? 'Active',
        ...BadRequestException,
      };

      return await this.companyModel.create(
        payload,
      );
    } catch (error) {
      if (
        error instanceof UniqueConstraintError
      ) {
        throw new ConflictException(
          'Company already exists or unique constraint violated.',
        );
      }

      if (
        error instanceof SequelizeValidationError
      ) {
        const messages = (error.errors || [])
          .map((e: any) => e.message)
          .join('; ');
        throw new BadRequestException(
          `Validation failed: ${messages}`,
        );
      }

      if (
        error instanceof ForeignKeyConstraintError
      ) {
        throw new BadRequestException(
          'Foreign key constraint failed.',
        );
      }

      throw new BadRequestException(
        'Failed to create company',
      );
    }
  }

  async findAll(): Promise<SysCompany[]> {
    return this.companyModel.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number): Promise<SysCompany> {
    const company =
      await this.companyModel.findByPk(id);
    if (!company)
      throw new NotFoundException(
        `Company with ID ${id} not found`,
      );
    return company;
  }

  async update(
    id: number,
    updateDto: UpdateCompanyDto,
  ): Promise<SysCompany> {
    const company =
      await this.companyModel.findByPk(id);
    if (!company)
      throw new NotFoundException(
        `Company with ID ${id} not found`,
      );

    if (
      updateDto.name &&
      updateDto.name !== company.name
    ) {
      const existing =
        await this.companyModel.findOne({
          where: {
            name: updateDto.name,
            id: { [Op.ne]: id },
          },
        });
      if (existing)
        throw new ConflictException(
          'Company with this name already exists',
        );
    }

    if (
      updateDto.vatRegNum &&
      updateDto.vatRegNum !== company.vatRegNum
    ) {
      const existingVat =
        await this.companyModel.findOne({
          where: {
            vatRegNum: updateDto.vatRegNum,
            id: { [Op.ne]: id },
          },
        });
      if (existingVat)
        throw new ConflictException(
          'Company with this VAT already exists',
        );
    }

    await company.update(updateDto);
    return company;
  }

  async softDelete(
    id: number,
    deletedById?: number,
  ): Promise<void> {
    const company =
      await this.companyModel.findByPk(id);
    if (!company)
      throw new NotFoundException(
        `Company with ID ${id} not found`,
      );

    await company.update({
      deletedBy: deletedById ?? company.deletedBy,
    });
    await company.destroy(); // paranoid = true → soft-delete
  }

  async findAndCount({
    skip,
    limit,
    search,
  }: PaginateParams): Promise<
    [SysCompany[], number]
  > {
    let whereClause: any = {};

    if (search) {
      const term = search.trim();
      whereClause = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${term}%` } },
          {
            vatRegNum: {
              [Op.iLike]: `%${term}%`,
            },
          },
          { email: { [Op.iLike]: `%${term}%` } },
          {
            website: { [Op.iLike]: `%${term}%` },
          },
        ],
      };
    }

    const { rows, count } =
      await this.companyModel.findAndCountAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        offset: skip,
        limit,
      });

    return [rows, count];
  }
}
