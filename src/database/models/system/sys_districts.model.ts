import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { SysDivision } from './sys_divisions.model';
import { SysUser } from '../system/sys_user.model';
import type {
  SysDistrictAttributes,
  SysDistrictCreationAttributes,
} from '../../types/sysdistrict.types';
import { SysUpazila } from './sys_upazila.model';

@Table({
  tableName: 'sys_districts',
  underscored: true,
  timestamps: true,
  paranoid: true,
})
export class SysDistrict extends BaseModel<
  SysDistrictAttributes,
  SysDistrictCreationAttributes
> {
  @ForeignKey(() => SysDivision)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'division_id',
  })
  declare divisionId: number;

  @BelongsTo(() => SysDivision, {
    foreignKey: 'divisionId',
  })
  declare division?: SysDivision;

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
    type: DataType.STRING(15),
    allowNull: true,
  })
  declare lat?: string;

  @Column({
    type: DataType.STRING(15),
    allowNull: true,
  })
  declare lon?: string;

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

  @HasMany(() => SysUpazila, {
    foreignKey: 'districtId',
    as: 'upazilas',
  })
  declare upazilas?: SysUpazila[];

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
