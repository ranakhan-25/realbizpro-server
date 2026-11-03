import {
  Table, Column, Model, DataType, HasMany,
  PrimaryKey, Default, AutoIncrement
} from 'sequelize-typescript';
import { VoucherEntry } from './acc_voucher-entry.model';

@Table({ tableName: 'vouchers', timestamps: true })
export class Voucher extends Model<Voucher> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare uuid: string;

  @Column({ type: DataType.STRING, unique: true })
  declare voucherNo: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare voucherType: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare date: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare projectType: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare projectId: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare workId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare accountId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare paymentMethod: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare chequeNo: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  declare amount: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare comment: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare attachmentUrl: string;

  @Column({ type: DataType.STRING, defaultValue: 'Draft' })
  declare status: string;

  @HasMany(() => VoucherEntry, {
    foreignKey: 'voucherId',
    sourceKey: 'uuid',
    onDelete: 'CASCADE',
  })
  declare entries: VoucherEntry[];
}
