/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ProjectParty } from 'src/database/models/projects/project_party/pr_project_party_model';
import { CreateProjectPartyDto } from './dto/create-project_party.dto';
import { UpdateProjectPartyDto } from './dto/update-project_party.dto';
import { QueryProjectPartyDto } from './dto/query-project_party.dto';

@Injectable()
export class ProjectPartyService {
  constructor(
    @InjectModel(ProjectParty)
    private readonly partyModel: typeof ProjectParty,
  ) {}

  async create(
    dto: CreateProjectPartyDto,
    userId?: number,
    currentUser?: any,
  ): Promise<ProjectParty> {
    try {
      return await this.partyModel.create(dto as any);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Party code already exists.');
      }
      throw error;
    }
  }

  async findAll(
    query: QueryProjectPartyDto,
    currentUser?: any,
  ) {
    const { 
      page = '1', 
      limit = '10', 
      search, 
      sortBy = 'createdAt', 
      sortOrder = 'DESC',
      ...filters 
    } = query;
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

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
    Object.keys(filters).forEach((k) => {
      if (filters[k] !== undefined && filters[k] !== null && filters[k] !== '') {
        where[k] = filters[k];
      }
    });

    if (search) {
      where[Op.or] = [
        { partyBusinessName: { [Op.iLike]: `%${search}%` } },
        { partyCode: { [Op.iLike]: `%${search}%` } },
        { phoneNumber: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.partyModel.findAndCountAll({
      where,
      limit: limitNum,
      offset,
      order: [[sortBy, sortOrder]],
    });

    return {
      data: rows,
      meta: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    };
  }

  async findOne(uuid: string, currentUser?: any): Promise<ProjectParty> {
    const party = await this.partyModel.findOne({ where: { uuid } });
    if (!party) throw new NotFoundException(`ProjectParty ${uuid} not found`);
    return party;
  }

  async update(
    uuid: string,
    dto: UpdateProjectPartyDto,
    userId?: number,
    currentUser?: any,
  ): Promise<ProjectParty> {
    const party = await this.findOne(uuid);
    return party.update(dto as any);
  }

  async remove(uuid: string, userId?: number, currentUser?: any): Promise<{ message: string }> {
    const party = await this.findOne(uuid);
    await party.destroy();
    return { message: 'ProjectParty deleted successfully' };
  }

  async restore(uuid: string, userId?: number, currentUser?: any): Promise<ProjectParty> {
    const party = await this.partyModel.findOne({ where: { uuid }, paranoid: false });
    if (!party) throw new NotFoundException(`ProjectParty ${uuid} not found`);
    if (!party.deletedAt) throw new BadRequestException('ProjectParty is not deleted');
    await party.restore();
    await party.update({ deletedBy: null, updatedBy: userId ? String(userId) : null } as any);
    return this.findOne(uuid);
  }

  // Summary endpoint for top cards
  async getSummary(projectUuid: string, currentUser?: any) {
    const parties = await this.partyModel.findAll({ where: { projectUuid } });
    
    const totalParties = parties.length;
    const ownersAndInvestors = parties.filter(p => 
      p.partyType === 'Owner' || p.partyType === 'Investor'
    ).length;
    
    let totalEquityShare = 0;
    parties.forEach(p => {
      totalEquityShare += Number(p.equityShare);
    });

    return {
      totalParties,
      totalEquityShare: totalEquityShare.toFixed(2),
      ownersAndInvestors,
    };
  }
}