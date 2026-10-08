import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { InvPurchase } from 'src/database/models/inventory/inv_purchase.model';
import { InvPurchaseItem } from 'src/database/models/inventory/inv_purchase_item.model';
import { CreateInvPurchaseDto } from './dto/create-inv-purchase.dto';
import { UpdateInvPurchaseDto } from './dto/update-inv-purchase.dto';
import { QueryInvPurchaseDto } from './dto/query-inv-purchase.dto';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectModel(InvPurchase) private readonly purchaseModel: typeof InvPurchase,
    @InjectModel(InvPurchaseItem) private readonly purchaseItemModel: typeof InvPurchaseItem,
    private sequelize: Sequelize,
  ) {}

  async create(createDto: CreateInvPurchaseDto) {
    // Validate grand total
    const expectedGrandTotal = Number(createDto.subtotal) - Number(createDto.discount) + Number(createDto.delivery_charge);
    if (Math.abs(expectedGrandTotal - Number(createDto.grand_total)) > 0.01) {
      throw new BadRequestException('Grand total does not match (subtotal - discount + delivery_charge)');
    }

    const transaction = await this.sequelize.transaction();
    try {
      const purchase = await this.purchaseModel.create(
        {
          date: new Date(createDto.date),
          payment_method: createDto.payment_method,
          subtotal: createDto.subtotal,
          discount: createDto.discount,
          delivery_charge: createDto.delivery_charge,
          grand_total: createDto.grand_total,
          paid_amount: createDto.paid_amount,
          due_amount: createDto.due_amount,
          cheque_no: createDto.cheque_no,
          cheque_date: createDto.cheque_date ? new Date(createDto.cheque_date) : null,
          supplier_id: createDto.supplier_id,
          project_type_id: createDto.project_type_id,
          project_id: createDto.project_id,
          boq_title_id: createDto.boq_title_id,
          task_id: createDto.task_id,
          site_id: createDto.site_id,
          createdBy: createDto.createdBy,
        },
        { transaction },
      );

      const itemsToInsert = createDto.items.map(item => ({
        ...item,
        purchase_id: purchase.id,
        createdBy: createDto.createdBy,
      }));

      await this.purchaseItemModel.bulkCreate(itemsToInsert, { transaction });

      await transaction.commit();
      return this.findOne(purchase.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findAll(query: QueryInvPurchaseDto) {
    const { page = 1, limit = 10, supplier_id, project_id } = query;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (supplier_id) where.supplier_id = supplier_id;
    if (project_id) where.project_id = project_id;

    const { rows, count } = await this.purchaseModel.findAndCountAll({
      where,
      limit,
      offset,
      include: [{ model: this.purchaseItemModel, as: 'items', required: false }],
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
    });

    return {
      data: rows,
      meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
  }

  async findOne(id: string) {
    const purchase = await this.purchaseModel.findByPk(id, {
      include: [{ model: this.purchaseItemModel, as: 'items', required: false }],
    });
    if (!purchase) throw new NotFoundException(`Purchase #${id} not found`);
    return purchase;
  }

  async update(id: string, updateDto: UpdateInvPurchaseDto) {
    const purchase = await this.findOne(id);
    const { items, ...headerData } = updateDto;
    await purchase.update({
      ...headerData,
      date: updateDto.date ? new Date(updateDto.date) : purchase.date,
      cheque_date: updateDto.cheque_date ? new Date(updateDto.cheque_date) : purchase.cheque_date,
    });
    return this.findOne(id);
  }

  async remove(id: string) {
    const purchase = await this.findOne(id);
    await purchase.destroy();
    return { message: 'Purchase deleted successfully' };
  }
}
