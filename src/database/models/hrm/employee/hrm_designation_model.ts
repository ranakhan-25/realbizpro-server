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
import { Increment } from './hrm_increment_model';

export enum DesignationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'hrm_designation',
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
      fields: ['department_Id'],
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
    field: 'name',
  })
  declare name: string;

  @ForeignKey(() => Department)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    references: {
      model: 'hrm_department',
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
    field: 'added_by_id',
  })
  declare addedById?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'created_by',
  })
  declare createdBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'updated_by',
  })
  declare updatedBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'deleted_by',
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
  @HasMany(() => Increment, {
    foreignKey: 'designationId',
    sourceKey: 'uuid',
    as: 'increments',
  })
  declare increments?: Increment[];
}
