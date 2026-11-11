/* eslint-disable prettier/prettier */

import { Column, DataType, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { MainBooking as Booking } from './sm_main_booking.model';

export interface BookingOverviewAttributes {
  uuid?: string;
  bookingId: string;
  
  // Property Info
  propertyName: string;
  propertyCode?: string;
  propertyType?: string;
  propertyArea?: string;
  propertyPrice: number;
  propertyLocation?: string;
  propertyImage?: string;

  // Buyer Info
  buyerName: string;
  buyerEmail?: string;
  buyerPhone?: string;
  buyerAvatar?: string;
  buyerNid?: string;

  // Financial Info
  totalPrice: number;
  amountPaid: number;
  remainingDue: number;
  nextDueDate?: Date;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface BookingOverviewCreationAttributes extends Omit<BookingOverviewAttributes, 'uuid'> {}
export interface BookingOverviewUpdateAttributes extends Partial<BookingOverviewAttributes> {}

@Table({ tableName: 'booking_overview', timestamps: true, paranoid: true, underscored: true })
export class BookingOverview
  extends BaseModel<BookingOverviewUpdateAttributes, BookingOverviewCreationAttributes>
  implements BookingOverviewAttributes
{
  @Column({ type: DataType.UUID, allowNull: false, unique: true, defaultValue: DataType.UUIDV4 })
  declare uuid: string;

  @ForeignKey(() => Booking)
  @Column({ type: DataType.UUID, allowNull: false, field: 'booking_id' })
  declare bookingId: string;

  @BelongsTo(() => Booking, { foreignKey: 'bookingId', as: 'booking' })
  declare booking?: Booking;

  // Property
  @Column({ type: DataType.STRING, allowNull: false, field: 'property_name' }) declare propertyName: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'property_code' }) declare propertyCode?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'property_type' }) declare propertyType?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'property_area' }) declare propertyArea?: string;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'property_price' }) declare propertyPrice: number;
  @Column({ type: DataType.STRING, allowNull: true, field: 'property_location' }) declare propertyLocation?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'property_image' }) declare propertyImage?: string;

  // Buyer
  @Column({ type: DataType.STRING, allowNull: false, field: 'buyer_name' }) declare buyerName: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'buyer_email' }) declare buyerEmail?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'buyer_phone' }) declare buyerPhone?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'buyer_avatar' }) declare buyerAvatar?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'buyer_nid' }) declare buyerNid?: string;

  // Financials
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'total_price' }) declare totalPrice: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'amount_paid' }) declare amountPaid: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'remaining_due' }) declare remainingDue: number;
  @Column({ type: DataType.DATEONLY, allowNull: true, field: 'next_due_date' }) declare nextDueDate?: Date;

  // Audit
  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' }) declare createdBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' }) declare updatedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' }) declare deletedBy?: string;
}