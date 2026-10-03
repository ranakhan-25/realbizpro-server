/* eslint-disable prettier/prettier */
import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import type {
  SupplierAccountsAttributes,
  SupplierAccountsCreationAttributes,
  SupplierAccountsUpdateAttributes,
} from 'src/database/types/supplieraccounts.types';

@Table({
  tableName: 'SupplierAccounts',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'SupplierAccounts_supplierCode_idx',
      fields: ['supplierCode'],
    },
    {
      name: 'SupplierAccounts_phone_idx',
      fields: ['phone'],
    },
    {
      name: 'SupplierAccounts_email_idx',
      fields: ['email'],
    },
    {
      name: 'SupplierAccounts_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class SupplierAccounts
  extends BaseModel<
    SupplierAccountsUpdateAttributes,
    SupplierAccountsCreationAttributes
  >
  implements SupplierAccountsAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare supplierCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare supplierName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare businessName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare email?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare phone: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare address?: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare creditLimit?: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare dueDate?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: 'Sundry Creditors',
  })
  declare underGroup?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedById?: string;
}
