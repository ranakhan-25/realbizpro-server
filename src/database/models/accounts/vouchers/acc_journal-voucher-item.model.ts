import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { JournalVoucher } from './acc_journal-voucher.model';


export enum EntryType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export interface JournalVoucherItemAttributes {
  uuid?: string;
  journalVoucherUuid: string;
  entryType: EntryType;
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
  chequeReceiptNo?: string;
  note?: string;
}

export interface JournalVoucherItemCreationAttributes extends Omit<JournalVoucherItemAttributes, 'uuid'> {}
export interface JournalVoucherItemUpdateAttributes extends Partial<JournalVoucherItemAttributes> {}

@Table({
  tableName: 'journal_voucher_item',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class JournalVoucherItem
  extends BaseModel<JournalVoucherItemUpdateAttributes, JournalVoucherItemCreationAttributes>
  implements JournalVoucherItemAttributes
{
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare uuid: string;

  @ForeignKey(() => JournalVoucher)
  @Column({ type: DataType.UUID, allowNull: false, field: 'journal_voucher_uuid' })
  declare journalVoucherUuid: string;

  @BelongsTo(() => JournalVoucher, { foreignKey: 'journalVoucherUuid', targetKey: 'uuid' })
  declare journalVoucher?: JournalVoucher;

  @Column({ type: DataType.ENUM(...Object.values(EntryType)), allowNull: false, field: 'entry_type' })
  declare entryType: EntryType;

  @Column({ type: DataType.STRING, allowNull: false, field: 'account_id' })
  declare accountId: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'account_name' })
  declare accountName: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare debit: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, defaultValue: 0 })
  declare credit: number;

  @Column({ type: DataType.STRING, allowNull: true, field: 'cheque_receipt_no' })
  declare chequeReceiptNo?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare note?: string;

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
    as: 'project',
  })
  declare project?: Project;

}