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
  CsBuildingExpenseAttributes,
  CsBuildingExpenseCreationAttributes,
} from '../../types/csbuildingexpense.types';
import type { BuildingExpenseType } from './cs_service_charge.types';

@Table({
  tableName: 'cs_building_expenses',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_bld_exp_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_bld_exp_proj_type_date',
      fields: ['project_id', 'expense_type', 'expense_date'],
    },
  ],
})
export class CsBuildingExpense extends TenantBaseModel<
  CsBuildingExpenseAttributes,
  CsBuildingExpenseCreationAttributes
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
    field: 'expense_type',
  })
  declare expenseType: BuildingExpenseType;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    field: 'title',
  })
  declare title: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
    field: 'vendor_name',
  })
  declare vendorName?: string | null;

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
    field: 'expense_date',
  })
  declare expenseDate: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'invoice_reference',
  })
  declare invoiceReference?: string | null;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'PAID',
    field: 'payment_status',
  })
  declare paymentStatus: 'PAID' | 'PENDING';

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'notes',
  })
  declare notes?: string | null;
}

