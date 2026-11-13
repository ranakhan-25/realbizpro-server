/* eslint-disable prettier/prettier */

import { Column, DataType, Table, HasMany, HasOne } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

// Import all related models
import { BookingOverview } from './sm_booking_overview.model';
import { BookingRegistration } from './sm_booking_registration.model';
import { BookingAgreement } from './sm_booking_agreement.model';
import { BookingCancellation } from './sm_booking_cancellation.model';
import { BookingCommission } from './sm_booking_commission.model';
import { BookingDocument } from './sm_booking_document.model';
import { BookingHandover } from './sm_booking_handover.model';
import { BookingInstallment } from './sm_booking_installment.model';
import { BookingTransfer } from './sm_booking_transfer.model';

export enum BookingStatus {
  CONFIRMED = 'Confirmed',
  PENDING = 'Pending',
  CANCELLED = 'Cancelled',
}

export interface BookingAttributes {
  uuid?: string;
  bookingCode: string;
  status: BookingStatus;
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
export class MainBooking
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    field: 'booking_code',
  })
  declare bookingCode: string;

  @Column({
    type: DataType.ENUM(...Object.values(BookingStatus)),
    allowNull: false,
    defaultValue: BookingStatus.CONFIRMED,
  })
  declare status: BookingStatus;

  // ==========================================
  // 🔗 RELATIONS (Based on your route folders)
  // ==========================================

  @HasOne(() => BookingOverview, { foreignKey: 'bookingId', as: 'overview' })
  declare overview?: BookingOverview;

  @HasOne(() => BookingRegistration, { foreignKey: 'bookingId', as: 'registration' })
  declare registration?: BookingRegistration;

  @HasOne(() => BookingAgreement, { foreignKey: 'bookingId', as: 'agreement' })
  declare agreement?: BookingAgreement;

  @HasOne(() => BookingCancellation, { foreignKey: 'bookingId', as: 'cancellation' })
  declare cancellation?: BookingCancellation;

  @HasOne(() => BookingHandover, { foreignKey: 'bookingId', as: 'handover' })
  declare handover?: BookingHandover;

  @HasOne(() => BookingTransfer, { foreignKey: 'bookingId', as: 'transfer' })
  declare transfer?: BookingTransfer;

  @HasMany(() => BookingDocument, { foreignKey: 'bookingId', as: 'documents' })
  declare documents?: BookingDocument[];

  @HasMany(() => BookingInstallment, { foreignKey: 'bookingId', as: 'installments' })
  declare installments?: BookingInstallment[];

  @HasMany(() => BookingCommission, { foreignKey: 'bookingId', as: 'commissions' })
  declare commissions?: BookingCommission[];

  // Audit Fields
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
