/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { BaseModel } from '../../../base.model';
import { ChartOfGroup } from './acc_chats_of_group_model';



export interface ChartOfAccountAttributes {
  uuid?: string;
  chartOfGroupUuid?: string;
  code: string;
  name: string;
  openingBalance: number;
  under: string;
  hasDelete?: boolean;
  addedBy?: string;
  addedById?: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
}

export interface ChartOfAccountCreationAttributes extends Omit<ChartOfAccountAttributes, 'uuid'> {}
export interface ChartOfAccountUpdateAttributes extends Partial<ChartOfAccountAttributes> {}

@Table({
  tableName: 'chart_of_account',
  timestamps: true,
  paranoid: true,
  underscored: true, // ✅ snake_case কলাম আছে
})
export class ChartOfAccount
  extends BaseModel<ChartOfAccountUpdateAttributes, ChartOfAccountCreationAttributes>
  implements ChartOfAccountAttributes
{
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  declare uuid: string;

  @ForeignKey(() => ChartOfGroup)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'chart_of_group_uuid', // ✅ snake_case ম্যাপিং
  })
  declare chartOfGroupUuid?: string;

  @BelongsTo(() => ChartOfGroup, { foreignKey: 'chartOfGroupUuid', targetKey: 'uuid' })
  declare chartOfGroup?: ChartOfGroup;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'opening_balance',
  })
  declare openingBalance: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare under: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: true,
    field: 'has_delete',
  })
  declare hasDelete?: boolean;

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