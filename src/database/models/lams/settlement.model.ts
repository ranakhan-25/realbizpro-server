import { Column, DataType, Table, Index } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

import type { LamsSettlementAttributes, LamsSettlementCreationAttributes } from '../../types/lamssettlement.types';

@Table({
  tableName: 'lams_settlements',
  timestamps: true,
  paranoid: true,
})
export class LamsSettlement extends BaseModel<LamsSettlementAttributes, LamsSettlementCreationAttributes> {
  @Index({ name: 'idx_settlement_org_id' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare org_id: string;

  @Index({ name: 'idx_settlement_lead_id' })
  @Column({ type: DataType.UUID, allowNull: false })
  declare lead_id: string;

  @Column({ type: DataType.UUID, allowNull: true })
  declare owner_id?: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare agreed_amount: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare advance_amount: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare paid_amount: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare due_amount: number;

  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'bank_transfer' })
  declare payment_mode: string;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  declare scheduled_at?: Date;

  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'pending' })
  declare status: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  declare payment_schedule?: any;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;
}
