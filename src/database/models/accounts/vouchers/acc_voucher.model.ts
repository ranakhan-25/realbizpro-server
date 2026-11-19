import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  PrimaryKey,
  Default,
  AutoIncrement,
  ForeignKey,
  BelongsTo
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

  @Column({ type: DataType.UUID, unique: true })
  declare voucherNo: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare voucherType: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare date: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare projectType: string;

  @Column({ type: DataType.UUID, allowNull: true })
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
