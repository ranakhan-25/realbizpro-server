import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement
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
  @Column({ type: DataType.UUID, allowNull: true })
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

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @ForeignKey(() => SysOrganization)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'org_id',
    defaultValue: null,
  })
  declare orgId?: number | null;

  @BelongsTo(() => SysOrganization, {
    foreignKey: 'orgId',
    targetKey: 'id',
    as: 'organization',
  })
  declare organization?: SysOrganization;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
  })
  declare project?: Project;

}