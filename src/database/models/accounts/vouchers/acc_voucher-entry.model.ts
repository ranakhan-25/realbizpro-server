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
import { Voucher } from './acc_voucher.model';

@Table({ tableName: 'voucher_entries', timestamps: true })
export class VoucherEntry extends Model<VoucherEntry> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => Voucher)
  @Column(DataType.UUID)
  declare voucherId: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare projectId: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare code: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare accountName: string;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  declare credit: number;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  declare debit: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  declare total: number;

  @Column({ type: DataType.STRING, allowNull: true })
  declare ref: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare chequeReceipt: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare comment: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare addedBy: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare attachmentCount: number;

  @Column({ type: DataType.STRING, defaultValue: 'Pending' })
  declare approveStatus: string;

  @BelongsTo(() => Voucher, {
    foreignKey: 'voucherId',
    targetKey: 'uuid',
    onDelete: 'CASCADE',
  })
  declare voucher: Voucher;

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
