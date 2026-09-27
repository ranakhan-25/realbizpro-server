import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';

import { BaseModel } from '../../base.model';
import type {
  SysUnionAttributes,
  SysUnionCreationAttributes,
} from '../../types/sysunion.types';
import { SysUser } from '../system/sys_user.model';
import { SysUpazila } from './sys_upazila.model';

@Table({
  tableName: 'sys_unions',
  underscored: true,
  timestamps: true,
  paranoid: true,
})
export class SysUnion extends BaseModel<
  SysUnionAttributes,
  SysUnionCreationAttributes
> {
  @ForeignKey(() => SysUpazila)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'upazila_id',
  })
  declare upazilaId: number;

  @BelongsTo(() => SysUpazila)
  declare upazila?: SysUpazila;

  @Column({
    type: DataType.STRING(25),
    allowNull: false,
    field: 'name',
  })
  declare name: string;

  @Column({
    type: DataType.STRING(25),
    allowNull: false,
    field: 'bn_name',
  })
  declare bnName: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'url',
  })
  declare url: string;

  // -------- Audit Fields --------
  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'created_by',
  })
  declare createdBy: number;

  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'updated_by',
  })
  declare updatedBy?: number;

  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'deleted_by',
  })
  declare deletedBy?: number;

  @BelongsTo(() => SysUser, 'createdBy')
  declare createdByUser?: SysUser;
  @BelongsTo(() => SysUser, 'updatedBy')
  declare updatedByUser?: SysUser;
  @BelongsTo(() => SysUser, 'deletedBy')
  declare deletedByUser?: SysUser;
}
