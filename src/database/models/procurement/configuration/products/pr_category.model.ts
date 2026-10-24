/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  HasMany,
  HasOne,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import {
  CategoryAttributes,
  CategoryCreationAttributes,
  CategoryUpdateAttributes,
} from 'src/database/types/category.types';
import { CategoryAccountMapping } from './pr_category_account_mapping.model';
import { ProcurementSubCategory } from './pr_sub_category.model';
import { ProcurementItemEntry } from './pr_item_entry.model';
import { ProcurementGrn } from '../../grn/pr_grn.model';
import { ProcurementRfq } from '../../rfq/pr_rfq.model';
import { ProcurementPurchaseOrder } from '../../purchase-order/pr_purchase_order.model';
import { ProcurementMaterialRequisition } from '../../requisition/pr_material_requisition.model';
import { ProcurementBoqItem } from '../../boq/pr_procurement_boq_item.model';

@Table({
  tableName: 'pr_category',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class Category
  extends BaseModel<
    CategoryUpdateAttributes,
    CategoryCreationAttributes
  >
  implements CategoryAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare uid?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  declare type: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  declare code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @HasOne(() => CategoryAccountMapping, {
    foreignKey: 'categoryId',
    sourceKey: 'uuid',
    as: 'accountMapping',
  })
  declare accountMapping?: CategoryAccountMapping;

  @HasMany(() => ProcurementSubCategory, {
    foreignKey: 'categoryId',
    sourceKey: 'uuid',
    as: 'subCategories',
  })
  declare subCategories?: ProcurementSubCategory[];

  @HasMany(() => ProcurementItemEntry, {
    foreignKey: 'category_id',
    sourceKey: 'uuid',
    as: 'itemEntries',
  })
  declare itemEntries?: ProcurementItemEntry[];

  @HasMany(() => ProcurementGrn, {
    foreignKey: 'category_id',
    sourceKey: 'uuid',
    as: 'grns',
  })
  declare grns?: ProcurementGrn[];

  @HasMany(() => ProcurementRfq, {
    foreignKey: 'category_id',
    sourceKey: 'uuid',
    as: 'rfqs',
  })
  declare rfqs?: ProcurementRfq[];

  @HasMany(() => ProcurementPurchaseOrder, {
    foreignKey: 'category_id',
    sourceKey: 'uuid',
    as: 'purchaseOrders',
  })
  declare purchaseOrders?: ProcurementPurchaseOrder[];

  @HasMany(() => ProcurementMaterialRequisition, {
    foreignKey: 'category_id',
    sourceKey: 'uuid',
    as: 'materialRequisitions',
  })
  declare materialRequisitions?: ProcurementMaterialRequisition[];
  @HasMany(() => ProcurementBoqItem, {
    foreignKey: 'category_id',
    sourceKey: 'uuid',
    as: 'procurementBoqItems',
  })
  declare procurementBoqItems?: ProcurementBoqItem[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedById?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare createdBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare updatedBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare deletedBy?: string;
}
