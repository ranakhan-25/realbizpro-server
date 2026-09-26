import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import {
  SysUserRoleAttributes,
  SysUserRoleCreationAttributes,
} from '../../types/sysuserrole.types';
import { SysRole } from './sys_role.model';
import { SysUser } from './sys_user.model';

@Table({
  tableName: 'sys_user_roles',
  timestamps: true,
  paranoid: false,
  underscored: true,
  indexes: [
    {
      fields: ['user_id', 'role_id'],
      unique: true,
    },
    { fields: ['user_id'] },
    { fields: ['role_id'] },
  ],
})
export class SysUserRole extends BaseModel<
  SysUserRoleAttributes,
  SysUserRoleCreationAttributes
> {
  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'user_id',
  })
  declare userId: number;

  @ForeignKey(() => SysRole)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'role_id',
  })
  declare roleId: number;

  // Relationships
  @BelongsTo(() => SysUser, 'userId')
  declare user: SysUser;

  @BelongsTo(() => SysRole, 'roleId')
  declare role: SysRole;
}
