/* eslint-disable prettier/prettier */

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';

import { BaseModel } from 'src/database/base.model';

import {
  ShareConfigurationAttributes,
  ShareConfigurationCreationAttributes,
  ShareConfigurationUpdateAttributes,
} from 'src/database/types/shareconfiguration.types';

import { Project } from '../project/pr_project_model';
import { Investor } from './investor_model';

export enum ShareConfigurationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  BLOCKED = 'blocked',
}

@Table({
  tableName: 'share_configurations',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class ShareConfiguration
  extends BaseModel<
    ShareConfigurationUpdateAttributes,
    ShareConfigurationCreationAttributes
  >
  implements ShareConfigurationAttributes
{
  // =========================
  // PROJECT
  // =========================

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare projectId: string;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  declare project?: Project;

  // =========================
  // INVESTOR
  // =========================

  @ForeignKey(() => Investor)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare investorId: string;

  @BelongsTo(() => Investor, {
    foreignKey: 'investorId',
    targetKey: 'uuid',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  declare investor?: Investor;

  // =========================
  // INVESTMENT
  // =========================

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0.0,
  })
  declare investmentAmount: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0.0,
  })
  declare profitPercent?: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0.0,
  })
  declare fixedProfitAmount?: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isProfitDistribute: boolean;

  // =========================
  // AUDIT
  // =========================

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

  // =========================
  // STATUS
  // =========================

  @Column({
    type: DataType.ENUM(
      ...Object.values(ShareConfigurationStatus),
    ),
    allowNull: false,
    defaultValue: ShareConfigurationStatus.ACTIVE,
  })
  declare status: ShareConfigurationStatus;
}
