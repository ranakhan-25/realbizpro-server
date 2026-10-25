import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { LeadPriceRange } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { CreatePriceRangeDto } from './dto/create-price-range.dto';
import { QueryPriceRangeDto } from './dto/query-price-range.dto';
import { UpdatePriceRangeDto } from './dto/update-price-range.dto';

@Injectable()
export class PriceRangeService {
  constructor(@InjectModel(LeadPriceRange) private readonly ranges: typeof LeadPriceRange) {}

  async create(dto: CreatePriceRangeDto) {
    this.assertValidRange(dto.fromPrice, dto.toPrice);
    await this.assertUniqueRange(dto.fromPrice, dto.toPrice);
    const row = await this.ranges.create({
      name: this.makeName(dto.fromPrice, dto.toPrice),
      minPrice: dto.fromPrice,
      maxPrice: dto.toPrice,
    });
    return this.findOne(row.uuid);
  }

  async findAll(query: QueryPriceRangeDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    const term = query.search?.trim();
    if (term) {
      const amount = Number(term);
      where[Op.or] = [
        ...(Number.isFinite(amount) ? [{ minPrice: amount }, { maxPrice: amount }] : []),
        { name: { [Op.iLike]: `%${term}%` } },
      ];
    }
    const { rows, count } = await this.ranges.findAndCountAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
      paranoid: !query.withDeleted,
    });
    return {
      data: rows.map(row => this.toPublicRange(row)),
      meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 },
    };
  }

  async findOne(uuid: string) {
    const row = await this.ranges.findOne({
      where: { uuid },
      include: [{ association: 'leads', attributes: ['uuid', 'leadCode', 'clientName'], required: false }],
    });
    if (!row) throw new NotFoundException(`Price range ${uuid} not found`);
    const data = this.toPublicRange(row);
    data.leads = (row.leads ?? []).map(lead => ({ uuid: lead.uuid, leadCode: lead.leadCode, clientName: lead.clientName }));
    return data;
  }

  async update(uuid: string, dto: UpdatePriceRangeDto) {
    const row = await this.ranges.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Price range ${uuid} not found`);
    const fromPrice = dto.fromPrice ?? (row.minPrice === null ? undefined : Number(row.minPrice));
    const toPrice = dto.toPrice ?? (row.maxPrice === null ? undefined : Number(row.maxPrice));
    if (fromPrice === undefined || toPrice === undefined) {
      throw new BadRequestException('Both From Price and To Price are required to update this range');
    }
    this.assertValidRange(fromPrice, toPrice);
    await this.assertUniqueRange(fromPrice, toPrice, uuid);
    await row.update({ minPrice: fromPrice, maxPrice: toPrice, name: this.makeName(fromPrice, toPrice) });
    return this.findOne(uuid);
  }

  async remove(uuid: string) {
    const row = await this.ranges.findOne({ where: { uuid } });
    if (!row) throw new NotFoundException(`Price range ${uuid} not found`);
    await row.destroy();
    return { message: `Price range ${uuid} deleted successfully` };
  }

  async restore(uuid: string) {
    const row = await this.ranges.findOne({ where: { uuid }, paranoid: false });
    if (!row) throw new NotFoundException(`Price range ${uuid} not found`);
    if (!row.deletedAt) throw new BadRequestException(`Price range ${uuid} is not deleted`);
    await row.restore();
    return this.findOne(uuid);
  }

  async dropdown() {
    const rows = await this.ranges.findAll({ attributes: ['uuid', 'minPrice', 'maxPrice'], order: [['minPrice', 'ASC']] });
    return rows.map(row => this.toPublicRange(row));
  }

  private async assertUniqueRange(fromPrice: number, toPrice: number, excludeUuid?: string) {
    const exists = await this.ranges.findOne({
      where: {
        minPrice: fromPrice,
        maxPrice: toPrice,
        ...(excludeUuid ? { uuid: { [Op.ne]: excludeUuid } } : {}),
      } as any,
      paranoid: false,
      attributes: ['uuid'],
    });
    if (exists) throw new ConflictException('A price range with the same From Price and To Price already exists');
  }

  private assertValidRange(fromPrice: number, toPrice: number) {
    if (fromPrice > toPrice) throw new BadRequestException('From Price must be less than or equal to To Price');
  }

  private makeName(fromPrice: number, toPrice: number) {
    return `${fromPrice} - ${toPrice}`;
  }

  private toPublicRange(row: LeadPriceRange) {
    const data = row.toJSON() as Record<string, any>;
    delete data.id;
    data.fromPrice = data.minPrice;
    data.toPrice = data.maxPrice;
    data.createdBy = data.createdBy ?? null;
    delete data.minPrice;
    delete data.maxPrice;
    delete data.name;
    delete data.updatedBy;
    delete data.deletedBy;
    delete data.projectId;
    return data;
  }
}
