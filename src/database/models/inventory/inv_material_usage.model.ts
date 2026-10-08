import { Column, DataType, Table, Index, PrimaryKey, Default, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { InvMaterialUsageItem } from './inv_material_usage_item.model';

import type { InvMaterialUsageAttributes, InvMaterialUsageCreationAttributes } from '../../types/invmaterialusage.types';

@Table({
  tableName: 'inv_material_usages',
  timestamps: true,
  paranoid: true,
})
export class InvMaterialUsage extends BaseModel<InvMaterialUsageAttributes, InvMaterialUsageCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID, allowNull: false, unique: true })
  declare id: any;

  @Index({ name: 'idx_inv_usage_date' })
  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;

  @Column({ type: DataType.TEXT, allowNull: true })
  note?: string;

  @Column({ type: DataType.BIGINT, allowNull: true })
  company_id?: number;

  @Index({ name: 'idx_inv_usage_project' })
  @Column({ type: DataType.BIGINT, allowNull: true })
  project_id?: number;

  @Column({ type: DataType.BIGINT, allowNull: true })
  site_id?: number;

  @Column({ type: DataType.BIGINT, allowNull: true })
  task_id?: number;

  @Column({ type: DataType.BIGINT, allowNull: true })
  worker_id?: number;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @HasMany(() => InvMaterialUsageItem, { foreignKey: 'usage_id', as: 'items' })
  items: InvMaterialUsageItem[];
}
