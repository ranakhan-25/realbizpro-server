import { Column, DataType, Table, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrSaleAgreement } from './cr_sale_agreement.model';

import type { CrRecoveryLogAttributes, CrRecoveryLogCreationAttributes } from '../../types/crrecoverylog.types';

@Table({
  tableName: 'cr_recovery_logs',
  timestamps: true,
  paranoid: true,
})
export class CrRecoveryLog extends BaseModel<CrRecoveryLogAttributes, CrRecoveryLogCreationAttributes> {
  @Column({ type: DataType.BIGINT, allowNull: false })
  sale_agreement_id: number;

  @Column({ type: DataType.STRING, allowNull: true })
  customer_id?: string;

  @Column({ type: DataType.STRING, allowNull: false })
  action_type: string;

  @Column({ type: DataType.DATE, allowNull: false })
  action_date: Date;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  promised_payment_date?: string;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: true })
  promised_amount?: number;

  @Column({ type: DataType.STRING, allowNull: false })
  officer_name: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  customer_response?: string;

  @Column({ type: DataType.STRING, defaultValue: 'in_progress' })
  outcome: string;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  next_action_date?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  geo_location?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  visit_photos?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  visit_outcome?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'org_id' })
  declare org_id?: string;

  @BelongsTo(() => CrSaleAgreement, { foreignKey: 'sale_agreement_id' })
  sale_agreement: CrSaleAgreement;
}
