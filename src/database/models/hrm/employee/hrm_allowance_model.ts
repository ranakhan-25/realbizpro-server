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
  AllowanceAttributes,
  AllowanceCreationAttributes,
  AllowanceUpdateAttributes,
} from 'src/database/types/allowance.types';
import { EmployeeList } from './hrm_employeeList_model';
import {
  AllowanceType,
  PaymentType,
} from './hrm_payment_enum';
import { SysOrganization } from "src/database/models/system/sys_organization.model";
import { Project } from "src/database/models/projects/project/pr_project.model";

@Table({
  tableName: 'allowance',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'Allowance_employeeId_idx',
      fields: ['employeeId'],
    },
    {
      name: 'Allowance_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class Allowance
  extends BaseModel<
    AllowanceUpdateAttributes,
    AllowanceCreationAttributes
  >
  implements AllowanceAttributes
{
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare purpose: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(AllowanceType),
    ),
    allowNull: false,
  })
  declare type: AllowanceType;

  @Column({
    type: DataType.ENUM(
      ...Object.values(PaymentType),
    ),
    allowNull: false,
  })
  declare paymentType: PaymentType;

  @Column({
    type: DataType.DECIMAL(8, 2),
    allowNull: true,
  })
  declare percentage?: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare amount: number;

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
    @ForeignKey(() => Project)
    @Column({
            type: DataType.UUID,
            allowNull: true,
            field: 'project_id',
            defaultValue: null,
          })
    declare projectId?: string | null;
    @BelongsTo(() => Project, {
            foreignKey: 'projectId',
            targetKey: 'uuid',
            as: 'project',
          })
    declare project?: Project;
}
