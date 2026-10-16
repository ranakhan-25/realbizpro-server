import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { InvSupplier } from 'src/database/models/inventory/inv_supplier.model';
import { InvPurchase } from 'src/database/models/inventory/inv_purchase.model';
import { CreateInvSupplierDto } from './dto/create-inv-supplier.dto';
import { UpdateInvSupplierDto } from './dto/update-inv-supplier.dto';
import { QueryInvSupplierDto } from './dto/query-inv-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(InvSupplier)
    private readonly supplierModel: typeof InvSupplier,
    @InjectModel(InvPurchase)
    private readonly purchaseModel: typeof InvPurchase,
  ) {}

  async create(createDto: CreateInvSupplierDto) {
    const existing = await this.supplierModel.findOne({
      where: { code: createDto.code },
    });
    if (existing) throw new ConflictException(`Supplier with code ${createDto.code} already exists`);

    return this.supplierModel.create({
      ...createDto,
      due_date: createDto.due_date ? new Date(createDto.due_date) : null,
    });
  }

  async findAll(query: QueryInvSupplierDto) {
    const { page = 1, limit = 10, search } = query;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { mobile: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.supplierModel.findAndCountAll({
      where,
      limit,
      offset,
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

  async findOne(id: string) {
    const supplier = await this.supplierModel.findByPk(id, {
      include: [{ model: this.purchaseModel, as: 'purchases', required: false }],
    });
    if (!supplier) throw new NotFoundException(`Supplier #${id} not found`);
    return supplier;
  }

  async update(id: string, updateDto: UpdateInvSupplierDto) {
    const supplier = await this.findOne(id);

    if (updateDto.code && updateDto.code !== supplier.code) {
      const existing = await this.supplierModel.findOne({
        where: { code: updateDto.code },
      });
      if (existing) throw new ConflictException(`Supplier with code ${updateDto.code} already exists`);
    }

    await supplier.update({
      ...updateDto,
      due_date: updateDto.due_date ? new Date(updateDto.due_date) : supplier.due_date,
    });
    return supplier;
  }

  async remove(id: string) {
    const supplier = await this.findOne(id);
    await supplier.destroy();
    return { message: 'Supplier deleted successfully' };
  }
}
