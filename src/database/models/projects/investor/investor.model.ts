/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  HasMany,
  Table, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { BaseModel } from 'src/database/base.model';

import {
  InvestorAttributes,
  InvestorCreationAttributes,
  InvestorUpdateAttributes,
} from 'src/database/types/investor.types';

import { InvestorNominee } from './investor_nominee.model';
import { SysOrganization } from "src/database/models/system/sys_organization.model";

export enum InvestorGroupTier {
  TIER_1 = 'Tier 1 - Primary Investor',
  TIER_2 = 'Tier 2 - Strategic Partner',
  TIER_3 = 'Tier 3 - Regional Affiliate',
}

export enum InvestorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  BLOCKED = 'blocked',
}

@Table({
  tableName: 'investors',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class Investor
  extends BaseModel<
    InvestorUpdateAttributes,
    InvestorCreationAttributes
  >
  implements InvestorAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare mobileNo: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare email?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare nid: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare address?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare image?: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(InvestorGroupTier),
    ),
    allowNull: false,
  })
  declare groupTier: InvestorGroupTier;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare underGroup?: string;

  @HasMany(() => InvestorNominee, {
    foreignKey: 'investorId',
    sourceKey: 'uuid',
    onDelete: 'CASCADE',
  })
  declare nominees?: InvestorNominee[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedById?: string;

  @Column({
          field: 'created_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare createdBy?: string;

  @Column({
          field: 'updated_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare updatedBy?: string;

  @Column({
          field: 'deleted_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare deletedBy?: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(InvestorStatus),
    ),
    allowNull: false,
    defaultValue: InvestorStatus.ACTIVE,
  })
  declare status: InvestorStatus;
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
