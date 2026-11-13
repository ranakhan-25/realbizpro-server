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
  declare settlement_id: string;

  @Index({ name: 'idx_settlement_payment_lead_id' })
  @Column({ type: DataType.UUID, allowNull: false })
  declare lead_id: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare payment_no: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  declare installment_no: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare amount: number;

  @Column({ type: DataType.DATEONLY, allowNull: false, defaultValue: DataType.NOW })
  declare payment_date: Date;

  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'bank_transfer' })
  declare payment_method: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare reference_no?: string;

  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'completed' })
  declare status: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare remarks?: string;

  @Column({ type: DataType.STRING(500), allowNull: true })
  declare receipt_url?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;
}
