/* eslint-disable prettier/prettier */
import {
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import {
  UnitAttributes,
  UnitCreationAttributes,
  UnitUpdateAttributes,
} from 'src/database/types/unit.types';
// import { EmployeeList } from './hrm_employeeList_model';

export enum UnitStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'unit',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    { name: 'Unit_name_idx', fields: ['name'] },
    {
      name: 'Unit_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class Unit
  extends BaseModel<
    UnitUpdateAttributes,
    UnitCreationAttributes
  >
  implements UnitAttributes
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
      ...Object.values(UnitStatus),
    ),
    allowNull: false,
    defaultValue: UnitStatus.ACTIVE,
  })
  declare status: UnitStatus;

  // @HasMany(() => EmployeeList, {
  //   foreignKey: 'unitId',
  //   sourceKey: 'uuid',
  //   as: 'employees',
  // })
  // declare employees?: EmployeeList[];
}
