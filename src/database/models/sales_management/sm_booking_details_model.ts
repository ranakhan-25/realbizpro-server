/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

export enum BookingStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed',
}

export interface BookingAttributes {
  uuid?: string;
  bookingId: string;
  status: BookingStatus;

  // Property Info
  propertyName: string;
  propertyCategory: string;
  propertySize: string;
  propertyFacing: string;
  propertyPlotNo: string;

  // Schedule Info
  visitDate: Date;
  startTime: string;
  endTime: string;
  duration: string;

  // Location Info
  area: string;
  address: string;
  city: string;
  country: string;

  // Buyer Info
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerNid: string;

  // Payment Info
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  transactionId?: string;

  // Other Info
  notes?: string;
  agentName?: string;
  agentEmail?: string;

  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface BookingCreationAttributes extends Omit<BookingAttributes, 'uuid'> {}
export interface BookingUpdateAttributes extends Partial<BookingAttributes> {}

@Table({
  tableName: 'booking',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class BookingDetails
  extends BaseModel<BookingUpdateAttributes, BookingCreationAttributes>
  implements BookingAttributes
{
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare uuid: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true, field: 'booking_id' })
  declare bookingId: string;

  @Column({
    type: DataType.ENUM(...Object.values(BookingStatus)),
    allowNull: false,
    defaultValue: BookingStatus.PENDING,
  })
  declare status: BookingStatus;

  // Property
  @Column({ type: DataType.STRING, allowNull: false, field: 'property_name' })
  declare propertyName: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'property_category' })
  declare propertyCategory: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'property_size' })
  declare propertySize: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'property_facing' })
  declare propertyFacing: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'property_plot_no' })
  declare propertyPlotNo: string;

  // Schedule
  @Column({ type: DataType.DATEONLY, allowNull: true, field: 'visit_date' })
  declare visitDate: Date;

  @Column({ type: DataType.STRING, allowNull: true, field: 'start_time' })
  declare startTime: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'end_time' })
  declare endTime: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare duration: string;

  // Location
  @Column({ type: DataType.STRING, allowNull: true })
  declare area: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare address: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare city: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare country: string;

  // Customer
  @Column({ type: DataType.STRING, allowNull: false, field: 'buyer_name' })
  declare buyerName: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'buyer_email' })
  declare buyerEmail: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'buyer_phone' })
  declare buyerPhone: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'buyer_nid' })
  declare buyerNid: string;

  // Payment
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare subtotal: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare tax: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare discount: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'total_amount' })
  declare totalAmount: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'paid_amount' })
  declare paidAmount: number;

  @Column({ type: DataType.STRING, allowNull: true, field: 'payment_status' })
  declare paymentStatus: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'payment_method' })
  declare paymentMethod: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'transaction_id' })
  declare transactionId?: string;

  // Other
  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'agent_name' })
  declare agentName?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'agent_email' })
  declare agentEmail?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'added_by' })
  declare addedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'added_by_id' })
  declare addedById?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;
}
