/* eslint-disable prettier/prettier */
import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import type {
  LabourWorkBankAttributes,
  LabourWorkBankCreationAttributes,
  LabourWorkBankUpdateAttributes,
} from 'src/database/types/labourworkbank.types';

export enum LabourWorkBankStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  BLOCKED = 'blocked',
}

@Table({
  tableName: 'labour_work_bank',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'LabourWorkBank_code_idx',
      fields: ['code'],
    },
    {
      name: 'LabourWorkBank_phone_idx',
      fields: ['phone'],
    },
    {
      name: 'LabourWorkBank_email_idx',
      fields: ['email'],
    },
    {
      name: 'LabourWorkBank_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class LabourWorkBank
  extends BaseModel<
    LabourWorkBankUpdateAttributes,
    LabourWorkBankCreationAttributes
  >
  implements LabourWorkBankAttributes
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
    defaultValue: 'Labour',
  })
  declare underGroup?: string;

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
      ...Object.values(LabourWorkBankStatus),
    ),
    allowNull: false,
    defaultValue: LabourWorkBankStatus.ACTIVE,
  })
  declare status: LabourWorkBankStatus;
}
