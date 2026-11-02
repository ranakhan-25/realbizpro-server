import { 
  Table, Column, Model, DataType, HasMany, 
  PrimaryKey, Default, AutoIncrement
} from 'sequelize-typescript';
import { PaymentVoucherEntry } from './acc_payment-voucher-entry.model';

@Table({ tableName: 'payment_vouchers', timestamps: true })
export class PaymentVoucher extends Model<PaymentVoucher> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare uuid: string;

  @Column({ type: DataType.STRING, unique: true })
  declare voucherNo: string; // e.g., P00005

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare date: string;

  // ================= Voucher Info =================
  @Column({ type: DataType.STRING, allowNull: true })
  declare projectType: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare projectId: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare workId: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare taskId: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare siteId: string;

  // ================= Payment Info =================
  @Column({ type: DataType.STRING, allowNull: false })
  declare accountId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare paymentMethod: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare isCheque: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  declare chequeNo: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare comment: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  declare amount: number;

  // ================= Additional =================
  @Column({ type: DataType.STRING, allowNull: true })
  declare invoiceId: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare itemId: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare attachmentUrl: string;

  @Column({ type: DataType.STRING, defaultValue: 'Pending' })
  declare status: string; // Pending, Approved

  // ================= Relation =================
  @HasMany(() => PaymentVoucherEntry, {
    foreignKey: 'paymentVoucherId',
    sourceKey: 'uuid',
    onDelete: 'CASCADE',
  })
  declare entries: PaymentVoucherEntry[];
}