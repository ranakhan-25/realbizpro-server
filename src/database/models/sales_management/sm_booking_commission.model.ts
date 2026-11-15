/* eslint-disable prettier/prettier */

import { Column, DataType, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { MainBooking as Booking } from './sm_main_booking.model';

export interface BookingCommissionAttributes {
  uuid?: string;
  bookingId: string;
  commissionId: string;
  status: string; // 'Paid' | 'Pending'
  
  dealValue: number;
  commissionRate: number;
  grossCommission: number;
  deductions: number;
  netCommission: number;
  
  paidDate?: Date;
  txnId?: string;

  // Agent Snapshot
  agentName: string;
  agentRole?: string;
  agentAvatar?: string;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface BookingCommissionCreationAttributes extends Omit<BookingCommissionAttributes, 'uuid'> {}
export interface BookingCommissionUpdateAttributes extends Partial<BookingCommissionAttributes> {}

@Table({ tableName: 'booking_commission', timestamps: true, paranoid: true, underscored: true })
export class BookingCommission
  extends BaseModel<BookingCommissionUpdateAttributes, BookingCommissionCreationAttributes>
  implements BookingCommissionAttributes
{
  @Column({ type: DataType.UUID, allowNull: false, unique: true, defaultValue: DataType.UUIDV4 })
  declare uuid: string;

  @ForeignKey(() => Booking)
  @Column({ type: DataType.UUID, allowNull: false, field: 'booking_id' })
  declare bookingId: string;

  @BelongsTo(() => Booking, { foreignKey: 'bookingId', as: 'booking' })
  declare booking?: Booking;

  @Column({ type: DataType.STRING, allowNull: false, unique: true, field: 'commission_id' })
  declare commissionId: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'Pending' })
  declare status: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'deal_value' })
  declare dealValue: number;

  @Column({ type: DataType.DECIMAL(5, 2), allowNull: false, defaultValue: 0, field: 'commission_rate' })
  declare commissionRate: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'gross_commission' })
  declare grossCommission: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare deductions: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'net_commission' })
  declare netCommission: number;

  @Column({ type: DataType.DATEONLY, allowNull: true, field: 'paid_date' })
  declare paidDate?: Date;

  @Column({ type: DataType.STRING, allowNull: true, field: 'txn_id' })
  declare txnId?: string;

  // Agent Snapshot
  @Column({ type: DataType.STRING, allowNull: false, field: 'agent_name' }) declare agentName: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'agent_role' }) declare agentRole?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'agent_avatar' }) declare agentAvatar?: string;

  // Audit
  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' }) declare createdBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' }) declare updatedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' }) declare deletedBy?: string;
}