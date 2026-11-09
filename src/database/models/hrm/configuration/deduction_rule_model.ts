/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */
import {
  Column,
  DataType,
  Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import type {
  DeductionRuleAttributes,
  DeductionRuleCreationAttributes,
} from '../../../types/deductionrule.types';
import { SysOrganization } from "src/database/models/system/sys_organization.model";

export enum DeductionRuleType {
  LATE = 'Late',
  EARLY = 'Early',
}

@Table({
  tableName: 'deduction_rule',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'DeductionRule_type_idx',
      fields: ['type'],
    },
    {
      name: 'DeductionRule_title_idx',
      fields: ['title'],
    },
    {
      name: 'DeductionRule_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class DeductionRule extends BaseModel<
  DeductionRuleAttributes,
  DeductionRuleCreationAttributes
> {
  @Column({
    type: DataType.ENUM(
      ...Object.values(DeductionRuleType),
    ),
    allowNull: false,
  })
  declare type: DeductionRuleType;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare lateTime: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare lateDays: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare deductionDays: number;

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
}
