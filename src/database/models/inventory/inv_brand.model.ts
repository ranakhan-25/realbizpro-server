import { Column, DataType, Table, Index, PrimaryKey, Default, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { InvItem } from './inv_item.model';

import type { InvBrandAttributes, InvBrandCreationAttributes } from '../../types/invbrand.types';

@Table({
  tableName: 'inv_brands',
  timestamps: true,
  paranoid: true,
})
export class InvBrand extends BaseModel<InvBrandAttributes, InvBrandCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare id: any;

  @Index({ name: 'idx_inv_brand_code' })
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  code: string;

  @Index({ name: 'idx_inv_brand_name' })
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

  @Index({ name: 'idx_inv_brand_org_id' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare org_id: string;
}

