import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { FlatLand } from 'src/database/models/projects/flatland/pr_flatland.model';
import { FlatLandOffer } from 'src/database/models/projects/flat-land-offer/pr_flat_land_offer.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
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
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async create(dto: CreateFlatLandOfferDto, userId?: number) {
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

      if (dto.flatLandId) {
        const property = await this.flatLandModel.findOne({
          where: { uuid: dto.flatLandId } as WhereOptions<FlatLand>,
          transaction,
        });
        if (!property || (dto.projectId && property.projectId !== dto.projectId)) {
          throw new BadRequestException('Flat/land does not belong to the selected project');
        }
      }
      const offer = await this.offerModel.create(
        {
          ...dto,
          projectId: project.uuid,
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

  async findAll(query: QueryFlatLandOfferDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search?.trim();
    const where: WhereOptions<FlatLandOffer> = search
      ? {
          [Op.or]: [
            { code: { [Op.iLike]: `%${search}%` } },
            { customerName: { [Op.iLike]: `%${search}%` } },
            { salesBy: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};
    const { rows, count } = await this.offerModel.findAndCountAll({
      where: where as WhereOptions<FlatLandOffer>,
      include: [
        { model: this.projectModel, as: 'project', attributes: ['uuid', 'code', 'name'] },
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

  async findOne(uuid: string) {
    const offer = await this.offerModel.findOne({
      where: { uuid } as WhereOptions<FlatLandOffer>,
      include: [
        { model: this.projectModel, as: 'project', attributes: ['uuid', 'code', 'name'] },
        { model: this.flatLandModel, as: 'flatLand', attributes: ['uuid', 'flatLandNo'] },
      ],
    });
    if (!offer) {
      throw new NotFoundException(`Flat/Land offer "${uuid}" not found`);
    }
    return offer;
  }

  async update(uuid: string, dto: UpdateFlatLandOfferDto, userId?: number) {
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

  async remove(uuid: string) {
    const offer = await this.offerModel.findOne({
      where: { uuid } as WhereOptions<FlatLandOffer>,
    });
    if (!offer) {
      throw new NotFoundException(`Flat/Land offer "${uuid}" not found`);
    }
    await offer.destroy();
    return { message: `Flat/Land offer "${uuid}" deleted successfully` };
  }
}
