/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ProjectAgreement } from 'src/database/models/projects/project_aggrement/pr_project_aggrement_model';
import { CreateProjectAgreementDto } from './dto/create-project_aggrement.dto';
import { UpdateProjectAgreementDto } from './dto/update-project_aggrement.dto';
import { QueryProjectAgreementDto } from './dto/query-project_aggrement.dto';

@Injectable()
export class ProjectAgreementService {
  constructor(
    @InjectModel(ProjectAgreement)
    private readonly agreementModel: typeof ProjectAgreement,
    // ❌ ProjectParty মডেল ইনজেক্ট করা হলো না
  ) {}

  async create(dto: CreateProjectAgreementDto): Promise<ProjectAgreement> {
    try {
      // ❌ এখানে কোনো partyModel.findOne() নেই
      return await this.agreementModel.create({
        ...dto,
        signedDate: new Date(dto.signedDate),
        startDate: new Date(dto.startDate),
        ...(dto.endDate ? { endDate: new Date(dto.endDate) } : {}),
      } as any);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException('Agreement code already exists.');
      }
      throw error;
    }
  }

  async findAll(query: QueryProjectAgreementDto) {
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
        { agreementCode: { [Op.iLike]: `%${search}%` } },
        { notes: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // ❌ কোনো include নেই
    const { rows, count } = await this.agreementModel.findAndCountAll({
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

  async findOne(uuid: string): Promise<ProjectAgreement> {
    // ❌ কোনো include নেই
    const agreement = await this.agreementModel.findOne({ where: { uuid } });
    if (!agreement) throw new NotFoundException(`Agreement ${uuid} not found`);
    return agreement;
  }

  async update(uuid: string, dto: UpdateProjectAgreementDto): Promise<ProjectAgreement> {
    const agreement = await this.findOne(uuid);
    
    const updateData: any = { ...dto };
    if (dto.signedDate) updateData.signedDate = new Date(dto.signedDate);
    if (dto.startDate) updateData.startDate = new Date(dto.startDate);
    if (dto.endDate) updateData.endDate = new Date(dto.endDate);

    await agreement.update(updateData);
    return this.findOne(uuid);
  }

  async remove(uuid: string): Promise<{ message: string }> {
    const agreement = await this.findOne(uuid);
    await agreement.destroy();
    return { message: 'Agreement deleted successfully' };
  }

  async restore(uuid: string): Promise<ProjectAgreement> {
    const agreement = await this.agreementModel.findOne({ where: { uuid }, paranoid: false });
    if (!agreement) throw new NotFoundException(`Agreement ${uuid} not found`);
    if (!agreement.deletedAt) throw new BadRequestException('Agreement is not deleted');
    await agreement.restore();
    return this.findOne(uuid);
  }
}