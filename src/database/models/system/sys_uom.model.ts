import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { StatusEnum } from '../../enum/status.enum';
import { SysUser } from './sys_user.model';

import type {
  SysUomAttributes,
  SysUomCreationAttributes,
} from '../../types/sysuom.types';

@Table({
  tableName: 'sys_uom',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [{ fields: ['uuid'], unique: true }],
})
export class SysUom extends BaseModel<
  SysUomAttributes,
  SysUomCreationAttributes
> {
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'short_name',
  })
  declare shortName: string;

  @Column({
    type: DataType.STRING(250),
    allowNull: true,
  })
  declare details: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(StatusEnum),
    ),
    allowNull: false,
    defaultValue: StatusEnum.ACTIVE,
  })
  declare status: StatusEnum;

  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'created_by',
  })
  createdBy!: number;

  @BelongsTo(() => SysUser, 'createdBy')
  createdByUser?: SysUser;

  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'deleted_by',
  })
  deletedBy!: number;

  @BelongsTo(() => SysUser, 'deletedBy')
  deletedByUser?: SysUser;

  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'updated_by',
  })
  updatedBy?: number;

  @BelongsTo(() => SysUser, 'updatedBy')
  updatedByUser?: SysUser;
}
