import { Column, DataType, Table, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrSaleAgreement } from './cr_sale_agreement.model';
import { CrInstallmentPlan } from './cr_installment_plan.model';

import type { CrFinancialAdjustmentAttributes, CrFinancialAdjustmentCreationAttributes } from '../../types/crfinancialadjustment.types';

@Table({
  tableName: 'cr_financial_adjustments',
  timestamps: true,
  paranoid: true,
})
export class CrFinancialAdjustment extends BaseModel<CrFinancialAdjustmentAttributes, CrFinancialAdjustmentCreationAttributes> {
  @Column({ type: DataType.STRING, allowNull: false, field: 'org_id' })
  declare org_id: string;

  @Column({ type: DataType.BIGINT, allowNull: false })
  sale_agreement_id: number;

  @Column({ type: DataType.BIGINT, allowNull: true })
  installment_plan_id?: number;

  @Column({ type: DataType.STRING, allowNull: false })
  adjustment_type: string; // credit_note, debit_note, rounding

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: false })
  amount: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  reason: string;

  @Column({ type: DataType.STRING, allowNull: true })
  reference_no?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  approved_by?: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'applied' })
  status: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @BelongsTo(() => CrSaleAgreement, { foreignKey: 'sale_agreement_id' })
  sale_agreement: CrSaleAgreement;

  @BelongsTo(() => CrInstallmentPlan, { foreignKey: 'installment_plan_id' })
  installment_plan?: CrInstallmentPlan;
}
