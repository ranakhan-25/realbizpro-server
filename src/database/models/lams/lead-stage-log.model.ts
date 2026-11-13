import {
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
  Index,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { AcquisitionLead } from './acquisition-lead.model';

import type { LeadStageLogAttributes, LeadStageLogCreationAttributes } from '../../types/leadstagelog.types';

@Table({
  tableName: 'lams_lead_stage_logs',
  timestamps: true,
  paranoid: true,
})
export class LeadStageLog extends BaseModel<LeadStageLogAttributes, LeadStageLogCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare id: any;

  @Index({ name: 'idx_lead_stage_log_org_id' })
  @Column({ type: DataType.STRING, allowNull: false })
  declare org_id: string;

  @ForeignKey(() => AcquisitionLead)
  @Index({ name: 'idx_lead_stage_log_lead_id' })
  @Column({ type: DataType.UUID, allowNull: false })
  lead_id: any;

  @Column({ type: DataType.STRING(50), allowNull: false })
  from_stage: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  to_stage: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  remarks: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  transitioned_by?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  created_by?: number;

  @BelongsTo(() => AcquisitionLead, { foreignKey: 'lead_id', as: 'acquisition_lead' })
  declare acquisition_lead?: AcquisitionLead;
}
