import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { SysPermission } from './sys_permission.model';
import { SysUser } from './sys_user.model';

@Table({
  tableName: 'sys_user_permissions',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      fields: ['user_id', 'permission_id'],
      unique: true,
    },
    { fields: ['user_id'] },
    { fields: ['permission_id'] },
  ],
})
export class SysUserPermission extends Model {
  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'user_id',
  })
  declare userId: number;

  @BelongsTo(() => SysUser, 'userId')
  declare user?: SysUser;

  @ForeignKey(() => SysPermission)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'permission_id',
  })
  declare permissionId: number;

  @BelongsTo(() => SysPermission, 'permissionId')
  declare permission?: SysPermission;
}
