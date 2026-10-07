/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';


import {
  CustomerAccountAttributes,
  CustomerAccountCreationAttributes,
  CustomerAccountUpdateAttributes,
} from 'src/database/types/customeraccount.types';

export enum CustomerAccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  BLOCKED = 'blocked',
}

@Table({
  tableName: 'customer_account',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class CustomerAccount
  extends BaseModel<
    CustomerAccountUpdateAttributes,
    CustomerAccountCreationAttributes
  >
  implements CustomerAccountAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare customerCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare customerName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare mobileNo: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare email?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare businessName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare nidOrPassport?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare underGroup?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare address?: string;

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

  @Column({
    type: DataType.ENUM(
      ...Object.values(CustomerAccountStatus),
    ),
    allowNull: false,
    defaultValue: CustomerAccountStatus.ACTIVE,
  })
  declare status: CustomerAccountStatus;
}
