import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { SysUser } from './sys_user.model';
import { SysFeatures } from './sys_features.model';

import type { SysUserFeatureOverrideAttributes, SysUserFeatureOverrideCreationAttributes } from '../../types/sysuserfeatureoverride.types';

@Table({
  tableName: 'sys_user_feature_overrides',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    { fields: ['user_id', 'feature_id'], unique: true },
  ],
})
export class SysUserFeatureOverride extends BaseModel<SysUserFeatureOverrideAttributes, SysUserFeatureOverrideCreationAttributes> {
  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'user_id',
  })
  declare userId: number;

  @ForeignKey(() => SysFeatures)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'feature_id',
  })
  declare featureId: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_granted',
    comment: 'False explicitly forbids this feature even if role allows it',
  })
  declare isGranted: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    field: 'can_view',
  })
  declare canView?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    field: 'can_create',
  })
  declare canCreate?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    field: 'can_edit',
  })
  declare canEdit?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    field: 'can_delete',
  })
  declare canDelete?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    field: 'can_approve',
  })
  declare canApprove?: boolean;

  @BelongsTo(() => SysUser, 'user_id')
  declare user?: SysUser;

  @BelongsTo(() => SysFeatures, 'feature_id')
  declare feature?: SysFeatures;
}
