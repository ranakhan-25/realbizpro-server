/* eslint-disable prettier/prettier */

import { Column, DataType, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { MainBooking as Booking } from './sm_main_booking.model';

export interface BookingCancellationAttributes {
  uuid?: string;
  bookingId: string;
  cancellationId: string;
  status: string; // 'Pending' | 'Refund Processed'

  cancellationDate: Date;
  processedBy?: string;
  reason: string;
  notes?: string;

  // Financials
  totalPaid: number;
  cancellationFee: number;
  refundAmount: number;
  refundMethod?: string;
  refundTxnId?: string;
  refundDate?: Date;
  refundStatus?: string;

  // Property Snapshot
  propertyName: string;
  propertyCode?: string;
  propertyType?: string;
  propertyArea?: string;
  propertyImage?: string;
  propertyLocation?: string;

  // Buyer Snapshot
  buyerName: string;
  buyerEmail?: string;
  buyerPhone?: string;
  buyerAvatar?: string;
  buyerNid?: string;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface BookingCancellationCreationAttributes extends Omit<BookingCancellationAttributes, 'uuid'> {}
export interface BookingCancellationUpdateAttributes extends Partial<BookingCancellationAttributes> {}

@Table({ tableName: 'booking_cancellation', timestamps: true, paranoid: true, underscored: true })
export class BookingCancellation
  extends BaseModel<BookingCancellationUpdateAttributes, BookingCancellationCreationAttributes>
  implements BookingCancellationAttributes
{
  @Column({ type: DataType.UUID, allowNull: false, unique: true, defaultValue: DataType.UUIDV4 })
  declare uuid: string;

  @ForeignKey(() => Booking)
  @Column({ type: DataType.UUID, allowNull: false, field: 'booking_id' })
  declare bookingId: string;

  @BelongsTo(() => Booking, { foreignKey: 'bookingId', as: 'booking' })
  declare booking?: Booking;

  @Column({ type: DataType.STRING, allowNull: false, unique: true, field: 'cancellation_id' })
  declare cancellationId: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'Pending' })
  declare status: string;

  @Column({ type: DataType.DATEONLY, allowNull: false, field: 'cancellation_date' })
  declare cancellationDate: Date;

  @Column({ type: DataType.STRING, allowNull: true, field: 'processed_by' })
  declare processedBy?: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare reason: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes?: string;

  // Financials
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'total_paid' })
  declare totalPaid: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'cancellation_fee' })
  declare cancellationFee: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'refund_amount' })
  declare refundAmount: number;

  @Column({ type: DataType.STRING, allowNull: true, field: 'refund_method' })
  declare refundMethod?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'refund_txn_id' })
  declare refundTxnId?: string;

  @Column({ type: DataType.DATEONLY, allowNull: true, field: 'refund_date' })
  declare refundDate?: Date;

  @Column({ type: DataType.STRING, allowNull: true, field: 'refund_status' })
  declare refundStatus?: string;

  // Property Snapshot
  @Column({ type: DataType.STRING, allowNull: false, field: 'property_name' }) declare propertyName: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'property_code' }) declare propertyCode?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'property_type' }) declare propertyType?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'property_area' }) declare propertyArea?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'property_image' }) declare propertyImage?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'property_location' }) declare propertyLocation?: string;

  // Buyer Snapshot
  @Column({ type: DataType.STRING, allowNull: false, field: 'buyer_name' }) declare buyerName: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'buyer_email' }) declare buyerEmail?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'buyer_phone' }) declare buyerPhone?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'buyer_avatar' }) declare buyerAvatar?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'buyer_nid' }) declare buyerNid?: string;

  // Audit
  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' }) declare createdBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' }) declare updatedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' }) declare deletedBy?: string;
}