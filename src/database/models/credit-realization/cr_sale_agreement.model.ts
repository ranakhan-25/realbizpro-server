import { Column, DataType, Table, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrInstallmentPlan } from './cr_installment_plan.model';
import { CrPlotDistribution } from './cr_plot_distribution.model';
import { CrRecoveryLog } from './cr_recovery_log.model';

import type { CrSaleAgreementAttributes, CrSaleAgreementCreationAttributes } from '../../types/crsaleagreement.types';

@Table({
  tableName: 'cr_sale_agreements',
  timestamps: true,
  paranoid: true,
})
export class CrSaleAgreement extends BaseModel<CrSaleAgreementAttributes, CrSaleAgreementCreationAttributes> {
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  agreement_number: string;

  @Column({ type: DataType.STRING, allowNull: false })
  customer_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  customer_name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  customer_phone?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  property_type: string;

  @Column({ type: DataType.STRING, allowNull: false })
  unit_identifier: string;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: false })
  total_price: number;

  @Column({ type: DataType.DECIMAL(14, 2), defaultValue: 0 })
  down_payment: number;

  @Column({ type: DataType.DECIMAL(14, 2), defaultValue: 0 })
  booking_money: number;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  agreement_date: string;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  handover_date?: string;

  @Column({ type: DataType.STRING, defaultValue: 'active' })
  status: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  terms_and_conditions?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'org_id' })
  declare org_id?: string;

  @HasMany(() => CrInstallmentPlan, { foreignKey: 'sale_agreement_id' })
  installment_plans: CrInstallmentPlan[];

  @HasMany(() => CrPlotDistribution, { foreignKey: 'sale_agreement_id' })
  plot_distributions: CrPlotDistribution[];

  @HasMany(() => CrRecoveryLog, { foreignKey: 'sale_agreement_id' })
  recovery_logs: CrRecoveryLog[];
}
