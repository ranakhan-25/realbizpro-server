/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  InjectConnection,
  InjectModel,
} from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectType } from 'src/database/models/projects/project-type/pr_project_type.model';
import { Site } from 'src/database/models/projects/project-site/pr_project_site.model';
import { ProjectShareAssignment } from 'src/database/models/projects/project-share-assignment/pr_project_share_assignment.model';
import { CreateProjectShareAssignmentDto } from './dto/create-project-share-assignment.dto';
import { QueryProjectShareAssignmentDto } from './dto/query-project-share-assignment.dto';
import { UpdateProjectShareAssignmentDto } from './dto/update-project-share-assignment.dto';

@Injectable()
export class ProjectShareAssignmentService {
  constructor(
    @InjectModel(ProjectShareAssignment)
    private readonly assignmentModel: typeof ProjectShareAssignment,

    @InjectModel(Project)
    private readonly projectModel: typeof Project,

    @InjectModel(ProjectType)
    private readonly projectTypeModel: typeof ProjectType,

    @InjectModel(Site)
    private readonly siteModel: typeof Site,

    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async create(
    dto: CreateProjectShareAssignmentDto,
    userId?: number,
    currentUser?: any,
  ) {
    const uuid = await this.sequelize.transaction(
      async (transaction) => {
        // Project check
        const project =
          await this.projectModel.findOne({
            where: {
              uuid: dto.projectId,
            } as WhereOptions<Project>,
            transaction,
          });
        if (!project) {
          throw new BadRequestException(
            `Project "${dto.projectId}" not found`,
          );
        }

        // ProjectType check
        if (dto.projectTypeId) {
          const projectType =
            await this.projectTypeModel.findOne({
              where: {
                uuid: dto.projectTypeId,
              } as WhereOptions<ProjectType>,
              transaction,
            });
          if (!projectType) {
            throw new BadRequestException(
              `ProjectType "${dto.projectTypeId}" not found`,
            );
          }
        }

        // Site check
        if (dto.siteId) {
          const site =
            await this.siteModel.findOne({
              where: {
                uuid: dto.siteId,
              } as WhereOptions<Site>,
              transaction,
            });
          if (!site) {
            throw new BadRequestException(
              `Site "${dto.siteId}" not found`,
            );
          }
        }

        // shareCode unique check (only when manually provided)
        if (dto.shareCode) {
          const existing =
            await this.assignmentModel.findOne({
              where: {
                shareCode: dto.shareCode,
              } as WhereOptions<ProjectShareAssignment>,
              transaction,
            });
          if (existing) {
            throw new ConflictException(
              `Share code "${dto.shareCode}" already exists`,
            );
          }
        }

        const { assignedAt, ...rest } = dto;

        const assignment =
          await this.assignmentModel.create(
            {
              ...rest,
              ...(assignedAt
                ? {
                    assignedAt: new Date(
                      assignedAt,
                    ),
                  }
                : {}),
              noOfShares: dto.noOfShares ?? 0,
              shareAmount: dto.shareAmount ?? 0,
              paidAmount: dto.paidAmount ?? 0,
              totalCost: dto.totalCost ?? 0,
              balance: dto.balance ?? 0,
              due: dto.due ?? 0,
              penaltyAmount:
                dto.penaltyAmount ?? 0,
              points: dto.points ?? 0,
              createdBy:
                currentUser?.email ||
                (userId !== undefined
                  ? String(userId)
                  : undefined),
            },
            { transaction },
          );

        return assignment.uuid;
      },
    );

    return this.findOne(uuid);
  }

  async findAll(
    query: QueryProjectShareAssignmentDto,
    currentUser?: any,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search?.trim();

    const where: any = {};
    if (currentUser?.email) {
      where.createdBy = currentUser.email;
    }
    if ((query as any)?.orgId) {
      where.orgId = (query as any).orgId;
    }
    if ((query as any)?.projectId) {
      where.projectId = (query as any).projectId;
    }

    if (query.projectId)
      where.projectId = query.projectId;
    if (query.projectTypeId)
      where.projectTypeId = query.projectTypeId;
    if (query.siteId) where.siteId = query.siteId;

    if (search) {
      Object.assign(where, {
        [Op.or]: [
          {
            shareCode: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            customerName: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            mobile: { [Op.iLike]: `%${search}%` },
          },
          { nid: { [Op.iLike]: `%${search}%` } },
        ],
      });
    }

    const { rows, count } =
      await this.assignmentModel.findAndCountAll({
        where,
        include: [
          {
            model: this.projectModel,
            as: 'project',
            attributes: ['uuid', 'code', 'name'],
            required: false,
          },
          {
            model: this.projectTypeModel,
            as: 'projectType',
            attributes: ['uuid', 'code', 'name'],
            required: false,
          },
          {
            model: this.siteModel,
            as: 'site',
            attributes: [
              'uuid',
              'code',
              'name',
              'location',
            ],
            required: false,
          },
        ],
        limit,
        offset: (page - 1) * limit,
        order: [['createdAt', 'DESC']],
      });

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit) || 1,
      },
    };
  }

  async findOne(uuid: string, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.email) {
      where.createdBy = currentUser.email;
    }
    const assignment =
      await this.assignmentModel.findOne({
        where: where as WhereOptions<ProjectShareAssignment>,
        include: [
          {
            model: this.projectModel,
            as: 'project',
            attributes: ['uuid', 'code', 'name'],
          },
          {
            model: this.projectTypeModel,
            as: 'projectType',
            attributes: ['uuid', 'code', 'name'],
          },
          {
            model: this.siteModel,
            as: 'site',
            attributes: [
              'uuid',
              'code',
              'name',
              'location',
            ],
          },
        ],
      });

    if (!assignment) {
      throw new NotFoundException(
        `Share assignment "${uuid}" not found`,
      );
    }
    return assignment;
  }

  async dropdowns() {
    const [projects, projectTypes, sites] = await Promise.all([
      this.projectModel.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.projectTypeModel.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.siteModel.findAll({ attributes: ['uuid', 'code', 'name', 'projectId'], order: [['name', 'ASC']] }),
    ]);
    return { projects, projectTypes, sites, statuses: ['active', 'inactive', 'pending'].map(value => ({ value, name: value })) };
  }

  async update(
    uuid: string,
    dto: UpdateProjectShareAssignmentDto,
    userId?: number,
    currentUser?: any,
  ) {
    await this.sequelize.transaction(
      async (transaction) => {
        const where: any = { uuid };
        if (currentUser?.email) {
          where.createdBy = currentUser.email;
        }
        const assignment =
          await this.assignmentModel.findOne({
            where: where as WhereOptions<ProjectShareAssignment>,
            transaction,
          });
        if (!assignment) {
          throw new NotFoundException(
            `Share assignment "${uuid}" not found`,
          );
        }

        if (dto.projectId) {
          const project =
            await this.projectModel.findOne({
              where: {
                uuid: dto.projectId,
              } as WhereOptions<Project>,
              transaction,
            });
          if (!project) {
            throw new BadRequestException(
              `Project "${dto.projectId}" not found`,
            );
          }
        }

        if (dto.projectTypeId) {
          const projectType =
            await this.projectTypeModel.findOne({
              where: {
                uuid: dto.projectTypeId,
              } as WhereOptions<ProjectType>,
              transaction,
            });
          if (!projectType) {
            throw new BadRequestException(
              `ProjectType "${dto.projectTypeId}" not found`,
            );
          }
        }

        if (dto.siteId) {
          const site =
            await this.siteModel.findOne({
              where: {
                uuid: dto.siteId,
              } as WhereOptions<Site>,
              transaction,
            });
          if (!site) {
            throw new BadRequestException(
              `Site "${dto.siteId}" not found`,
            );
          }
        }

        if (
          dto.shareCode &&
          dto.shareCode !== assignment.shareCode
        ) {
          const duplicate =
            await this.assignmentModel.findOne({
              where: {
                shareCode: dto.shareCode,
                uuid: { [Op.ne]: uuid },
              } as WhereOptions<ProjectShareAssignment>,
              transaction,
            });
          if (duplicate) {
            throw new ConflictException(
              `Share code "${dto.shareCode}" already exists`,
            );
          }
        }

        const { assignedAt, ...rest } = dto;

        await assignment.update(
          {
            ...rest,
            ...(assignedAt
              ? {
                  assignedAt: new Date(
                    assignedAt,
                  ),
                }
              : {}),
            updatedBy:
              userId !== undefined
                ? String(userId)
                : undefined,
          },
          { transaction },
        );
      },
    );

    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.email) {
      where.createdBy = currentUser.email;
    }
    const assignment =
      await this.assignmentModel.findOne({
        where: where as WhereOptions<ProjectShareAssignment>,
      });
    if (!assignment) {
      throw new NotFoundException(
        `Share assignment "${uuid}" not found`,
      );
    }
    await assignment.destroy();
    return {
      message: `Share assignment "${uuid}" deleted successfully`,
    };
  }

  async restore(uuid: string, userId?: number, currentUser?: any) {
    const assignment = await this.assignmentModel.findOne({ where: { uuid } as WhereOptions<ProjectShareAssignment>, paranoid: false });
    if (!assignment) throw new NotFoundException(`Share assignment "${uuid}" not found`);
    if (!assignment.deletedAt) throw new BadRequestException(`Share assignment "${uuid}" is not deleted`);
    await assignment.restore();
    return this.findOne(uuid);
  }

  async findReport(
    kind:
      'collection' | 'penalty' | 'holders-point',
    currentUser?: any,
  ) {
    const criteria: WhereOptions<ProjectShareAssignment> =
      kind === 'collection'
        ? { paidAmount: { [Op.gt]: 0 } }
        : kind === 'penalty'
          ? { penaltyAmount: { [Op.gt]: 0 } }
          : {};

    return this.assignmentModel.findAll({
      where: criteria,
      include: [
        {
          model: this.projectModel,
          as: 'project',
          attributes: ['uuid', 'code', 'name'],
        },
        {
          model: this.projectTypeModel,
          as: 'projectType',
          attributes: ['uuid', 'code', 'name'],
        },
        {
          model: this.siteModel,
          as: 'site',
          attributes: [
            'uuid',
            'code',
            'name',
            'location',
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }
}
