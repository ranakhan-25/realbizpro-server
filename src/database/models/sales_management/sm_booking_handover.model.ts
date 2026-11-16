/* eslint-disable prettier/prettier */

import { Column, DataType, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { MainBooking as Booking } from './sm_main_booking.model';

export interface BookingHandoverAttributes {
  uuid?: string;
  bookingId: string;
  handoverId: string;
  status: string; // 'Completed' | 'Pending'
  
  handoverDate: Date;
  handoverTime?: string;

  // Utilities
  electricityReading?: string;
  waterReading?: string;
  gasReading?: string;

  // Checklist (JSON Array of { label: string, done: boolean })
  checklist?: any;

  // Property Snapshot
  propertyName: string;
  propertyCode?: string;
  propertyImage?: string;
  propertyLocation?: string;

  // Buyer Snapshot
  buyerName: string;
  buyerAvatar?: string;
  buyerPhone?: string;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface BookingHandoverCreationAttributes extends Omit<BookingHandoverAttributes, 'uuid'> {}
export interface BookingHandoverUpdateAttributes extends Partial<BookingHandoverAttributes> {}

@Table({ tableName: 'booking_handover', timestamps: true, paranoid: true, underscored: true })
export class BookingHandover
  extends BaseModel<BookingHandoverUpdateAttributes, BookingHandoverCreationAttributes>
  implements BookingHandoverAttributes
{
  @Column({ type: DataType.UUID, allowNull: false, unique: true, defaultValue: DataType.UUIDV4 })
  declare uuid: string;

  @ForeignKey(() => Booking)
  @Column({ type: DataType.UUID, allowNull: false, field: 'booking_id' })
  declare bookingId: string;

  @BelongsTo(() => Booking, { foreignKey: 'bookingId', as: 'booking' })
  declare booking?: Booking;

  @Column({ type: DataType.STRING, allowNull: false, unique: true, field: 'handover_id' })
  declare handoverId: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'Pending' })
  declare status: string;

  @Column({ type: DataType.DATEONLY, allowNull: false, field: 'handover_date' })
  declare handoverDate: Date;

  @Column({ type: DataType.STRING, allowNull: true, field: 'handover_time' })
  declare handoverTime?: string;

  // Utilities
  @Column({ type: DataType.STRING, allowNull: true, field: 'electricity_reading' })
  declare electricityReading?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'water_reading' })
  declare waterReading?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'gas_reading' })
  declare gasReading?: string;

  // Checklist
  @Column({ type: DataType.JSON, allowNull: true })
  declare checklist?: any;

  // Property Snapshot
  @Column({ type: DataType.STRING, allowNull: false, field: 'property_name' }) declare propertyName: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'property_code' }) declare propertyCode?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'property_image' }) declare propertyImage?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'property_location' }) declare propertyLocation?: string;

  // Buyer Snapshot
  @Column({ type: DataType.STRING, allowNull: false, field: 'buyer_name' }) declare buyerName: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'buyer_avatar' }) declare buyerAvatar?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'buyer_phone' }) declare buyerPhone?: string;

  // Audit
  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' }) declare createdBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' }) declare updatedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' }) declare deletedBy?: string;
}