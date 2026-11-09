/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */
import {
  Column,
  DataType,
  Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import {
  EmployeeTypeAttributes,
  EmployeeTypeCreationAttributes,
  EmployeeTypeUpdateAttributes,
} from 'src/database/types/employeetype.types';
import { SysOrganization } from "src/database/models/system/sys_organization.model";

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
      ...Object.values(EmployeeTypeStatus),
    ),
    allowNull: false,
    defaultValue: EmployeeTypeStatus.ACTIVE,
  })
  declare status: EmployeeTypeStatus;
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
