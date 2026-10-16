/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */
import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import {
  EmployeeTypeAttributes,
  EmployeeTypeCreationAttributes,
  EmployeeTypeUpdateAttributes,
} from 'src/database/types/employeetype.types';

export enum EmployeeTypeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'employee_type',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'EmployeeType_name_idx',
      fields: ['name'],
    },
    {
      name: 'EmployeeType_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class EmployeeType
  extends BaseModel<
    EmployeeTypeUpdateAttributes,
    EmployeeTypeCreationAttributes
  >
  implements EmployeeTypeAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;

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
      ...Object.values(EmployeeTypeStatus),
    ),
    allowNull: false,
    defaultValue: EmployeeTypeStatus.ACTIVE,
  })
  declare status: EmployeeTypeStatus;
}
