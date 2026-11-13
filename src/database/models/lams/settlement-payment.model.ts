import { Column, DataType, Table, Index, PrimaryKey, Default } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

import type { LamsSettlementPaymentAttributes, LamsSettlementPaymentCreationAttributes } from '../../types/lamssettlementpayment.types';

@Table({
  tableName: 'lams_settlement_payments',
  timestamps: true,
  paranoid: true,
})
export class LamsSettlementPayment extends BaseModel<LamsSettlementPaymentAttributes, LamsSettlementPaymentCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare id: any;

  @Index({ name: 'idx_settlement_payment_org_id' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare org_id: string;

  @Index({ name: 'idx_settlement_payment_settlement_id' })
  @Column({ type: DataType.UUID, allowNull: false })
  settlement_id: string;

  @Index({ name: 'idx_settlement_payment_lead_id' })
  @Column({ type: DataType.UUID, allowNull: false })
  lead_id: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  payment_no: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  installment_no: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  amount: number;

  @Column({ type: DataType.DATEONLY, allowNull: false, defaultValue: DataType.NOW })
  payment_date: Date;

  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'bank_transfer' })
  payment_method: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  reference_no?: string;

  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'completed' })
  status: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  remarks?: string;

  @Column({ type: DataType.STRING(500), allowNull: true })
  receipt_url?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;
}
