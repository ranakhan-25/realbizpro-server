/* eslint-disable prettier/prettier */
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';

import type {
  DesignationAttributes,
  DesignationCreationAttributes,
  DesignationUpdateAttributes,
} from 'src/database/types/designation.types';
import { Department } from './hrm_department_model';
import { EmployeeList } from './hrm_employeeList_model';

export enum DesignationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'designation',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'Designation_name_idx',
      fields: ['name'],
    },
    {
      name: 'Designation_departmentId_idx',
      fields: ['departmentId'],
    },
    {
      name: 'Designation_departmentId_name_unique',
      unique: true,
      fields: ['departmentId', 'name'],
    },
    {
      name: 'Designation_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class Designation
  extends BaseModel<
    DesignationUpdateAttributes,
    DesignationCreationAttributes
  >
  implements DesignationAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @ForeignKey(() => Department)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: {
      model: 'department',
      key: 'uuid',
    },
  })
  declare departmentId: string;

  @BelongsTo(() => Department, {
    foreignKey: 'departmentId',
    targetKey: 'uuid',
    as: 'department',
  })
  declare department?: Department;

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
      ...Object.values(DesignationStatus),
    ),
    allowNull: false,
    defaultValue: DesignationStatus.ACTIVE,
  })
  declare status: DesignationStatus;
  // Designation model e
  @HasMany(() => EmployeeList, {
    foreignKey: 'designationId',
    sourceKey: 'uuid',
    as: 'employees',
  })
  declare employees?: EmployeeList[];
}
