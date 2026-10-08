import {
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { SysUser } from './sys_user.model';
import { SysModules } from './sys_module.model';
import type {
  SysModuleToUserAttributes,
  SysModuleToUserCreationAttributes,
} from '../../types/sysmoduletouser.types';

@Table({
  tableName: 'sys_module_to_user',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SysModuleToUser extends BaseModel<
  SysModuleToUserAttributes,
  SysModuleToUserCreationAttributes
> {
  @ForeignKey(() => SysModules)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'module_id',
  })
  declare moduleId: number;

  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'user_id',
  })
  declare userId: number;
}
