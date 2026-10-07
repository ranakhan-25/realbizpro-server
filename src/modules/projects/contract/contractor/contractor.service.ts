/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';

import {
  Contractor,
  ContractorStatus,
} from 'src/database/models/projects/contract/pr_contractor_model';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { QueryContractorDto } from './dto/query-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';

@Injectable()
export class ContractorService {
  constructor(
    @InjectModel(Contractor)
    private readonly contractorModel: typeof Contractor,
  ) {}

  async create(
    dto: CreateContractorDto,
  ): Promise<Contractor> {
    const existing =
      await this.contractorModel.findOne({
        where: {
          code: dto.code,
        },
      });

    if (existing) {
      throw new BadRequestException(
        `Contractor code "${dto.code}" already exists`,
      );
    }

    const contractor =
      await this.contractorModel.create({
        code: dto.code,
        name: dto.name,
        businessName: dto.businessName,
        email: dto.email,
        mobileNo: dto.mobileNo,
        address: dto.address,
        creditLimit: dto.creditLimit,
        dueDate: dto.dueDate
          ? new Date(dto.dueDate)
          : null,
        under: dto.under,
        addedById: dto.addedById,
        status:
          dto.status ?? ContractorStatus.ACTIVE,
      });

    return this.findOne(contractor.uuid);
  }

  async findAll(query: QueryContractorDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      under,
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
          code: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          name: {
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
          address: { [Op.iLike]: `%${search}%` },
        },
      ];
    }

    if (under) {
      where.under = under;
    }

    if (status) {
      where.status = status;
    }

    const { rows, count } =
      await this.contractorModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
        paranoid: !withDeleted,
      });

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
  ): Promise<Contractor> {
    const contractor =
      await this.contractorModel.findOne({
        where: { uuid } as any,
      });

    if (!contractor) {
      throw new NotFoundException(
        `Contractor #${uuid} not found`,
      );
    }

    return contractor;
  }

  async update(
    uuid: string,
    dto: UpdateContractorDto,
  ): Promise<Contractor> {
    const contractor =
      await this.contractorModel.findOne({
        where: { uuid } as any,
      });

    if (!contractor) {
      throw new NotFoundException(
        `Contractor #${uuid} not found`,
      );
    }

    if (
      dto.code &&
      dto.code !== contractor.code
    ) {
      const exists =
        await this.contractorModel.findOne({
          where: {
            code: dto.code,
          },
        });

      if (exists) {
        throw new BadRequestException(
          `Contractor code "${dto.code}" already exists`,
        );
      }
    }

    // dueDate string হলে Date-এ convert করো
    const updateData: any = { ...dto };
    if (dto.dueDate !== undefined) {
      updateData.dueDate = dto.dueDate
        ? new Date(dto.dueDate)
        : null;
    }

    await contractor.update(updateData);

    return this.findOne(uuid);
  }

  async remove(
    uuid: string,
  ): Promise<{ message: string }> {
    const contractor =
      await this.contractorModel.findOne({
        where: { uuid } as any,
      });

    if (!contractor) {
      throw new NotFoundException(
        `Contractor #${uuid} not found`,
      );
    }

    // status → inactive + soft delete
    await contractor.update({
      status: ContractorStatus.INACTIVE,
    });

    await contractor.destroy();

    return {
      message: `Contractor #${uuid} deleted successfully`,
    };
  }

  async restore(
    uuid: string,
  ): Promise<Contractor> {
    const contractor =
      await this.contractorModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!contractor) {
      throw new NotFoundException(
        `Contractor #${uuid} not found`,
      );
    }

    if (!contractor.deletedAt) {
      throw new BadRequestException(
        `Contractor #${uuid} is not deleted`,
      );
    }

    // status → active + restore
    await contractor.restore();
    await contractor.update({
      status: ContractorStatus.ACTIVE,
    });

    return this.findOne(uuid);
  }
}
