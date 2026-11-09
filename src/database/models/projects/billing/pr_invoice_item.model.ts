/* eslint-disable prettier/prettier */


import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';

import { BaseModel } from 'src/database/base.model';
import { Invoice } from './pr_invoice.model';
import { Item } from './pr_item.model';
import type { InvoiceItemAttributes, InvoiceItemCreationAttributes } from 'src/database/types/invoiceitem.types';
import { SysOrganization } from "src/database/models/system/sys_organization.model";

@Table({
  tableName: 'invoice_items',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class InvoiceItem extends BaseModel<
  InvoiceItemAttributes,
  InvoiceItemCreationAttributes
> {
  // ❌ uuid column bad dite hobe

  @ForeignKey(() => Invoice)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare invoiceId: string;

  @BelongsTo(() => Invoice, {
    foreignKey: 'invoiceId',
    targetKey: 'uuid',
    as: 'invoice',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare invoice?: Invoice;

  @ForeignKey(() => Item)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare itemId?: string;

  @BelongsTo(() => Item, {
    foreignKey: 'itemId',
    targetKey: 'uuid',
    as: 'item',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  declare item?: Item;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare itemName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare description?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: 'Nos',
  })
  declare unit: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare quantity: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare rate: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare amount: number;

  @Column({
          field: 'created_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare createdBy?: string;

  @Column({
          field: 'updated_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare updatedBy?: string;

  @Column({
          field: 'deleted_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare deletedBy?: string;
    @ForeignKey(() => SysOrganization)
    @Column({
            type: DataType.BIGINT,
            allowNull: true,
            field: 'org_id',
            defaultValue: null,
          })
    declare orgId?: number | null;
    @BelongsTo(() => SysOrganization, {
            foreignKey: 'orgId',
            targetKey: 'id',
            as: 'organization',
          })
    declare organization?: SysOrganization;
}
