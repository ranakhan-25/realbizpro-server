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
  lead_id: string;

  @Column({ type: DataType.UUID, allowNull: true })
  owner_id?: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  agreed_amount: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  advance_amount: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  paid_amount: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  due_amount: number;

  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'bank_transfer' })
  payment_mode: string;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  scheduled_at?: Date;

  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'pending' })
  status: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  payment_schedule?: any;

  @Column({ type: DataType.TEXT, allowNull: true })
  notes?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;
}
