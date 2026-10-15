import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { Project } from '../project/pr_project.model';
import {
  ProjectBillingRecordAttributes,
  ProjectBillingRecordCreationAttributes,
  ProjectBillingRecordUpdateAttributes,
} from 'src/database/types/projectbillingrecord.types';

export enum ProjectBillingResource {
  BILL_ITEMS = 'bill-items',
  SERVICE_WORK_NAMES = 'service-work-names',
  BOQ_TITLES = 'boq-titles',
  BILL_INVOICES = 'bill-invoices',
  CONTRACTOR_BILLS = 'contractor-bills',
  LABOUR_WORK_BILLS = 'labour-work-bills',
  WORK_ORDERS = 'work-orders',
  CONTRACTOR_WORK_ORDERS = 'contractor-work-orders',
  PERIOD_BILLINGS = 'period-billings',
  ADJUSTMENT_BILLINGS = 'adjustment-billings',
  QUOTES = 'quotes',
}

@Table({
  tableName: 'pr_project_billing_records',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class ProjectBillingRecord
  extends BaseModel<
    ProjectBillingRecordUpdateAttributes,
    ProjectBillingRecordCreationAttributes
  >
  implements ProjectBillingRecordAttributes
{
  @Column({ type: DataType.STRING(60), allowNull: false })
  declare resource: ProjectBillingResource;

  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false })
  declare projectId: string;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
  })
  declare project?: Project;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare code?: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare title: string;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  declare recordDate?: Date;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare amount: number;

  @Column({ type: DataType.STRING(40), allowNull: false, defaultValue: 'active' })
  declare status: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description?: string;

  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: {} })
  declare details: Record<string, unknown>;

  @Column({ type: DataType.STRING, allowNull: true })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare deletedBy?: string;
}
