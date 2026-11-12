import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  Index,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { BookingCreate as Booking } from './sm_booking_create_model';

export enum CancellationReason {
  BUYER_CHANGED_MIND = 'Buyer Changed Mind',
  FAILED_FINANCING = 'Failed to Secure Financing',
  FOUND_BETTER_PROPERTY = 'Found Better Property',
  LEGAL_ISSUES = 'Legal / Title Issues',
  DELAY_HANDOVER = 'Delay in Handover',
  MUTUAL_AGREEMENT = 'Mutual Agreement',
  OTHER = 'Other',
}

export enum CancellationStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  COMPLETED = 'Completed',
}

@Table({
  tableName: 'cancellations',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'cancellations_cancellation_code',
      unique: true,
      fields: ['cancellation_code'],
    },
  ],
})
export class Cancellation extends Model<Cancellation> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    field: 'cancellation_code',
  })
  declare cancellationCode: string;

  @ForeignKey(() => Booking)
  @Index
  @Column({ type: DataType.BIGINT, allowNull: false, field: 'booking_id' })
  declare bookingId: number;

  @BelongsTo(() => Booking)
  declare booking?: Booking;

  @Column({
    type: DataType.ENUM(...Object.values(CancellationReason)),
    allowNull: false,
  })
  declare reason: CancellationReason;

  @Column({ type: DataType.DATEONLY, allowNull: false, field: 'cancellation_date' })
  declare cancellationDate: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, field: 'refund_amount' })
  declare refundAmount: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, field: 'penalty_fee' })
  declare penaltyFee: number;

  @Default(0)
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, field: 'paid_amount' })
  declare paidAmount: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes: string | null;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false, field: 'is_acknowledged' })
  declare isAcknowledged: boolean;

  @Default(CancellationStatus.PENDING)
  @Column({
    type: DataType.ENUM(...Object.values(CancellationStatus)),
    allowNull: false,
  })
  declare status: CancellationStatus;

  @Column({ type: DataType.STRING(120), allowNull: true, field: 'processed_by' })
  declare processedBy: string | null;

  @Column({ type: DataType.DATE, allowNull: true, field: 'processed_at' })
  declare processedAt: Date | null;

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  declare deletedAt: Date | null;
}
