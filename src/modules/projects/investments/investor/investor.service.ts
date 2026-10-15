/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';

import {
  Investor,
  InvestorStatus,
} from 'src/database/models/projects/investor/investor.model';

import { InvestorNominee } from 'src/database/models/projects/investor/investor_nominee.model';

import { CreateInvestorDto } from './dto/create-investor.dto';
import { QueryInvestorDto } from './dto/query-investor.dto';
import { UpdateInvestorDto } from './dto/update-investor.dto';

@Injectable()
export class InvestorService {
  constructor(
    @InjectModel(Investor)
    private readonly investorModel: typeof Investor,

    @InjectModel(InvestorNominee)
    private readonly investorNomineeModel: typeof InvestorNominee,
  ) {}

  async create(
    dto: CreateInvestorDto,
  ): Promise<Investor> {
    const existing =
      await this.investorModel.findOne({
        where: {
          code: dto.code,
        },
      });

    if (existing) {
      throw new BadRequestException(
        `Investor code "${dto.code}" already exists`,
      );
    }

    // Check nominee percentage
    if (dto.nominees && dto.nominees.length > 0) {
      const total = dto.nominees.reduce(
        (sum, n) => sum + Number(n.percentage),
        0,
      );

      if (total > 100) {
        throw new BadRequestException(
          `Total nominee percentage cannot exceed 100 (current: ${total})`,
        );
      }
    }

    const investor =
      await this.investorModel.create({
        code: dto.code,
        name: dto.name,
        mobileNo: dto.mobileNo,
        email: dto.email,
        nid: dto.nid,
        address: dto.address,
        image: dto.image,
        groupTier: dto.groupTier,
        underGroup: dto.underGroup,
        addedById: dto.addedById,
        status:
          dto.status ?? InvestorStatus.ACTIVE,
      });

    // Create nominees
    if (dto.nominees && dto.nominees.length > 0) {
      const nomineePayload = dto.nominees.map(
        (n) => ({
          investorId: investor.uuid,
          nomineeName: n.nomineeName,
          nomineeNid: n.nomineeNid,
          relation: n.relation,
          percentage: n.percentage,
        }),
      );

      await this.investorNomineeModel.bulkCreate(
        nomineePayload,
      );
    }

    return this.findOne(investor.uuid);
  }

  async findAll(query: QueryInvestorDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      groupTier,
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
          nid: {
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

    if (groupTier) {
      where.groupTier = groupTier;
    }

    if (underGroup) {
      where.underGroup = underGroup;
    }

    if (status) {
      where.status = status;
    }

    const { rows, count } =
      await this.investorModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [[sortBy, sortOrder]],

        paranoid: !withDeleted,

        include: [
          {
            association: 'nominees',
            required: false,
          },
        ],

        distinct: true,
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

  async findOne(uuid: string): Promise<Investor> {
    const investor =
      await this.investorModel.findOne({
        where: {
          uuid,
        } as any,

        include: [
          {
            association: 'nominees',
            required: false,
          },
        ],
      });

    if (!investor) {
      throw new NotFoundException(
        `Investor #${uuid} not found`,
      );
    }

    return investor;
  }

  async update(
    uuid: string,
    dto: UpdateInvestorDto,
  ): Promise<Investor> {
    const investor =
      await this.investorModel.findOne({
        where: {
          uuid,
        } as any,
      });

    if (!investor) {
      throw new NotFoundException(
        `Investor #${uuid} not found`,
      );
    }

    // Check duplicate code
    if (dto.code && dto.code !== investor.code) {
      const exists =
        await this.investorModel.findOne({
          where: {
            code: dto.code,
          },
        });

      if (exists) {
        throw new BadRequestException(
          `Investor code "${dto.code}" already exists`,
        );
      }
    }

    // Check nominee percentage
    if (dto.nominees && dto.nominees.length > 0) {
      const total = dto.nominees.reduce(
        (sum, n) => sum + Number(n.percentage),
        0,
      );

      if (total > 100) {
        throw new BadRequestException(
          `Total nominee percentage cannot exceed 100 (current: ${total})`,
        );
      }
    }

    // Separate nominees from investor data
    const { nominees, ...investorData } = dto;

    // Update investor
    await investor.update(investorData);

    // Replace nominees if provided
    if (nominees !== undefined) {
      // Soft delete existing nominees
      await this.investorNomineeModel.destroy({
        where: {
          investorId: uuid,
        },
      });

      // Create new nominees
      if (nominees.length > 0) {
        const nomineePayload = nominees.map(
          (n) => ({
            investorId: uuid,
            nomineeName: n.nomineeName,
            nomineeNid: n.nomineeNid,
            relation: n.relation,
            percentage: n.percentage,
          }),
        );

        await this.investorNomineeModel.bulkCreate(
          nomineePayload,
        );
      }
    }

    return this.findOne(uuid);
  }

  async remove(
    uuid: string,
  ): Promise<{ message: string }> {
    const investor =
      await this.investorModel.findOne({
        where: {
          uuid,
        } as any,
      });

    if (!investor) {
      throw new NotFoundException(
        `Investor #${uuid} not found`,
      );
    }

    // Status → inactive
    await investor.update({
      status: InvestorStatus.INACTIVE,
    });

    // Soft delete
    await investor.destroy();

    return {
      message: `Investor #${uuid} deleted successfully`,
    };
  }

  async restore(uuid: string): Promise<Investor> {
    const investor =
      await this.investorModel.findOne({
        where: {
          uuid,
        } as any,

        paranoid: false,
      });

    if (!investor) {
      throw new NotFoundException(
        `Investor #${uuid} not found`,
      );
    }

    if (!investor.deletedAt) {
      throw new BadRequestException(
        `Investor #${uuid} is not deleted`,
      );
    }

    // Restore
    await investor.restore();

    // Status → active
    await investor.update({
      status: InvestorStatus.ACTIVE,
    });

    return this.findOne(uuid);
  }
}
