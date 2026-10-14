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
import type {
  SysFeaturesAttributes,
  SysFeaturesCreationAttributes,
} from '../../types/sysfeatures.types';

@Table({
  tableName: 'sys_features',
  timestamps: true,
  paranoid: true,
  underscored: true,
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
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;

  @ForeignKey(() => SysModules)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'module_id',
    comment: 'The module this feature belongs to',
  })
  declare moduleId?: number;

  @BelongsTo(() => SysModules)
  declare module?: SysModules;

  @HasMany(() => SysPermission)
  declare permissions?: SysPermission[];
}
