/* eslint-disable prettier/prettier */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  InjectConnection,
  InjectModel,
} from '@nestjs/sequelize';
import {
  Op,
  Transaction,
  WhereOptions,
} from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Site } from '../../../database/models/projects/project-site/pr_project_site.model';
import { FlatLandBooking } from 'src/database/models/projects/flat-land-booking/pr_flat_land_booking.model';
import { ProjectShareAssignment } from 'src/database/models/projects/project-share-assignment/pr_project_share_assignment.model';
import { ProjectTeamMember } from 'src/database/models/projects/project-team-member/pr_project_team_member.model';
import {
  Project,
  ProjectStatus,
} from '../../../database/models/projects/project/pr_project.model';
import type { ProjectCreationAttributes } from 'src/database/types/project.types';
import { CreateProjectDto } from './dto/create-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateProjectTeamMemberDto } from './dto/create-project-team-member.dto';
import { UpdateProjectTeamMemberDto } from './dto/update-project-team-member.dto';
import { ProjectTeamMemberAttributes } from 'src/database/types/projectteammember.types';
import { FlatLand } from 'src/database/models/projects/flatland/pr_flatland.model';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(Site)
    private readonly siteModel: typeof Site,
    @InjectModel(FlatLandBooking)
    private readonly bookingModel: typeof FlatLandBooking,
    @InjectModel(ProjectShareAssignment)
    private readonly shareAssignmentModel: typeof ProjectShareAssignment,
    @InjectModel(FlatLand)
    private readonly flatLandModel: typeof FlatLand,
    @InjectModel(ProjectTeamMember)
    private readonly projectTeamMemberModel: typeof ProjectTeamMember,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async create(
    dto: CreateProjectDto,
    userId?: number,
  ): Promise<Project> {
    const existing =
      await this.projectModel.findOne({
        where: {
          code: dto.code,
        } as WhereOptions<Project>,
      });
    if (existing) {
      throw new ConflictException(
        `Project code "${dto.code}" already exists`,
      );
    }

    const project =
      await this.sequelize.transaction(
        async (transaction) =>
          this.projectModel.create(
            {
              ...dto,
              startDate: dto.startDate
                ? new Date(dto.startDate)
                : dto.startDate === null
                  ? null
                  : undefined,
              endDate: dto.endDate
                ? new Date(dto.endDate)
                : dto.endDate === null
                  ? null
                  : undefined,
              status:
                dto.status ??
                ProjectStatus.ACTIVE,
              createdBy:
                userId === undefined
                  ? undefined
                  : String(userId),
            },
            { transaction },
          ),
      );
    return this.findOne(project.uuid);
  }

  async findAll(query: QueryProjectDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search?.trim();

    const where: WhereOptions<Project> = search
      ? {
          [Op.or]: [
            {
              code: { [Op.iLike]: `%${search}%` },
            },
            {
              name: { [Op.iLike]: `%${search}%` },
            },
            {
              projectType: {
                [Op.iLike]: `%${search}%`,
              },
            },
            {
              areaCategory: {
                [Op.iLike]: `%${search}%`,
              },
            },
            {
              location: {
                [Op.iLike]: `%${search}%`,
              },
            },
            {
              contactPersonName: {
                [Op.iLike]: `%${search}%`,
              },
            },
            {
              contactPhone: {
                [Op.iLike]: `%${search}%`,
              },
            },
            {
              clientEmail: {
                [Op.iLike]: `%${search}%`,
              },
            },
            {
              contractorCompany: {
                [Op.iLike]: `%${search}%`,
              },
            },
            {
              projectManager: {
                [Op.iLike]: `%${search}%`,
              },
            },
          ],
        }
      : {};

    Object.assign(where, {
      ...(query.projectType && { projectType: query.projectType }),
      ...(query.status && { status: query.status }),
      ...(query.areaCategory && { areaCategory: query.areaCategory }),
      ...(query.numberOfStoreys !== undefined && {
        numberOfStoreys: query.numberOfStoreys,
      }),
    });

    const { rows, count } =
      await this.projectModel.findAndCountAll({
        where: where as WhereOptions<Project>,
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
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findReport(report: 'projects' | 'sites') {
    if (report === 'sites') {
      const rows = await this.siteModel.findAll({
        include: [
          {
            model: this.projectModel,
            as: 'project',
            attributes: ['uuid', 'code', 'name'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });
      return { data: rows };
    }

    const rows = await this.projectModel.findAll({
      order: [['createdAt', 'DESC']],
    });
    return { data: rows };
  }

  async findProjectIncomeReport() {
    const [projects, bookings, assignments] =
      await Promise.all([
        this.projectModel.findAll({
          order: [['createdAt', 'DESC']],
        }),
        this.bookingModel.findAll(),
        this.shareAssignmentModel.findAll(),
      ]);
    const bookingIncome = new Map<
      string,
      number
    >();
    const shareIncome = new Map<string, number>();
    for (const booking of bookings) {
      const amount = Number(booking.paid ?? 0);
      bookingIncome.set(
        booking.projectId,
        (bookingIncome.get(booking.projectId) ??
          0) +
          (Number.isFinite(amount) ? amount : 0),
      );
    }
    for (const assignment of assignments) {
      const amount = Number(
        assignment.paidAmount ?? 0,
      );
      shareIncome.set(
        assignment.projectId,
        (shareIncome.get(assignment.projectId) ??
          0) +
          (Number.isFinite(amount) ? amount : 0),
      );
    }
    return {
      data: projects.map((project) => {
        const flatLandCollection =
          bookingIncome.get(project.uuid) ?? 0;
        const shareCollection =
          shareIncome.get(project.uuid) ?? 0;
        return {
          ...project.get({ plain: true }),
          flatLandCollection,
          shareCollection,
          totalIncome:
            flatLandCollection + shareCollection,
        };
      }),
    };
  }

  async findSiteIncomeReport() {
    const [sites, bookings, assignments] =
      await Promise.all([
        this.siteModel.findAll({
          include: [
            {
              model: this.projectModel,
              as: 'project',
              attributes: [
                'uuid',
                'code',
                'name',
              ],
            },
          ],
        }),
        this.bookingModel.findAll({
          include: [
            {
              model: this.flatLandModel,
              as: 'flatLand',
              attributes: ['siteName'],
            },
          ],
        }),
        this.shareAssignmentModel.findAll(),
      ]);
    const normalize = (value?: string | null) =>
      value?.trim().toLowerCase();
    return {
      data: sites.map((site) => {
        const siteKey = normalize(site.name);
        const siteBookings = bookings.filter(
          (booking) =>
            booking.projectId ===
              site.projectId &&
            normalize(
              booking.flatLand?.siteName,
            ) === siteKey,
        );
        const siteAssignments =
          assignments.filter(
            (assignment) =>
              assignment.projectId ===
                site.projectId &&
              normalize(assignment.site?.name) ===
                siteKey,
          );
        const flatLandCollection =
          siteBookings.reduce(
            (sum, booking) =>
              sum +
              (Number(booking.paid ?? 0) || 0),
            0,
          );
        const shareCollection =
          siteAssignments.reduce(
            (sum, assignment) =>
              sum +
              (Number(
                assignment.paidAmount ?? 0,
              ) || 0),
            0,
          );
        return {
          ...site.get({ plain: true }),
          flatLandCollection,
          shareCollection,
          totalIncome:
            flatLandCollection + shareCollection,
        };
      }),
    };
  }

  async findMembers(projectUuid: string) {
    await this.findOne(projectUuid);
    const where = {
      projectId: projectUuid,
    } as WhereOptions<ProjectTeamMemberAttributes>;

    const members =
      await this.projectTeamMemberModel.findAll({
        where,
        order: [['createdAt', 'ASC']],
      });

    return {
      data: members,
      meta: { total: members.length },
    };
  }

  async createMember(
    projectUuid: string,
    dto: CreateProjectTeamMemberDto,
    userId?: number,
  ) {
    const memberUuid =
      await this.sequelize.transaction(
        async (transaction) => {
          await this.findOne(projectUuid);

          const duplicateWhere = {
            projectId: projectUuid,
            email: dto.email.trim().toLowerCase(),
          } as WhereOptions<ProjectTeamMemberAttributes>;
          const duplicate =
            await this.projectTeamMemberModel.findOne(
              {
                where: duplicateWhere,
                transaction,
              },
            );
          if (duplicate) {
            throw new ConflictException(
              `A project member with email "${dto.email}" already exists`,
            );
          }

          const member =
            await this.projectTeamMemberModel.create(
              {
                projectId: projectUuid,
                name: dto.name.trim(),
                email: dto.email
                  .trim()
                  .toLowerCase(),
                phone: dto.phone?.trim() || null,
                createdBy:
                  userId === undefined
                    ? undefined
                    : String(userId),
              },
              { transaction },
            );
          return member.uuid;
        },
      );

    return this.findMember(
      projectUuid,
      memberUuid,
    );
  }

  async updateMember(
    projectUuid: string,
    memberUuid: string,
    dto: UpdateProjectTeamMemberDto,
    userId?: number,
  ) {
    await this.sequelize.transaction(
      async (transaction) => {
        const member = await this.getMember(
          projectUuid,
          memberUuid,
          transaction,
        );
        const email = dto.email
          ?.trim()
          .toLowerCase();

        if (email && email !== member.email) {
          const duplicateWhere = {
            projectId: projectUuid,
            email,
            uuid: { [Op.ne]: memberUuid },
          } as WhereOptions<ProjectTeamMemberAttributes>;
          const duplicate =
            await this.projectTeamMemberModel.findOne(
              {
                where: duplicateWhere,
                transaction,
              },
            );
          if (duplicate) {
            throw new ConflictException(
              `A project member with email "${email}" already exists`,
            );
          }
        }

        await member.update(
          {
            ...(dto.name !== undefined && {
              name: dto.name.trim(),
            }),
            ...(email !== undefined && { email }),
            ...(dto.phone !== undefined && {
              phone: dto.phone?.trim() || null,
            }),
            updatedBy:
              userId === undefined
                ? undefined
                : String(userId),
          },
          { transaction },
        );
      },
    );

    return this.findMember(
      projectUuid,
      memberUuid,
    );
  }

  async removeMember(
    projectUuid: string,
    memberUuid: string,
  ) {
    const member = await this.getMember(
      projectUuid,
      memberUuid,
    );
    await member.destroy();
    return {
      message: `Project member "${memberUuid}" removed successfully`,
    };
  }

  private async findMember(
    projectUuid: string,
    memberUuid: string,
  ) {
    const member = await this.getMember(
      projectUuid,
      memberUuid,
    );
    return member;
  }

  private async getMember(
    projectUuid: string,
    memberUuid: string,
    transaction?: Transaction,
  ) {
    const where = {
      projectId: projectUuid,
      uuid: memberUuid,
    } as WhereOptions<ProjectTeamMemberAttributes>;
    const member =
      await this.projectTeamMemberModel.findOne({
        where,
        transaction,
      });
    if (!member) {
      throw new NotFoundException(
        `Project member "${memberUuid}" not found`,
      );
    }
    return member;
  }

  async findOne(uuid: string): Promise<Project> {
    const project =
      await this.projectModel.findOne({
        where: { uuid } as WhereOptions<Project>,
      });
    if (!project) {
      throw new NotFoundException(
        `Project "${uuid}" not found`,
      );
    }
    return project;
  }

  async update(
    uuid: string,
    dto: UpdateProjectDto,
    userId?: number,
  ): Promise<Project> {
    await this.sequelize.transaction(
      async (transaction) => {
        const project =
          await this.projectModel.findOne({
            where: {
              uuid,
            } as WhereOptions<Project>,
            transaction,
          });
        if (!project) {
          throw new NotFoundException(
            `Project "${uuid}" not found`,
          );
        }

        if (
          dto.code &&
          dto.code !== project.code
        ) {
          const duplicate =
            await this.projectModel.findOne({
              where: {
                code: dto.code,
                uuid: { [Op.ne]: uuid },
              } as WhereOptions<Project>,
              transaction,
            });
          if (duplicate) {
            throw new ConflictException(
              `Project code "${dto.code}" already exists`,
            );
          }
        }

        const {
          startDate,
          endDate,
          ...projectFields
        } = dto;
        const updateData: Partial<ProjectCreationAttributes> =
          {
            ...projectFields,
            updatedBy:
              userId === undefined
                ? undefined
                : String(userId),
          };
        if (startDate !== undefined) {
          updateData.startDate = startDate
            ? new Date(startDate)
            : null;
        }
        if (endDate !== undefined) {
          updateData.endDate = endDate
            ? new Date(endDate)
            : null;
        }
        await project.update(updateData, {
          transaction,
        });
      },
    );

    return this.findOne(uuid);
  }

  async remove(
    uuid: string,
    userId?: number,
  ): Promise<{ message: string }> {
    const project = await this.findOne(uuid);
    await project.update({
      deletedBy:
        userId === undefined
          ? undefined
          : String(userId),
    });
    await project.destroy();
    return {
      message: `Project "${uuid}" deleted successfully`,
    };
  }

  async restore(uuid: string): Promise<Project> {
    const project =
      await this.projectModel.findOne({
        where: { uuid } as WhereOptions<Project>,
        paranoid: false,
      });
    if (!project) {
      throw new NotFoundException(
        `Project "${uuid}" not found`,
      );
    }
    if (!project.deletedAt) {
      throw new ConflictException(
        `Project "${uuid}" is not deleted`,
      );
    }

    await project.restore();
    return this.findOne(uuid);
  }

  // async getDashboardSummary() {
  //   const [
  //     totalProjects,
  //     completedProjects,
  //     pendingProjects,
  //   ] = await Promise.all([
  //     this.projectModel.count(),
  //     this.projectModel.count({
  //       where: { status: 'COMPLETED' } as any,
  //     }),
  //     this.projectModel.count({
  //       where: { status: 'PENDING' } as any,
  //     }),
  //   ]);

  //   const runningProjects =
  //     totalProjects -
  //     completedProjects -
  //     pendingProjects;
  //   if (runningProjects < 0) {
  //     // fallback
  //   }

  //   let materialRequisitions = 0;
  //   let serviceRequisitions = 0;
  //   let unsoldFlatLand = 0;
  //   let totalTasks = 0;

  //   try {
  //     const MaterialRequisition = (
  //       await import('src/database/models/projects/material-requisition/pr_material_requisition.model')
  //     ).MaterialRequisition;
  //     materialRequisitions =
  //       await MaterialRequisition.count();
  //   } catch {}

  //   try {
  //     const ServiceWorkRequisition = (
  //       await import('src/database/models/projects/service-work-requisition/pr_service_work_requisition.model')
  //     ).ServiceWorkRequisition;
  //     serviceRequisitions =
  //       await ServiceWorkRequisition.count();
  //   } catch {}

  //   try {
  //     const Task = (
  //       await import('src/database/models/projects/task/pr_task.model')
  //     ).Task;
  //     totalTasks = await Task.count();
  //   } catch {}

  //   try {
  //     const FlatLand = (
  //       await import('src/database/models/projects/flatland/pr_flatland.model')
  //     ).FlatLand;
  //     unsoldFlatLand = await FlatLand.count({
  //       where: { status: 'Available' } as any,
  //     });
  //   } catch {}

  //   const recentProjects =
  //     await this.projectModel.findAll({
  //       limit: 4,
  //       order: [['createdAt', 'DESC']],
  //       attributes: [
  //         'uuid',
  //         'name',
  //         'status',
  //         'progressPercentage',
  //         'startDate',
  //         'endDate',
  //         'totalBudget',
  //       ],
  //     });

  //   return {
  //     totalProjects,
  //     totalTasks,
  //     completedProjects,
  //     pendingProjects,
  //     runningProjects:
  //       runningProjects > 0
  //         ? runningProjects
  //         : totalProjects,
  //     materialRequisitions,
  //     serviceRequisitions,
  //     unsoldFlatLand,

  //     projectStats: [
  //       {
  //         month: 'Rifat Eyecon City',
  //         projects: 0,
  //       },
  //       { month: 'Hena Heights', projects: 0 },
  //       {
  //         month: 'Sheba Eyecon Tower',
  //         projects: 2,
  //       },
  //       { month: 'Estern 19', projects: 0 },
  //     ],
  //     projectStatus: [
  //       {
  //         name: 'On Track',
  //         value: totalProjects,
  //       },
  //       { name: 'At Risk', value: 0 },
  //       { name: 'In Trouble', value: 0 },
  //     ],
  //     recentProjects: recentProjects.map(
  //       (p: any, idx: number) => ({
  //         id: idx + 1,
  //         name: p.name,
  //         status:
  //           p.status === 'COMPLETED'
  //             ? 'Completed'
  //             : p.status === 'PENDING'
  //               ? 'Pending'
  //               : p.status === 'ACTIVE'
  //                 ? 'On Track'
  //                 : (p.status ?? 'On Track'),
  //         progress: p.progressPercentage ?? 0,
  //         duration:
  //           p.startDate && p.endDate
  //             ? `${Math.max(0, Math.ceil((new Date(p.endDate).getTime() - new Date(p.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30)))} Months`
  //             : '0 Months',
  //         membersCount: 0,
  //         totalTasks: 0,
  //         completedTasks: 0,
  //         budgetProgress: 0,
  //         href: `/dashboard/project/dashboard/${p.uuid}`,
  //       }),
  //     ),
  //   };
  // }
}
