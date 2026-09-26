import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { SysUser } from '../system/sys_user.model';
import type {
  SysDivisionAttributes,
  SysDivisionCreationAttributes,
} from '../../types/sysdivision.types';
import { SysDistrict } from './sys_districts.model';

@Table({
  tableName: 'sys_divisions',
  underscored: true,
  timestamps: true,
  paranoid: true,
})
export class SysDivision extends BaseModel<
  SysDivisionAttributes,
  SysDivisionCreationAttributes
> {
  @Column({
    type: DataType.STRING(25),
    allowNull: false,
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
  })
  declare url: string;

  // ===========================
  // Audit Fields
  // ===========================

  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'created_by',
  })
  declare createdBy?: number;

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

  @HasMany(() => SysDistrict, {
    foreignKey: 'divisionId',
    as: 'districts',
  })
  declare districts?: SysDistrict[];

  @BelongsTo(() => SysUser, {
    foreignKey: 'createdBy',
  })
  declare createdByUser?: SysUser;

  @BelongsTo(() => SysUser, {
    foreignKey: 'updatedBy',
  })
  declare updatedByUser?: SysUser;

  @BelongsTo(() => SysUser, {
    foreignKey: 'deletedBy',
  })
  declare deletedByUser?: SysUser;
}
