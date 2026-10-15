/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ProjectBillingRecord, ProjectBillingResource } from 'src/database/models/projects/billing/pr_project_billing_record.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { CreateProjectBillingRecordDto } from './dto/create-project-billing-record.dto';
import { QueryProjectBillingRecordDto } from './dto/query-project-billing-record.dto';
import { UpdateProjectBillingRecordDto } from './dto/update-project-billing-record.dto';

@Injectable()
export class ProjectBillingRecordService {
  constructor(
    @InjectModel(ProjectBillingRecord)
    private readonly recordModel: typeof ProjectBillingRecord,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  private validateResource(resource: string): ProjectBillingResource {
    if (!Object.values(ProjectBillingResource).includes(resource as ProjectBillingResource)) {
      throw new BadRequestException(`Unknown project billing resource "${resource}"`);
    }
    return resource as ProjectBillingResource;
  }

  async create(resourceName: string, dto: CreateProjectBillingRecordDto, userId?: number) {
    const resource = this.validateResource(resourceName);
    const uuid = await this.sequelize.transaction(async (transaction) => {
      const project = await this.projectModel.findOne({
        where: { uuid: dto.projectId } as WhereOptions<Project>,
        transaction,
      });
      if (!project) {
        throw new BadRequestException(`Project "${dto.projectId}" not found`);
      }
      const record = await this.recordModel.create(
        {
          ...dto,
          resource,
          recordDate: dto.recordDate ? new Date(dto.recordDate) : undefined,
          amount: dto.amount ?? 0,
          status: dto.status ?? 'active',
          details: dto.details ?? {},
          createdBy: userId === undefined ? undefined : String(userId),
        },
        { transaction },
      );
      return record.uuid;
    });
    return this.findOne(resource, uuid);
  }

  async findAll(resourceName: string, query: QueryProjectBillingRecordDto) {
    const resource = this.validateResource(resourceName);
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search?.trim();
    const where: WhereOptions<ProjectBillingRecord> = {
      resource,
      ...(search
        ? {
            [Op.or]: [
              { code: { [Op.iLike]: `%${search}%` } },
              { title: { [Op.iLike]: `%${search}%` } },
              { description: { [Op.iLike]: `%${search}%` } },
            ],
          }
        : {}),
    };
    const { rows, count } = await this.recordModel.findAndCountAll({
      where: where as WhereOptions<ProjectBillingRecord>,
      include: [
        { model: this.projectModel, as: 'project', attributes: ['uuid', 'code', 'name'] },
      ],
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });
    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  }

  async findOne(resourceName: string, uuid: string) {
    const resource = this.validateResource(resourceName);
    const record = await this.recordModel.findOne({
      where: { uuid, resource } as WhereOptions<ProjectBillingRecord>,
      include: [
        { model: this.projectModel, as: 'project', attributes: ['uuid', 'code', 'name'] },
      ],
    });
    if (!record) {
      throw new NotFoundException(`Billing record "${uuid}" not found`);
    }
    return record;
  }

  async update(
    resourceName: string,
    uuid: string,
    dto: UpdateProjectBillingRecordDto,
    userId?: number,
  ) {
    const resource = this.validateResource(resourceName);
    await this.sequelize.transaction(async (transaction) => {
      const record = await this.recordModel.findOne({
        where: { uuid, resource } as WhereOptions<ProjectBillingRecord>,
        transaction,
      });
      if (!record) {
        throw new NotFoundException(`Billing record "${uuid}" not found`);
      }
      if (dto.projectId) {
        const project = await this.projectModel.findOne({
          where: { uuid: dto.projectId } as WhereOptions<Project>,
          transaction,
        });
        if (!project) {
          throw new BadRequestException(`Project "${dto.projectId}" not found`);
        }
      }
      const { recordDate, ...recordFields } = dto;
      await record.update(
        {
          ...recordFields,
          ...(recordDate !== undefined
            ? { recordDate: recordDate ? new Date(recordDate) : null }
            : {}),
          updatedBy: userId === undefined ? undefined : String(userId),
        },
        { transaction },
      );
    });
    return this.findOne(resource, uuid);
  }

  async remove(resourceName: string, uuid: string) {
    const resource = this.validateResource(resourceName);
    const record = await this.recordModel.findOne({
      where: { uuid, resource } as WhereOptions<ProjectBillingRecord>,
    });
    if (!record) {
      throw new NotFoundException(`Billing record "${uuid}" not found`);
    }
    await record.destroy();
    return { message: `Billing record "${uuid}" deleted successfully` };
  }
}
