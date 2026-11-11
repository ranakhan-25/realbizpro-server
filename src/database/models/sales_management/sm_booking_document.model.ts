/* eslint-disable prettier/prettier */

import { Column, DataType, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { MainBooking as Booking } from './sm_main_booking.model';

export interface BookingDocumentAttributes {
  uuid?: string;
  bookingId: string;
  category: string; // e.g., 'Legal & Agreements', 'KYC & Buyer Info'
  fileName: string;
  fileUrl: string;
  fileSize?: string;
  fileType?: string; // e.g., 'pdf', 'img'
  uploadedDate: Date;
  
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface BookingDocumentCreationAttributes extends Omit<BookingDocumentAttributes, 'uuid'> {}
export interface BookingDocumentUpdateAttributes extends Partial<BookingDocumentAttributes> {}

@Table({ tableName: 'booking_document', timestamps: true, paranoid: true, underscored: true })
export class BookingDocument
  extends BaseModel<BookingDocumentUpdateAttributes, BookingDocumentCreationAttributes>
  implements BookingDocumentAttributes
{
  @Column({ type: DataType.UUID, allowNull: false, unique: true, defaultValue: DataType.UUIDV4 })
  declare uuid: string;

  @ForeignKey(() => Booking)
  @Column({ type: DataType.UUID, allowNull: false, field: 'booking_id' })
  declare bookingId: string;

  @BelongsTo(() => Booking, { foreignKey: 'bookingId', as: 'booking' })
  declare booking?: Booking;

  @Column({ type: DataType.STRING, allowNull: false })
  declare category: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'file_name' })
  declare fileName: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'file_url' })
  declare fileUrl: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'file_size' })
  declare fileSize?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'file_type' })
  declare fileType?: string;

  @Column({ type: DataType.DATEONLY, allowNull: false, field: 'uploaded_date' })
  declare uploadedDate: Date;

  // Audit
  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' }) declare createdBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' }) declare updatedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' }) declare deletedBy?: string;
}