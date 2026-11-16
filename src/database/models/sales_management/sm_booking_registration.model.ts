/* eslint-disable prettier/prettier */

import { Column, DataType, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { MainBooking as Booking } from './sm_main_booking.model';

export interface BookingRegistrationAttributes {
  uuid?: string;
  bookingId: string;
  registrationId: string;
  status: string; // 'Completed' | 'Pending'
  
  deedNo: string;
  registrationDate: Date;
  subRegistry: string;

  // Financials
  propertyValue: number;
  stampDuty: number;
  registrationFee: number;
  totalPaid: number;

  // Mutation
  mutationStatus?: string;
  mutationKhatiyanNo?: string;
  mutationUpdatedDate?: Date;

  // Property Snapshot
  propertyName: string;
  propertyCode?: string;
  propertyType?: string;
  propertyArea?: string;
  propertyImage?: string;
  propertyLocation?: string;

  // Buyer Snapshot
  buyerName: string;
  buyerNid?: string;

  // Seller Snapshot
  sellerName: string;
  sellerRep?: string;

  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface BookingRegistrationCreationAttributes extends Omit<BookingRegistrationAttributes, 'uuid'> {}
export interface BookingRegistrationUpdateAttributes extends Partial<BookingRegistrationAttributes> {}

@Table({ tableName: 'booking_registration', timestamps: true, paranoid: true, underscored: true })
export class BookingRegistration
  extends BaseModel<BookingRegistrationUpdateAttributes, BookingRegistrationCreationAttributes>
  implements BookingRegistrationAttributes
{
  @Column({ type: DataType.UUID, allowNull: false, unique: true, defaultValue: DataType.UUIDV4 })
  declare uuid: string;

  @ForeignKey(() => Booking)
  @Column({ type: DataType.UUID, allowNull: false, field: 'booking_id' })
  declare bookingId: string;

  @BelongsTo(() => Booking, { foreignKey: 'bookingId', as: 'booking' })
  declare booking?: Booking;

  @Column({ type: DataType.STRING, allowNull: false, unique: true, field: 'registration_id' })
  declare registrationId: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'Pending' })
  declare status: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'deed_no' })
  declare deedNo: string;

  @Column({ type: DataType.DATEONLY, allowNull: false, field: 'registration_date' })
  declare registrationDate: Date;

  @Column({ type: DataType.STRING, allowNull: false, field: 'sub_registry' })
  declare subRegistry: string;

  // Financials
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'property_value' })
  declare propertyValue: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'stamp_duty' })
  declare stampDuty: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'registration_fee' })
  declare registrationFee: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'total_paid' })
  declare totalPaid: number;

  // Mutation
  @Column({ type: DataType.STRING, allowNull: true, field: 'mutation_status' })
  declare mutationStatus?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'mutation_khatiyan_no' })
  declare mutationKhatiyanNo?: string;

  @Column({ type: DataType.DATEONLY, allowNull: true, field: 'mutation_updated_date' })
  declare mutationUpdatedDate?: Date;

  // Property Snapshot
  @Column({ type: DataType.STRING, allowNull: false, field: 'property_name' }) declare propertyName: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'property_code' }) declare propertyCode?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'property_type' }) declare propertyType?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'property_area' }) declare propertyArea?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'property_image' }) declare propertyImage?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'property_location' }) declare propertyLocation?: string;

  // Buyer Snapshot
  @Column({ type: DataType.STRING, allowNull: false, field: 'buyer_name' }) declare buyerName: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'buyer_nid' }) declare buyerNid?: string;

  // Seller Snapshot
  @Column({ type: DataType.STRING, allowNull: false, field: 'seller_name' }) declare sellerName: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'seller_rep' }) declare sellerRep?: string;

  // Audit
  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' }) declare createdBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' }) declare updatedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' }) declare deletedBy?: string;
}