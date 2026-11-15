/* eslint-disable prettier/prettier */

import { Column, DataType, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { MainBooking as Booking } from './sm_main_booking.model';

export interface BookingTransferAttributes {
  uuid?: string;
  bookingId: string;
  transferId: string;
  status: string; // 'Approved' | 'Pending'

  transferDate: Date;
  reason: string;

  // Property Snapshot
  propertyName: string;
  propertyCode?: string;
  propertyImage?: string;
  propertyLocation?: string;

  // From Buyer Snapshot
  fromBuyerName: string;
  fromBuyerNid?: string;

  // To Buyer Snapshot
  toBuyerName: string;
  toBuyerNid?: string;
  toBuyerPhone?: string;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface BookingTransferCreationAttributes extends Omit<BookingTransferAttributes, 'uuid'> {}
export interface BookingTransferUpdateAttributes extends Partial<BookingTransferAttributes> {}

@Table({ tableName: 'booking_transfer', timestamps: true, paranoid: true, underscored: true })
export class BookingTransfer
  extends BaseModel<BookingTransferUpdateAttributes, BookingTransferCreationAttributes>
  implements BookingTransferAttributes
{
  @Column({ type: DataType.UUID, allowNull: false, unique: true, defaultValue: DataType.UUIDV4 })
  declare uuid: string;

  @ForeignKey(() => Booking)
  @Column({ type: DataType.UUID, allowNull: false, field: 'booking_id' })
  declare bookingId: string;

  @BelongsTo(() => Booking, { foreignKey: 'bookingId', as: 'booking' })
  declare booking?: Booking;

  @Column({ type: DataType.STRING, allowNull: false, unique: true, field: 'transfer_id' })
  declare transferId: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'Pending' })
  declare status: string;

  @Column({ type: DataType.DATEONLY, allowNull: false, field: 'transfer_date' })
  declare transferDate: Date;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare reason: string;

  // Property Snapshot
  @Column({ type: DataType.STRING, allowNull: false, field: 'property_name' }) declare propertyName: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'property_code' }) declare propertyCode?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'property_image' }) declare propertyImage?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'property_location' }) declare propertyLocation?: string;

  // From Buyer Snapshot
  @Column({ type: DataType.STRING, allowNull: false, field: 'from_buyer_name' }) declare fromBuyerName: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'from_buyer_nid' }) declare fromBuyerNid?: string;

  // To Buyer Snapshot
  @Column({ type: DataType.STRING, allowNull: false, field: 'to_buyer_name' }) declare toBuyerName: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'to_buyer_nid' }) declare toBuyerNid?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'to_buyer_phone' }) declare toBuyerPhone?: string;

  // Audit
  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' }) declare createdBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' }) declare updatedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' }) declare deletedBy?: string;
}