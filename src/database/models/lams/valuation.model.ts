import { Column, DataType, Table, Index } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

import type { LamsValuationAttributes, LamsValuationCreationAttributes } from '../../types/lamsvaluation.types';

@Table({
  tableName: 'lams_valuations',
  timestamps: true,
  paranoid: true,
})
export class LamsValuation extends BaseModel<LamsValuationAttributes, LamsValuationCreationAttributes> {
  @Index({ name: 'idx_valuation_lead_id' })
  @Column({ type: DataType.UUID, allowNull: false })
  lead_id: string;

  @Column({ type: DataType.STRING, allowNull: true })
  valuer_id?: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  market_rate: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  govt_rate: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  total_value: number;

  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'comparative' })
  method: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  report_url?: string;

  @Column({ type: DataType.DATEONLY, allowNull: false, defaultValue: DataType.NOW })
  valued_at: Date;

  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'completed' })
  status: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  notes?: string;

  @Index({ name: 'idx_valuation_org_id' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare org_id: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;
}
