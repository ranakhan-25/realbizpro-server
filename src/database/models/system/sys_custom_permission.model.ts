import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { SysFeatures } from './sys_features.model';

import type { SysCustomPermissionAttributes, SysCustomPermissionCreationAttributes } from '../../types/syscustompermission.types';

@Table({
  tableName: 'sys_custom_permissions',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [{ fields: ['key'], unique: true }],
})
export class SysCustomPermission extends BaseModel<SysCustomPermissionAttributes, SysCustomPermissionCreationAttributes> {
  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    unique: true,
  })
  declare key: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare resource?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  declare action: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: 'any',
  })
  declare context: string;

  @ForeignKey(() => SysFeatures)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'feature_id',
  })
  declare featureId?: number;

  @BelongsTo(() => SysFeatures, {
    foreignKey: 'feature_id',
    as: 'feature',
  })
  declare feature?: SysFeatures;
}
