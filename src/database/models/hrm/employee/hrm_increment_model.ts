/* eslint-disable prettier/prettier */
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import type {
  IncrementAttributes,
  IncrementCreationAttributes,
  IncrementUpdateAttributes,
} from 'src/database/types/increment.types';
import { EmployeeList } from './hrm_employeeList_model';
import { Designation } from './hrm_designation_model';

export enum IncrementStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'increment',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'Increment_employeeId_idx',
      fields: ['employeeId'],
    },
    {
      name: 'Increment_designationId_idx',
      fields: ['designationId'],
    },
    {
      name: 'Increment_date_idx',
      fields: ['date'],
    },
    {
      name: 'Increment_status_idx',
      fields: ['status'],
    },
    {
      name: 'Increment_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class Increment
  extends BaseModel<
    IncrementUpdateAttributes,
    IncrementCreationAttributes
  >
  implements IncrementAttributes
{
  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare date: string;

  @ForeignKey(() => EmployeeList)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare employeeId: string;

  @BelongsTo(() => EmployeeList, {
    foreignKey: 'employeeId',
    targetKey: 'uuid',
    as: 'employee',
  })
  declare employee?: EmployeeList;

  @ForeignKey(() => Designation)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare designationId: string;

  @BelongsTo(() => Designation, {
    foreignKey: 'designationId',
    targetKey: 'uuid',
    as: 'designation',
  })
  declare designation?: Designation;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  declare amount: number;

  @Column({
    type: DataType.ENUM(...Object.values(IncrementStatus)),
    allowNull: false,
    defaultValue: IncrementStatus.ACTIVE,
  })
  declare status: IncrementStatus;

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
