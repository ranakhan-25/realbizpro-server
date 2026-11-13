import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { LandOwner } from '../../../database/models/lams/land-owner.model';
import { CreateLandOwnerDto } from './dto/create-land-owner.dto';
import { UpdateLandOwnerDto } from './dto/update-land-owner.dto';

@Injectable()
export class LandOwnerService {
  constructor(
    @InjectModel(LandOwner)
    private readonly landOwnerModel: typeof LandOwner,
  ) {}

  async create(createDto: CreateLandOwnerDto, user?: any): Promise<LandOwner> {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id || createDto.org_id;
    if (!orgId) {
      throw new BadRequestException('Organization identifier (org_id) is mandatory');
    }

    return await this.landOwnerModel.create({
      ...createDto,
      org_id: orgId,
      created_by: user?.id,
    } as any);
  }

  async findAll(filter?: {
    org_id?: string;
    lead_id?: string;
    has_nid?: boolean;
    search?: string;
  }): Promise<LandOwner[]> {
    const where: any = {};

    if (filter?.org_id) {
      where.org_id = filter.org_id;
    }
    if (filter?.lead_id) {
      where.lead_id = filter.lead_id;
    }
    if (filter?.has_nid) {
      where.nid_number = { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: '' }] };
    }
    if (filter?.search) {
      const term = `%${filter.search}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: term } },
        { contact_number: { [Op.iLike]: term } },
        { email: { [Op.iLike]: term } },
        { nid_number: { [Op.iLike]: term } },
      ];
    }

    return await this.landOwnerModel.findAll({
      where,
      include: [
        { association: 'acquisition_lead', required: false },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(uuid: string, orgId?: string): Promise<LandOwner> {
    const where: any = { id: uuid };
    if (orgId) {
      where.org_id = orgId;
    }

    const owner = await this.landOwnerModel.findOne({
      where,
      include: [
        { association: 'acquisition_lead', required: false },
      ],
    });
    if (!owner) throw new NotFoundException('Land Owner not found');
    return owner;
  }

  async update(uuid: string, updateDto: UpdateLandOwnerDto, user?: any): Promise<LandOwner> {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id;
    const owner = await this.findOne(uuid, orgId);
    await owner.update(updateDto as any);
    return owner;
  }

  async remove(uuid: string, user?: any): Promise<void> {
    const orgId = user?.orgId || user?.orgUuid || user?.org_id;
    const owner = await this.findOne(uuid, orgId);
    await owner.destroy();
  }
}
