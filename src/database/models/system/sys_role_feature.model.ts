import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { SysRole } from './sys_role.model';
import { SysFeatures } from './sys_features.model';

import type { SysRoleFeatureAttributes, SysRoleFeatureCreationAttributes } from '../../types/sysrolefeature.types';

@Table({
  tableName: 'sys_role_features',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    { fields: ['role_id', 'feature_id'], unique: true },
  ],
})
export class SysRoleFeature extends BaseModel<SysRoleFeatureAttributes, SysRoleFeatureCreationAttributes> {
  @ForeignKey(() => SysRole)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'role_id',
  })
  declare roleId: number;

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
    defaultValue: false,
    field: 'can_view',
  })
  declare canView: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'can_create',
  })
  declare canCreate: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'can_edit',
  })
  declare canEdit: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'can_delete',
  })
  declare canDelete: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'can_approve',
  })
  declare canApprove: boolean;

  @BelongsTo(() => SysRole, 'role_id')
  declare role?: SysRole;

  @BelongsTo(() => SysFeatures, 'feature_id')
  declare feature?: SysFeatures;
}
