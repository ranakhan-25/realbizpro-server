/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ContraVoucher } from './acc_contra-voucher.model';


export enum EntryType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export interface ContraVoucherItemAttributes {
  uuid?: string;
  contraVoucherUuid: string;
  entryType: EntryType;
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
  chequeReceiptNo?: string;
  note?: string;
}

export interface ContraVoucherItemCreationAttributes extends Omit<ContraVoucherItemAttributes, 'uuid'> {}
export interface ContraVoucherItemUpdateAttributes extends Partial<ContraVoucherItemAttributes> {}

@Table({
  tableName: 'contra_voucher_item',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ContraVoucherItem
  extends BaseModel<ContraVoucherItemUpdateAttributes, ContraVoucherItemCreationAttributes>
  implements ContraVoucherItemAttributes
{
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare uuid: string;

  @ForeignKey(() => ContraVoucher)
  @Column({ type: DataType.UUID, allowNull: false, field: 'contra_voucher_uuid' })
  declare contraVoucherUuid: string;

  @BelongsTo(() => ContraVoucher, { foreignKey: 'contraVoucherUuid', targetKey: 'uuid' })
  declare contraVoucher?: ContraVoucher;

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
}