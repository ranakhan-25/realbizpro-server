import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { SysUser } from './sys_user.model';

@Table({
  tableName: 'sys_user_sections',
  timestamps: true,
  paranoid: false,
  underscored: true,
  indexes: [
    {
      fields: ['user_id', 'section_id'],
      unique: true,
    },
    { fields: ['user_id'] },
    { fields: ['section_id'] },
  ],
})
export class SysUserSection extends Model {
  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'user_id',
  })
  declare userId: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'section_id',
  })
  declare sectionId: number;

  // Relationships
  @BelongsTo(() => SysUser, 'userId')
  declare user: SysUser;
}
