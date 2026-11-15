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

  // Buyer Info
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerNid?: string;

  // Property Info
  propertyId: string;
  propertyName: string;
  propertyPrice: number;

  // Schedule Info
  visitDate: Date;
  startTime: string;
  endTime: string;
  agentId?: string;
  agentName?: string;

  // Location Info
  area?: string;
  address?: string;
  city?: string;
  country?: string;

  // Addons (JSON Array)
  selectedAddons?: { id: string; name: string; price: number }[];

  // Payment Info
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;

  // Other
  notes?: string;

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
export class BookingCreate
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

  // Buyer Info
  @Column({ type: DataType.STRING, allowNull: false, field: 'buyer_name' })
  declare buyerName: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'buyer_email' })
  declare buyerEmail: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'buyer_phone' })
  declare buyerPhone: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'buyer_nid' })
  declare buyerNid?: string;

  // Property Info
  @Column({ type: DataType.STRING, allowNull: false, field: 'property_id' })
  declare propertyId: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'property_name' })
  declare propertyName: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, field: 'property_price' })
  declare propertyPrice: number;

  // Schedule Info
  @Column({ type: DataType.DATEONLY, allowNull: false, field: 'visit_date' })
  declare visitDate: Date;

  @Column({ type: DataType.STRING, allowNull: false, field: 'start_time' })
  declare startTime: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'end_time' })
  declare endTime: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'agent_id' })
  declare agentId?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'agent_name' })
  declare agentName?: string;

  // Location Info
  @Column({ type: DataType.STRING, allowNull: true })
  declare area?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare address?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare city?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare country?: string;

  // Addons (JSON)
  @Column({ type: DataType.JSONB, allowNull: true, field: 'selected_addons' })
  declare selectedAddons?: { id: string; name: string; price: number }[];

  // Payment Info
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare subtotal: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare tax: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare discount: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'total_amount' })
  declare totalAmount: number;

  @Column({ type: DataType.STRING, allowNull: false, field: 'payment_method' })
  declare paymentMethod: string;

  // Other
  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes?: string;

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
