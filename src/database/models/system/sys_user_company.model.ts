import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

import { SysCompany } from './sys_company.model';
import { SysUser } from './sys_user.model';
import type {
  SysUserCompanyAttributes,
  SysUserCompanyCreationAttributes,
} from '../../types/sysusercompany.types';

@Table({
  tableName: 'sys_user_company',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      fields: ['user_id', 'company_id'],
      unique: true,
    },
    { fields: ['user_id'] },
    { fields: ['company_id'] },
  ],
})
export class SysUserCompany extends BaseModel<
  SysUserCompanyAttributes,
  SysUserCompanyCreationAttributes
> {
  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'user_id',
  })
  declare userId: number;

  @ForeignKey(() => SysCompany)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    field: 'company_id',
  })
  declare companyId: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'created_by',
  })
  declare createdBy?: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'updated_by',
  })
  declare updatedBy?: number;

  // Relationships
  @BelongsTo(() => SysUser, 'userId')
  declare user: SysUser;

  @BelongsTo(() => SysCompany, 'companyId')
  declare company: SysCompany;
}
