import { Column, DataType, Table, Index } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

import type { LamsDueDiligenceAttributes, LamsDueDiligenceCreationAttributes } from '../../types/lamsduediligence.types';

@Table({
  tableName: 'lams_due_diligences',
  timestamps: true,
  paranoid: true,
})
export class LamsDueDiligence extends BaseModel<LamsDueDiligenceAttributes, LamsDueDiligenceCreationAttributes> {
  @Index({ name: 'idx_due_diligence_lead_id' })
  @Column({ type: DataType.UUID, allowNull: false })
  lead_id: string;

  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false, defaultValue: 0 })
  score: number;

  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'pending' })
  status: string;

  @Column({ type: DataType.STRING(150), allowNull: true })
  surveyor_name?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  report_url?: string;

  @Column({ type: DataType.JSONB, allowNull: true, defaultValue: [] })
  checklist_json?: any;

  @Column({ type: DataType.STRING, allowNull: true })
  declare org_id?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;
}
