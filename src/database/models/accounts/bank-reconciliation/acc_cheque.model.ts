/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ChequeRange } from './acc_cheque-range.model';

export enum ChequeStatus {
  AVAILABLE = 'Available',
  USED = 'Used',
  CANCELLED = 'Cancelled',
}

export interface ChequeAttributes {
  uuid?: string;
  chequeRangeUuid: string;
  instrumentNumber: string;
  chequeStatus: ChequeStatus;
  instrumentDate?: Date;
  favouringName?: string;
  amount?: number;
  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface ChequeCreationAttributes extends Omit<ChequeAttributes, 'uuid'> {}
export interface ChequeUpdateAttributes extends Partial<ChequeAttributes> {}

@Table({
  tableName: 'cheque',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Cheque
  extends BaseModel<ChequeUpdateAttributes, ChequeCreationAttributes>
  implements ChequeAttributes
{
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare uuid: string;

  // ✅ ForeignKey: কোন রেঞ্জের অধীনে এই চেক
  @ForeignKey(() => ChequeRange)
  @Column({ type: DataType.UUID, allowNull: false, field: 'cheque_range_uuid' })
  declare chequeRangeUuid: string;

  @BelongsTo(() => ChequeRange, { foreignKey: 'chequeRangeUuid', targetKey: 'uuid' })
  declare chequeRange?: ChequeRange;

  @Column({ type: DataType.STRING, allowNull: false, field: 'instrument_number' })
  declare instrumentNumber: string;

  @Column({
    type: DataType.ENUM(...Object.values(ChequeStatus)),
    allowNull: false,
    defaultValue: ChequeStatus.AVAILABLE,
    field: 'cheque_status',
  })
  declare chequeStatus: ChequeStatus;

  @Column({ type: DataType.DATEONLY, allowNull: true, field: 'instrument_date' })
  declare instrumentDate?: Date;

  @Column({ type: DataType.STRING, allowNull: true, field: 'favouring_name' })
  declare favouringName?: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true, defaultValue: 0 })
  declare amount?: number;

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
}