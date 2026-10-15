/* eslint-disable prettier/prettier */
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';

import { MaterialRequisition } from '../material-requisition/pr_material_requisition.model';
import type {
  MaterialRequisitionItemAttributes,
  MaterialRequisitionItemCreationAttributes,
  MaterialRequisitionItemUpdateAttributes,
} from 'src/database/types/materialrequisitionitem.types';

@Table({
  tableName: 'material_requisition_item',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'MaterialRequisitionItem_requisitionId_idx',
      fields: ['materialRequisitionId'],
    },
    {
      name: 'MaterialRequisitionItem_itemCode_idx',
      fields: ['itemCode'],
    },
    {
      name: 'MaterialRequisitionItem_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class MaterialRequisitionItem
  extends BaseModel<
    MaterialRequisitionItemUpdateAttributes,
    MaterialRequisitionItemCreationAttributes
  >
  implements MaterialRequisitionItemAttributes
{
  @ForeignKey(() => MaterialRequisition)
  @Column({
    type: DataType.UUID, // ⬅️ এটাই মূল ফিক্স
    allowNull: false,
    field: 'materialRequisitionId',
  })
  declare materialRequisitionId: string;

  @BelongsTo(() => MaterialRequisition, {
    foreignKey: 'materialRequisitionId',
    targetKey: 'uuid',
    as: 'materialRequisition',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare materialRequisition?: MaterialRequisition;

  // --- BOQ Item Fields ---
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare itemCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare itemName?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare details?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare unit?: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare budgetQty: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare alreadyPurchaseQty: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare availableQty: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare demandQty: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare stock: number;

  // --- Audit Fields ---
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
