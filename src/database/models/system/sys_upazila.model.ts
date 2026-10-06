import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { SysDistrict } from './sys_districts.model';
import { SysUser } from '../system/sys_user.model';
import type {
  SysUpazilaAttributes,
  SysUpazilaCreationAttributes,
} from '../../types/sysupazila.types';
import { SysUnion } from './sys_union.model';

@Table({
  tableName: 'sys_upazilas',
  underscored: true,
  timestamps: true,
  paranoid: true,
})
export class SysUpazila extends BaseModel<
  SysUpazilaAttributes,
  SysUpazilaCreationAttributes
> {
  @ForeignKey(() => SysDistrict)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'district_id',
  })
  declare districtId: number;

  @BelongsTo(() => SysDistrict, {
    foreignKey: 'districtId',
  })
  declare district?: SysDistrict;

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
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare url?: string;

  @HasMany(() => SysUnion, {
    foreignKey: 'upazilaId',
    as: 'unions',
  })
  declare unions?: SysUnion[];

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
