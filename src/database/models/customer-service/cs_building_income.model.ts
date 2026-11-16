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
  CsBuildingIncomeAttributes,
  CsBuildingIncomeCreationAttributes,
} from '../../types/csbuildingincome.types';
import type { BuildingIncomeType } from './cs_service_charge.types';

@Table({
  tableName: 'cs_building_incomes',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_bld_inc_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_bld_inc_proj_type_date',
      fields: ['project_id', 'income_type', 'income_date'],
    },
  ],
})
export class CsBuildingIncome extends TenantBaseModel<
  CsBuildingIncomeAttributes,
  CsBuildingIncomeCreationAttributes
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
    field: 'income_type',
  })
  declare incomeType: BuildingIncomeType;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    field: 'title',
  })
  declare title: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'amount',
  })
  declare amount: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'income_date',
  })
  declare incomeDate: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
    field: 'received_from',
  })
  declare receivedFrom?: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'source_reference',
  })
  declare sourceReference?: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'notes',
  })
  declare notes?: string | null;
}

