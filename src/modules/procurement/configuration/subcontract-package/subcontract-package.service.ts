import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ProcurementSubcontractPackage, SubcontractPackageStatus } from 'src/database/models/procurement/configuration/subcontract-package/pr_subcontract_package.model';
import { CreateSubcontractPackageDto, QuerySubcontractPackageDto, UpdateSubcontractPackageDto } from './dto/subcontract-package.dto';

@Injectable()
export class ProcurementSubcontractPackageService {
  constructor(@InjectModel(ProcurementSubcontractPackage) private readonly model: typeof ProcurementSubcontractPackage) {}

  async create(dto: CreateSubcontractPackageDto) {
    const existing = await this.model.findOne({ where: { name: { [Op.iLike]: dto.name } } });
    if (existing) throw new BadRequestException(`Subcontract package "${dto.name}" already exists`);
    const row = await this.model.create({ ...dto, status: dto.status ?? SubcontractPackageStatus.ACTIVE });
    return this.findOne(row.uuid);
  }

  async findAll(query: QuerySubcontractPackageDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.search) where[Op.or] = [
      { name: { [Op.iLike]: `%${query.search}%` } },
      { unit: { [Op.iLike]: `%${query.search}%` } },
    ];
    let paranoid = true;
    if (query.deleted_only === 'true' || query.deleted_only === true) {
      where.deletedAt = { [Op.ne]: null };
      paranoid = false;
    } else if (query.withDeleted === 'true' || query.withDeleted === true) {
      paranoid = false;
    }
    const { rows, count } = await this.model.findAndCountAll({ where, paranoid, limit, offset: (page - 1) * limit, order: [['name', 'ASC']] });
    return { data: rows, meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) } };
  }

  async dropdowns() {
    return this.model.findAll({ attributes: ['uuid', 'name', 'unit'], where: { status: SubcontractPackageStatus.ACTIVE }, order: [['name', 'ASC']] });
  }

  async findOne(uuid: string, withDeleted = false) {
    const row = await this.model.findOne({ where: { uuid }, paranoid: !withDeleted });
    if (!row) throw new NotFoundException(`Subcontract package ${uuid} not found`);
    return row;
  }

  async update(uuid: string, dto: UpdateSubcontractPackageDto) {
    const row = await this.findOne(uuid);
    if (dto.name && dto.name.toLowerCase() !== row.name.toLowerCase()) {
      const duplicate = await this.model.findOne({ where: { name: { [Op.iLike]: dto.name } } });
      if (duplicate) throw new BadRequestException(`Subcontract package "${dto.name}" already exists`);
    }
    await row.update(dto);
    return this.findOne(uuid);
  }

  async remove(uuid: string) {
    const row = await this.findOne(uuid);
    await row.update({ status: SubcontractPackageStatus.INACTIVE });
    await row.destroy();
    return { message: 'Subcontract package deleted', uuid };
  }

  async restore(uuid: string) {
    const row = await this.findOne(uuid, true);
    if (!row.deletedAt) throw new BadRequestException('Subcontract package is not deleted');
    await row.restore();
    await row.update({ status: SubcontractPackageStatus.ACTIVE });
    return this.findOne(uuid);
  }
}
