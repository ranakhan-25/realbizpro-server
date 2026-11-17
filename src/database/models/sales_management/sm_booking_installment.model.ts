/* eslint-disable prettier/prettier */

import { Column, DataType, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { MainBooking as Booking } from './sm_main_booking.model';

export interface BookingInstallmentAttributes {
  uuid?: string;
  bookingId: string;
  title: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface BookingInstallmentCreationAttributes extends Omit<BookingInstallmentAttributes, 'uuid'> {}
export interface BookingInstallmentUpdateAttributes extends Partial<BookingInstallmentAttributes> {}

@Table({ tableName: 'booking_installment', timestamps: true, paranoid: true, underscored: true })
export class BookingInstallment
  extends BaseModel<BookingInstallmentUpdateAttributes, BookingInstallmentCreationAttributes>
  implements BookingInstallmentAttributes
{
  @Column({ type: DataType.UUID, allowNull: false, unique: true, defaultValue: DataType.UUIDV4 })
  declare uuid: string;

  @ForeignKey(() => Booking)
  @Column({ type: DataType.UUID, allowNull: false, field: 'booking_id' })
  declare bookingId: string;

  @BelongsTo(() => Booking, { foreignKey: 'bookingId', as: 'booking' })
  declare booking?: Booking;

  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare amount: number;

  @Column({ type: DataType.DATEONLY, allowNull: false, field: 'due_date' })
  declare dueDate: Date;

  @Column({ type: DataType.DATEONLY, allowNull: true, field: 'paid_date' })
  declare paidDate?: Date;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'unpaid' })
  declare status: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;
}