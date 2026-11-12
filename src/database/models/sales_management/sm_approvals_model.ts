/* eslint-disable prettier/prettier */
import { Column, DataType, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { MainBooking as Booking } from './sm_main_booking.model';

export enum ApprovalStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export interface BookingApprovalAttributes {
  uuid?: string;
  bookingId: string;
  approvalId: string;
  title: string;
  requestedBy: string;
  approverName?: string;
  status: ApprovalStatus;
  notes?: string;
  approvedDate?: Date;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface BookingApprovalCreationAttributes extends Omit<BookingApprovalAttributes, 'uuid'> {}
export interface BookingApprovalUpdateAttributes extends Partial<BookingApprovalAttributes> {}

@Table({ tableName: 'booking_approval', timestamps: true, paranoid: true, underscored: true })
export class BookingApproval
  extends BaseModel<BookingApprovalUpdateAttributes, BookingApprovalCreationAttributes>
  implements BookingApprovalAttributes
{
  @Column({ type: DataType.UUID, allowNull: false, unique: true, defaultValue: DataType.UUIDV4 })
  declare uuid: string;

  @ForeignKey(() => Booking)
  @Column({ type: DataType.UUID, allowNull: false, field: 'booking_id' })
  declare bookingId: string;

  @BelongsTo(() => Booking, { foreignKey: 'bookingId', as: 'booking' })
  declare booking?: Booking;

  @Column({ type: DataType.STRING, allowNull: false, unique: true, field: 'approval_id' })
  declare approvalId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'requested_by' })
  declare requestedBy: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'approver_name' })
  declare approverName?: string;

  @Column({ type: DataType.ENUM(...Object.values(ApprovalStatus)), allowNull: false, defaultValue: ApprovalStatus.PENDING })
  declare status: ApprovalStatus;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes?: string;

  @Column({ type: DataType.DATE, allowNull: true, field: 'approved_date' })
  declare approvedDate?: Date;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;
}