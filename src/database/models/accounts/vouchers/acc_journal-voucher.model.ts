/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { JournalVoucherItem } from './acc_journal-voucher-item.model';


export interface JournalVoucherAttributes {
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

export interface JournalVoucherCreationAttributes extends Omit<JournalVoucherAttributes, 'uuid'> {}
export interface JournalVoucherUpdateAttributes extends Partial<JournalVoucherAttributes> {}

@Table({
  tableName: 'journal_voucher',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class JournalVoucher
  extends BaseModel<JournalVoucherUpdateAttributes, JournalVoucherCreationAttributes>
  implements JournalVoucherAttributes
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
  @HasMany(() => JournalVoucherItem)
  declare items: JournalVoucherItem[];
}