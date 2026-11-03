import { 
  Table, Column, Model, DataType, ForeignKey, 
  BelongsTo, PrimaryKey, AutoIncrement 
} from 'sequelize-typescript';
import { PaymentVoucher } from './acc_payment-voucher.model';

@Table({ tableName: 'payment_voucher_entries', timestamps: true })
export class PaymentVoucherEntry extends Model<PaymentVoucherEntry> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => PaymentVoucher)
  @Column(DataType.UUID)
  declare paymentVoucherId: string;

  // ================= Table Data =================
  @Column({ type: DataType.STRING, allowNull: true })
  declare projectId: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare titleId: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare code: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare debitAccount: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare creditAccount: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  declare total: number;

  @Column({ type: DataType.STRING, allowNull: true })
  declare comment: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare cheque: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare addedBy: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare editedBy: string;

  @Column({ type: DataType.STRING, defaultValue: 'Pending' })
  declare approveStatus: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare attachmentCount: number;

  @Column({ type: DataType.STRING, defaultValue: 'Pending' })
  declare status: string;

  @BelongsTo(() => PaymentVoucher, {
    foreignKey: 'paymentVoucherId',
    targetKey: 'uuid',
    onDelete: 'CASCADE',
  })
  declare paymentVoucher: PaymentVoucher;
}