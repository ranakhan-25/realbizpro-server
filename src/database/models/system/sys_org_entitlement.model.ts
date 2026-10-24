import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { SysOrganization } from './sys_organization.model';
import { SysModules } from './sys_module.model';
import { SysFeatures } from './sys_features.model';

import type { SysOrgEntitlementAttributes, SysOrgEntitlementCreationAttributes } from '../../types/sysorgentitlement.types';

@Table({
  tableName: 'sys_org_entitlements',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    { fields: ['org_id', 'feature_id'], unique: true },
    { fields: ['org_id', 'module_id'] },
  ],
})
export class SysOrgEntitlement extends BaseModel<SysOrgEntitlementAttributes, SysOrgEntitlementCreationAttributes> {
  @ForeignKey(() => SysOrganization)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'org_id',
  })
  declare orgId: number;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'org_uuid',
  })
  declare orgUuid?: string;

  @ForeignKey(() => SysModules)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'module_id',
  })
  declare moduleId: number;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'module_uuid',
  })
  declare moduleUuid?: string;

  @ForeignKey(() => SysFeatures)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'feature_id',
  })
  declare featureId: number;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'feature_uuid',
  })
  declare featureUuid?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_enabled',
  })
  declare isEnabled: boolean;

  @BelongsTo(() => SysOrganization, 'org_id')
  declare organization?: SysOrganization;

  @BelongsTo(() => SysModules, 'module_id')
  declare module?: SysModules;

  @BelongsTo(() => SysFeatures, 'feature_id')
  declare feature?: SysFeatures;
}
