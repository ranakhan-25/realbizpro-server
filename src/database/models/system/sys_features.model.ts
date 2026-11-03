import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

import { SysModules } from './sys_module.model';
import { SysPermission } from './sys_permission.model';
import { SysOrgEntitlement } from './sys_org_entitlement.model';
import { SysRoleFeature } from './sys_role_feature.model';
import { SysUserFeatureOverride } from './sys_user_feature_override.model';
import type {
  SysFeaturesAttributes,
  SysFeaturesCreationAttributes,
} from '../../types/sysfeatures.types';

@Table({
  tableName: 'sys_features',
  timestamps: true,
  paranoid: false,
  underscored: true,
  indexes: [
    { fields: ['name'], unique: true },
    { fields: ['code'], unique: true },
    { fields: ['module_id'] },
  ],
})
export class SysFeatures extends BaseModel<
  SysFeaturesAttributes,
  SysFeaturesCreationAttributes
> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    unique: true,
    field: 'code',
  })
  declare code?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'route_path',
  })
  declare routePath?: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    field: 'actions',
    defaultValue: ['read', 'write', 'update', 'delete'],
  })
  declare actions: string[];

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'display_order',
  })
  declare displayOrder: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active',
  })
  declare isActive: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;

  @ForeignKey(() => SysModules)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'module_id',
    comment: 'The module this feature belongs to',
  })
  declare moduleId?: number;

  @BelongsTo(() => SysModules, 'module_id')
  declare module?: SysModules;

  @HasMany(() => SysPermission)
  declare permissions?: SysPermission[];

  @HasMany(() => SysOrgEntitlement, 'feature_id')
  declare orgEntitlements?: SysOrgEntitlement[];

  @HasMany(() => SysRoleFeature, 'feature_id')
  declare roleFeatures?: SysRoleFeature[];

  @HasMany(() => SysUserFeatureOverride, 'feature_id')
  declare userOverrides?: SysUserFeatureOverride[];
}
