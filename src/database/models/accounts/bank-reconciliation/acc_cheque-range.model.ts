/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { Cheque } from './acc_cheque.model';

export interface ChequeRangeAttributes {
  uuid?: string;
  cashBank: string;
  name: string;
  fromNumber: number;
  toNumber: number;
  numberOfCheque: number;
  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface ChequeRangeCreationAttributes extends Omit<ChequeRangeAttributes, 'uuid'> {}
export interface ChequeRangeUpdateAttributes extends Partial<ChequeRangeAttributes> {}

@Table({
  tableName: 'cheque_range',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ChequeRange
  extends BaseModel<ChequeRangeUpdateAttributes, ChequeRangeCreationAttributes>
  implements ChequeRangeAttributes
{
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare uuid: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'cash_bank' })
  declare cashBank: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.INTEGER, allowNull: false, field: 'from_number' })
  declare fromNumber: number;

  @Column({ type: DataType.INTEGER, allowNull: false, field: 'to_number' })
  declare toNumber: number;

  @Column({ type: DataType.INTEGER, allowNull: false, field: 'number_of_cheque' })
  declare numberOfCheque: number;

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

  // ✅ HasMany রিলেশন: একটি চেক রেঞ্জের অধীনে একাধিক চেক
  @HasMany(() => Cheque)
  declare cheques: Cheque[];
}