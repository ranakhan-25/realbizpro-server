import { Column, DataType, Table, ForeignKey, BelongsTo, Index, PrimaryKey, Default } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { AcquisitionLead } from './acquisition-lead.model';

import type { NegotiationProcessAttributes, NegotiationProcessCreationAttributes } from '../../types/negotiationprocess.types';

@Table({
  tableName: 'lams_negotiation_processes',
  timestamps: true,
  paranoid: true,
})
export class NegotiationProcess extends BaseModel<NegotiationProcessAttributes, NegotiationProcessCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare id: any;

  @Index({ name: 'idx_negotiation_process_org_id' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare org_id: string;

  @ForeignKey(() => AcquisitionLead)
  @Index({ name: 'idx_negotiation_process_lead_id' })
  @Column({ type: DataType.UUID, allowNull: false })
  lead_id: any;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
  round_no: number;

  @Column({ type: DataType.DATE, allowNull: true })
  negotiation_date: Date;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  offered_price: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  counter_amount: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  gap_amount: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  agreed_price: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  final_amount: number;

  @Column({ type: DataType.STRING(150), allowNull: true })
  negotiator?: string;

  @Index({ name: 'idx_negotiation_status' })
  @Column({ type: DataType.STRING, defaultValue: 'Pending' })
  negotiation_status: string;

  @Column({ type: DataType.DATE, allowNull: true })
  next_meeting_date?: Date;

  @Column({ type: DataType.TEXT, allowNull: true })
  meeting_notes?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  created_by?: number;
  
  @Column({ type: DataType.INTEGER, allowNull: true })
  added_by?: number;
  
  @Column({ type: DataType.INTEGER, allowNull: true })
  deleted_by?: number;

  @BelongsTo(() => AcquisitionLead, { foreignKey: 'lead_id', as: 'acquisition_lead' })
  declare acquisition_lead?: AcquisitionLead;
}
