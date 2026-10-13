import { Column, DataType, Table, BelongsTo, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrSaleAgreement } from './cr_sale_agreement.model';
import { CrInstallmentPayment } from './cr_installment_payment.model';

import type { CrInstallmentPlanAttributes, CrInstallmentPlanCreationAttributes } from '../../types/crinstallmentplan.types';

@Table({
  tableName: 'cr_installment_plans',
  timestamps: true,
  paranoid: true,
})
export class CrInstallmentPlan extends BaseModel<CrInstallmentPlanAttributes, CrInstallmentPlanCreationAttributes> {
  @Column({ type: DataType.BIGINT, allowNull: false })
  sale_agreement_id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  installment_no: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  due_date: string;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: false })
  payable_amount: number;

  @Column({ type: DataType.DECIMAL(14, 2), defaultValue: 0 })
  paid_amount: number;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: false })
  due_amount: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  delay_days: number;

  @Column({ type: DataType.DECIMAL(14, 2), defaultValue: 0 })
  penalty_amount: number;

  @Column({ type: DataType.DECIMAL(14, 2), defaultValue: 0 })
  penalty_waived: number;

  @Column({ type: DataType.STRING, defaultValue: 'unpaid' })
  status: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' })
  declare projectId?: string;

  @BelongsTo(() => CrSaleAgreement, { foreignKey: 'sale_agreement_id' })
  sale_agreement: CrSaleAgreement;

  @HasMany(() => CrInstallmentPayment, { foreignKey: 'installment_plan_id' })
  payments: CrInstallmentPayment[];
}
