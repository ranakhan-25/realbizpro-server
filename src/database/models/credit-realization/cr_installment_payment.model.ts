import { Column, DataType, Table, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrInstallmentPlan } from './cr_installment_plan.model';

import type { CrInstallmentPaymentAttributes, CrInstallmentPaymentCreationAttributes } from '../../types/crinstallmentpayment.types';

@Table({
  tableName: 'cr_installment_payments',
  timestamps: true,
  paranoid: true,
})
export class CrInstallmentPayment extends BaseModel<CrInstallmentPaymentAttributes, CrInstallmentPaymentCreationAttributes> {
  @Column({ type: DataType.BIGINT, allowNull: false })
  installment_plan_id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  payment_voucher_no: string;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: false })
  paid_amount: number;

  @Column({ type: DataType.DECIMAL(14, 2), defaultValue: 0 })
  penalty_paid: number;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  payment_date: string;

  @Column({ type: DataType.STRING, allowNull: false })
  payment_method: string;

  @Column({ type: DataType.STRING, allowNull: true })
  bank_name?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  cheque_no?: string;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  cheque_date?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  transaction_reference?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  money_receipt_no?: string;

  @Column({ type: DataType.STRING, defaultValue: 'verified' })
  status: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  remarks?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'org_id' })
  declare org_id?: string;

  @BelongsTo(() => CrInstallmentPlan, { foreignKey: 'installment_plan_id' })
  installment_plan: CrInstallmentPlan;
}
