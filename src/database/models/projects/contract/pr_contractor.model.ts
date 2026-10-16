/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';

import {
  ContractorAttributes,
  ContractorCreationAttributes,
  ContractorUpdateAttributes,
} from 'src/database/types/contractor.types';

export enum ContractorUnderStatus {
  WORKER = 'worker',
  CONTRACTOR = 'contractor',
}

export enum ContractorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  BLOCKED = 'blocked',
}

@Table({
  tableName: 'contractors',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class Contractor
  extends BaseModel<
    ContractorUpdateAttributes,
    ContractorCreationAttributes
  >
  implements ContractorAttributes
{
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
  declare mobileNo: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare address?: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0.0,
  })
  declare creditLimit?: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare dueDate?: Date;

  @Column({
    type: DataType.ENUM(
      ...Object.values(ContractorUnderStatus),
    ),
    allowNull: false,
    defaultValue: ContractorUnderStatus.WORKER,
  })
  declare under: ContractorUnderStatus;

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
      ...Object.values(ContractorStatus),
    ),
    allowNull: false,
    defaultValue: ContractorStatus.ACTIVE,
  })
  declare status: ContractorStatus;
}
