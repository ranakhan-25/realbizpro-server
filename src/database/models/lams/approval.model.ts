import { Column, DataType, Table, Index } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

import type { LamsApprovalAttributes, LamsApprovalCreationAttributes } from '../../types/lamsapproval.types';

@Table({
  tableName: 'lams_approvals',
  timestamps: true,
  paranoid: true,
})
export class LamsApproval extends BaseModel<LamsApprovalAttributes, LamsApprovalCreationAttributes> {
  @Index({ name: 'idx_approval_lead_id' })
  @Column({ type: DataType.UUID, allowNull: false })
  lead_id: string;

  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'level_1' })
  level: string;

  @Column({ type: DataType.STRING, allowNull: true })
  approver_name?: string;

  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'pending' })
  decision: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  comment?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  decided_at?: Date;

  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'preliminary' })
  stage: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare org_id?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;
}
