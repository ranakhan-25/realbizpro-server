import { Column, DataType, Table, ForeignKey, BelongsTo, Index, PrimaryKey, Default } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { AcquisitionLead } from './acquisition-lead.model';

import type { FollowUpAttributes, FollowUpCreationAttributes } from '../../types/followup.types';

@Table({
  tableName: 'lams_follow_ups',
  timestamps: true,
  paranoid: true,
})
export class FollowUp extends BaseModel<FollowUpAttributes, FollowUpCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare id: any;

  @ForeignKey(() => AcquisitionLead)
  @Index({ name: 'idx_follow_up_lead_id' })
  @Column({ type: DataType.UUID, allowNull: false })
  lead_id: any;

  @Column({ type: DataType.DATE })
  follow_up_date: Date;

  @Index({ name: 'idx_follow_up_type' })
  @Column({ type: DataType.STRING })
  follow_up_type: string;

  @Column({ type: DataType.STRING })
  outcome: string;

  @Column({ type: DataType.DATE })
  next_action_date: Date;

  @Column({ type: DataType.TEXT })
  remarks: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  created_by?: number;
  
  @Column({ type: DataType.INTEGER, allowNull: true })
  added_by?: number;
  
  @Column({ type: DataType.INTEGER, allowNull: true })
  deleted_by?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare org_id?: string;

  @BelongsTo(() => AcquisitionLead, { foreignKey: 'lead_id', as: 'acquisition_lead' })
  declare acquisition_lead?: AcquisitionLead;
}
