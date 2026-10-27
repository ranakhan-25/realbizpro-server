/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { SupplierAccount } from './acc_supplier_accounts_model';

export interface CustomerAccountAttributes {
  uuid?: string;
  code: string;
  name: string;
  business?: string;
  mobile: string;
  email?: string;
  nid?: string;
  under: number;
  address?: string;
  buyerReference?: string;
  creditLimit?: number;
  chartOfGroups?: string;
  nominees?: {
    name: string;
    nid: string;
    phone: string;
    relation: string;
    percentage: number;
  }[];
  imageUrl?: string;
  createUser?: boolean;
  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface CustomerAccountCreationAttributes extends Omit<CustomerAccountAttributes, 'uuid'> {}
export interface CustomerAccountUpdateAttributes extends Partial<CustomerAccountAttributes> {}

@Table({
  tableName: 'account_customer_account',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class CustomerAccount
  extends BaseModel<CustomerAccountAttributes, CustomerAccountCreationAttributes>
  implements CustomerAccountAttributes
{
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare uuid: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare business?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare mobile: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare email?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare nid?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare under: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare address?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare buyerReference?: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare creditLimit?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare chartOfGroups?: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: [],
  })
  declare nominees?: {
    name: string;
    nid: string;
    phone: string;
    relation: string;
    percentage: number;
  }[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare imageUrl?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  declare createUser?: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  declare addedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare addedById?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare deletedBy?: string; 
  @HasMany(() => SupplierAccount, {
    foreignKey: 'customerAccountId',
    as: 'supplierAccounts',
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  declare supplierAccounts: SupplierAccount[];
}