/* eslint-disable prettier/prettier */
import {
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import type {
  DepartmentAttributes,
  DepartmentCreationAttributes,
  DepartmentUpdateAttributes,
} from 'src/database/types/department.types';
import { Designation } from './hrm_designation_model';
import { EmployeeList } from './hrm_employeeList_model';

export enum DepartmentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'department',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'Department_name_idx',
      fields: ['name'],
    },
    {
      name: 'Department_departmentHeadId_idx',
      fields: ['departmentHeadId'],
    },
    {
      name: 'Department_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class Department
  extends BaseModel<
    DepartmentUpdateAttributes,
    DepartmentCreationAttributes
  >
  implements DepartmentAttributes
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
  declare departmentHeadId?: string;

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
      ...Object.values(DepartmentStatus),
    ),
    allowNull: false,
    defaultValue: DepartmentStatus.ACTIVE,
  })
  declare status: DepartmentStatus;
  // relation: ek Department er onek Designation (1 : N)
  // foreignKey departmentId Designation model e define kora ache
  @HasMany(() => Designation, {
    foreignKey: 'departmentId',
    sourceKey: 'uuid',
    as: 'designations',
  })
  declare designations?: Designation[];
  // Department model e
  @HasMany(() => EmployeeList, {
    foreignKey: 'departmentId',
    sourceKey: 'uuid',
    as: 'employees',
  })
  declare employees?: EmployeeList[];
}
