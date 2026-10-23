import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { LaborTypeStatus, ProcurementLaborType } from 'src/database/models/procurement/configuration/labor-type/pr_labor_type.model';
import { CreateLaborTypeDto, QueryLaborTypeDto, UpdateLaborTypeDto } from './dto/labor-type.dto';

@Injectable()
export class ProcurementLaborTypeService {
  constructor(@InjectModel(ProcurementLaborType) private readonly model: typeof ProcurementLaborType) {}

  async create(dto: CreateLaborTypeDto) {
    const duplicate = await this.model.findOne({ where: { name: dto.name } });
    if (duplicate) throw new BadRequestException(`Labor type "${dto.name}" already exists`);
    const row = await this.model.create({ ...dto, status: dto.status ?? LaborTypeStatus.ACTIVE });
    return this.findOne(row.uuid);
  }

  async findAll(query: QueryLaborTypeDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.search) where[Op.or] = [
      { name: { [Op.iLike]: `%${query.search}%` } },
      { unit: { [Op.iLike]: `%${query.search}%` } },
    ];
    const { rows, count } = await this.model.findAndCountAll({ where, limit, offset: (page - 1) * limit, order: [['name', 'ASC']] });
    return { data: rows, meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) } };
  }

  async dropdowns() {
    return this.model.findAll({ attributes: ['uuid', 'name', 'unit'], where: { status: LaborTypeStatus.ACTIVE }, order: [['name', 'ASC']] });
  }

  async findOne(uuid: string, withDeleted = false) {
    const row = await this.model.findOne({ where: { uuid }, paranoid: !withDeleted });
    if (!row) throw new NotFoundException(`Labor type ${uuid} not found`);
    return row;
  }

  async update(uuid: string, dto: UpdateLaborTypeDto) {
    const row = await this.findOne(uuid);
    if (dto.name && dto.name.toLowerCase() !== row.name.toLowerCase()) {
      const duplicate = await this.model.findOne({ where: { name: { [Op.iLike]: dto.name } } });
      if (duplicate) throw new BadRequestException(`Labor type "${dto.name}" already exists`);
    }
    await row.update(dto);
    return this.findOne(uuid);
  }

  async remove(uuid: string) {
    const row = await this.findOne(uuid);
    await row.update({ status: LaborTypeStatus.INACTIVE });
    await row.destroy();
    return { message: 'Labor type deleted', uuid };
  }

  async restore(uuid: string) {
    const row = await this.findOne(uuid, true);
    if (!row.deletedAt) throw new BadRequestException('Labor type is not deleted');
    await row.restore();
    await row.update({ status: LaborTypeStatus.ACTIVE });
    return this.findOne(uuid);
  }
}
