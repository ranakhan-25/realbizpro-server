import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { BaseModel } from '../../base.model';
import type {
  SysCompanyAttributes,
  SysCompanyCreationAttributes,
} from '../../types/syscompany.types';

@Table({
  tableName: 'sys_company',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [{ fields: ['uuid'], unique: true }],
})
export class SysCompany extends BaseModel<
  SysCompanyAttributes,
  SysCompanyCreationAttributes
> {
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  declare address: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  declare bnName?: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  declare bnAddress: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  declare mobile: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: true,
  })
  declare telephone?: string;

  @Column({
    type: DataType.STRING(30),
    allowNull: true,
  })
  declare ipPhone?: string;

  @Column({
    type: DataType.STRING(25),
    allowNull: true,
    field: 'vat_reg_num',
  })
  declare vatRegNum: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare website: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
  })
  declare logo: string;

  @Column({
    type: DataType.ENUM('Active', 'Inactive'),
    allowNull: false,
    defaultValue: 'Active',
  })
  declare status: 'Active' | 'Inactive';

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'created_by',
  })
  declare createdBy: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'deleted_by',
  })
  declare deletedBy: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'updated_by',
  })
  declare updatedBy?: number;
}
