/* eslint-disable prettier/prettier */
import {
  Column,
  DataType,
  HasMany,
  Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import {
  UnitAttributes,
  UnitCreationAttributes,
  UnitUpdateAttributes,
} from 'src/database/types/unit.types';
import { EmployeeList } from './hrm_employeeList_model';
import { SysOrganization } from "src/database/models/system/sys_organization.model";

export enum UnitStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'hrm_unit',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    { name: 'HrmUnit_name_idx', fields: ['name'] },
    {
      name: 'HrmUnit_deletedAt_idx',
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
      ...Object.values(UnitStatus),
    ),
    allowNull: false,
    defaultValue: UnitStatus.ACTIVE,
  })
  declare status: UnitStatus;

  @HasMany(() => EmployeeList, {
    foreignKey: 'unitId',
    sourceKey: 'uuid',
    as: 'employees',
  })
  declare employees?: EmployeeList[];
    @ForeignKey(() => SysOrganization)
    @Column({
            type: DataType.BIGINT,
            allowNull: true,
            field: 'org_id',
            defaultValue: null,
          })
    declare orgId?: number | null;
    @BelongsTo(() => SysOrganization, {
            foreignKey: 'orgId',
            targetKey: 'id',
            as: 'organization',
          })
    declare organization?: SysOrganization;
}
