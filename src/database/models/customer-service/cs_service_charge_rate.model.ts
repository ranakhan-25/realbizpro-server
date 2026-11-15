import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { TenantBaseModel } from '../../tenant-base.model';
import { Project } from '../projects/project/pr_project.model';
import type {
  CsServiceChargeRateAttributes,
  CsServiceChargeRateCreationAttributes,
} from '../../types/csservicechargerate.types';
import type { RateBasis } from './cs_service_charge.types';

@Table({
  tableName: 'cs_service_charge_rates',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_sc_rates_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_sc_rates_proj',
      fields: ['project_id'],
      unique: true,
      where: {
        deleted_at: null,
      },
    },
  ],
})
export class CsServiceChargeRate extends TenantBaseModel<
  CsServiceChargeRateAttributes,
  CsServiceChargeRateCreationAttributes
> {
  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'project_id',
  })
  declare projectId: string;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
  })
  declare project?: Project;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'PER_SQFT',
    field: 'rate_basis',
  })
  declare rateBasis: RateBasis;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 5.0,
    field: 'rate_per_sqft',
  })
  declare ratePerSqft: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 5000.0,
    field: 'fixed_rate_per_flat',
  })
  declare fixedRatePerFlat: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 10,
    field: 'due_day_of_month',
  })
  declare dueDayOfMonth: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'notes',
  })
  declare notes?: string | null;
}

