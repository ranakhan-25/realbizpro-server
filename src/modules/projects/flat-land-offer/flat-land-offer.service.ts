import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { FlatLand } from 'src/database/models/projects/flatland/pr_flatland.model';
import { FlatLandOffer } from 'src/database/models/projects/flat-land-offer/pr_flat_land_offer.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectTeamMember } from 'src/database/models/projects/project-team-member/pr_project_team_member.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { CreateFlatLandOfferDto } from './dto/create-flat-land-offer.dto';
import { QueryFlatLandOfferDto } from './dto/query-flat-land-offer.dto';
import { UpdateFlatLandOfferDto } from './dto/update-flat-land-offer.dto';

@Injectable()
export class FlatLandOfferService {
  constructor(
    @InjectModel(FlatLandOffer)
    private readonly offerModel: typeof FlatLandOffer,
    @InjectModel(FlatLand)
    private readonly flatLandModel: typeof FlatLand,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(ProjectTeamMember) private readonly teamMembers: typeof ProjectTeamMember,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async create(dto: CreateFlatLandOfferDto, userId?: number, currentUser?: any) {
    const uuid = await this.sequelize.transaction(async (transaction) => {
      let project = dto.projectId
        ? await this.projectModel.findOne({
            where: { uuid: dto.projectId } as WhereOptions<Project>,
            transaction,
          })
        : await this.projectModel.findOne({ transaction });

      if (!project) {
        project = await this.projectModel.create(
          {
            code: 'PRJ-MAIN',
            name: 'Main Real Estate Project',
            status: 'ACTIVE',
          } as any,
          { transaction },
        );
      }

      let propertyId = dto.flatLandId;
      if (propertyId) {
        const property = await this.flatLandModel.findOne({
          where: { uuid: propertyId } as WhereOptions<FlatLand>,
          transaction,
        });
        if (!property) {
          propertyId = undefined;
        }
      }
      const offer = await this.offerModel.create(
        {
          ...dto,
          projectId: project.uuid,
          flatLandId: propertyId || null,
          offerDate: new Date(dto.offerDate),
          rate: dto.rate ?? 0,
          otherCost: dto.otherCost ?? 0,
          parking: dto.parking ?? 0,
          utilityCharge: dto.utilityCharge ?? 0,
          discount: dto.discount ?? 0,
          subtotal: dto.subtotal ?? 0,
          grandTotal: dto.grandTotal ?? 0,
          paid: dto.paid ?? 0,
          due: dto.due ?? 0,
          createdBy: userId === undefined ? undefined : String(userId),
        },
        { transaction },
      );
      return offer.uuid;
    });
    return this.findOne(uuid);
  }

  async findAll(
    query: QueryFlatLandOfferDto,
    currentUser?: any,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search?.trim();
    const userConditions = currentUser ? [
      { createdBy: currentUser.email },
      { createdBy: String(currentUser.id) },
    ] : [];

    const where: any = {
      ...(userConditions.length > 0 ? { [Op.or]: userConditions } : {}),
      ...(query.projectId ? { projectId: query.projectId } : {}),
      ...(query.salesBy ? { salesBy: { [Op.iLike]: `%${query.salesBy.trim()}%` } } : {}),
      ...(query.dateFrom || query.dateTo ? { offerDate: { ...(query.dateFrom ? { [Op.gte]: query.dateFrom } : {}), ...(query.dateTo ? { [Op.lte]: query.dateTo } : {}) } } : {}),
      ...(search ? { [Op.or]: [
            { code: { [Op.iLike]: `%${search}%` } },
            { customerName: { [Op.iLike]: `%${search}%` } },
            { salesBy: { [Op.iLike]: `%${search}%` } },
          ] } : {}),
    };
    if (query.teamId) {
      const teamMember = await this.teamMembers.findOne({ where: { uuid: query.teamId } as WhereOptions<ProjectTeamMember>, attributes: ['projectId'] });
      if (!teamMember) return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
      Object.assign(where, { projectId: teamMember.projectId });
    }
    const { rows, count } = await this.offerModel.findAndCountAll({
      where: where as WhereOptions<FlatLandOffer>,
      include: [
        { model: this.projectModel, as: 'project', attributes: ['uuid', 'code', 'name'], include: [{ association: 'sites', attributes: ['uuid', 'code', 'name'], required: false }] },
        { model: this.flatLandModel, as: 'flatLand', attributes: ['uuid', 'flatLandNo'] },
      ],
      limit,
      offset: (page - 1) * limit,
      order: [['offerDate', 'DESC']],
    });
    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  }

  async dropdowns() {
    const [projects, properties, statuses, teams, salesPeople] = await Promise.all([
      this.projectModel.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
      this.flatLandModel.findAll({ attributes: ['uuid', 'flatLandNo', 'propertyType', 'projectId', 'projectName'], order: [['flatLandNo', 'ASC']] }),
      this.offerModel.findAll({ attributes: ['approvalStatus'], group: ['approvalStatus'], order: [['approvalStatus', 'ASC']] }),
      this.teamMembers.findAll({ attributes: ['uuid', 'name', 'email', 'projectId'], order: [['name', 'ASC']] }),
      this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'userCode', 'name'], order: [['name', 'ASC']] }),
    ]);
    return { projects, properties, teams, salesPeople, statuses: statuses.map(row => ({ value: row.approvalStatus ?? '', name: row.approvalStatus ?? 'Not set' })) };
  }

  async findOne(uuid: string, currentUser?: any) {
    const offer = await this.offerModel.findOne({
      where: { uuid } as WhereOptions<FlatLandOffer>,
      include: [
        { model: this.projectModel, as: 'project', attributes: ['uuid', 'code', 'name'], include: [{ association: 'sites', attributes: ['uuid', 'code', 'name'], required: false }] },
        { model: this.flatLandModel, as: 'flatLand', attributes: ['uuid', 'flatLandNo'] },
      ],
    });
    if (!offer) {
      throw new NotFoundException(`Flat/Land offer "${uuid}" not found`);
    }
    return offer;
  }

  async update(uuid: string, dto: UpdateFlatLandOfferDto, userId?: number, currentUser?: any) {
    await this.sequelize.transaction(async (transaction) => {
      const offer = await this.offerModel.findOne({
        where: { uuid } as WhereOptions<FlatLandOffer>,
        transaction,
      });
      if (!offer) {
        throw new NotFoundException(`Flat/Land offer "${uuid}" not found`);
      }
      const projectId = dto.projectId ?? offer.projectId;
      const flatLandId = dto.flatLandId ?? offer.flatLandId;
      if (dto.projectId) {
        const project = await this.projectModel.findOne({
          where: { uuid: projectId } as WhereOptions<Project>,
          transaction,
        });
        if (!project) {
          throw new BadRequestException(`Project "${projectId}" not found`);
        }
      }
      if (flatLandId) {
        const property = await this.flatLandModel.findOne({
          where: { uuid: flatLandId } as WhereOptions<FlatLand>,
          transaction,
        });
        if (!property || property.projectId !== projectId) {
          throw new BadRequestException('Flat/land does not belong to the selected project');
        }
      }
      const { offerDate, ...offerFields } = dto;
      await offer.update(
        {
          ...offerFields,
          ...(offerDate ? { offerDate: new Date(offerDate) } : {}),
          updatedBy: userId === undefined ? undefined : String(userId),
        },
        { transaction },
      );
    });
    return this.findOne(uuid);
  }

  async remove(uuid: string, userId?: number, currentUser?: any) {
    const offer = await this.offerModel.findOne({
      where: { uuid } as WhereOptions<FlatLandOffer>,
    });
    if (!offer) {
      throw new NotFoundException(`Flat/Land offer "${uuid}" not found`);
    }
    await offer.destroy();
    return { message: `Flat/Land offer "${uuid}" deleted successfully` };
  }

  async restore(uuid: string, userId?: number, currentUser?: any) {
    const offer = await this.offerModel.findOne({ where: { uuid } as WhereOptions<FlatLandOffer>, paranoid: false });
    if (!offer) throw new NotFoundException(`Flat/Land offer "${uuid}" not found`);
    if (!offer.deletedAt) throw new BadRequestException(`Flat/Land offer "${uuid}" is not deleted`);
    await offer.restore();
    return this.findOne(uuid);
  }
}
