/* eslint-disable prettier/prettier */

import { Column, DataType, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { MainBooking as Booking } from './sm_main_booking.model';

export interface BookingAgreementAttributes {
  uuid?: string;
  bookingId: string;
  agreementDate?: Date;
  signedByBuyer: boolean;
  signedBySeller: boolean;
  documentUrl?: string;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface BookingAgreementCreationAttributes extends Omit<BookingAgreementAttributes, 'uuid'> {}
export interface BookingAgreementUpdateAttributes extends Partial<BookingAgreementAttributes> {}

@Table({ tableName: 'booking_agreement', timestamps: true, paranoid: true, underscored: true })
export class BookingAgreement
  extends BaseModel<BookingAgreementUpdateAttributes, BookingAgreementCreationAttributes>
  implements BookingAgreementAttributes
{
  @Column({ type: DataType.UUID, allowNull: false, unique: true, defaultValue: DataType.UUIDV4 })
  declare uuid: string;

  @ForeignKey(() => Booking)
  @Column({ type: DataType.UUID, allowNull: false, field: 'booking_id' })
  declare bookingId: string;

  @BelongsTo(() => Booking, { foreignKey: 'bookingId', as: 'booking' })
  declare booking?: Booking;

  @Column({ type: DataType.DATEONLY, allowNull: true, field: 'agreement_date' })
  declare agreementDate?: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false, field: 'signed_by_buyer' })
  declare signedByBuyer: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false, field: 'signed_by_seller' })
  declare signedBySeller: boolean;

  @Column({ type: DataType.STRING, allowNull: true, field: 'document_url' })
  declare documentUrl?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;
}
