import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
  HasMany,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ContraVoucherItem } from './acc_contra-voucher-item.model';


export interface ContraVoucherAttributes {
  uuid?: string;
  voucherNo: string;
  date: Date;
  projectType?: string;
  titleOfWork?: string;
  project?: string;
  site?: string;
  task?: string;
  comment?: string;
  attachmentUrl?: string;
  totalDebit: number;
  totalCredit: number;
  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface ContraVoucherCreationAttributes extends Omit<ContraVoucherAttributes, 'uuid'> {}
export interface ContraVoucherUpdateAttributes extends Partial<ContraVoucherAttributes> {}

@Table({
  tableName: 'contra_voucher',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ContraVoucher
  extends BaseModel<ContraVoucherUpdateAttributes, ContraVoucherCreationAttributes>
  implements ContraVoucherAttributes
{
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare uuid: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true, field: 'voucher_no' })
  declare voucherNo: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare date: Date;

  @Column({ type: DataType.STRING, allowNull: true, field: 'project_type' })
  declare projectType?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'title_of_work' })
  declare titleOfWork?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare project?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare site?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare task?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare comment?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'attachment_url' })
  declare attachmentUrl?: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'total_debit' })
  declare totalDebit: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0, field: 'total_credit' })
  declare totalCredit: number;

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

  // ✅ HasMany রিলেশন: একটি ভাউচারের অধীনে একাধিক এন্ট্রি
  @HasMany(() => ContraVoucherItem)
  declare items: ContraVoucherItem[];

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

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'project_id',
    defaultValue: null,
  })
  declare projectId?: string | null;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'projectRel',
  })
  declare projectRel?: Project;

}