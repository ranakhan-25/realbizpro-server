import { Column, DataType, Table, Index, PrimaryKey, Default, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { InvItem } from './inv_item.model';

import type { InvUnitAttributes, InvUnitCreationAttributes } from '../../types/invunit.types';

@Table({
  tableName: 'inv_units',
  timestamps: true,
  paranoid: true,
})
export class InvUnit extends BaseModel<InvUnitAttributes, InvUnitCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare id: any;

  @Index({ name: 'idx_inv_unit_code' })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  code: string;

  @Index({ name: 'idx_inv_unit_name' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  created_by?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  updated_by?: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  deleted_by?: number;

  @HasMany(() => InvItem)
  items: InvItem[];

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare projectId?: string;
}

