import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

import type {
  SysCountriesAttributes,
  SysCountriesCreationAttributes,
} from '../../types/syscountries.types';
import { SysUser } from './sys_user.model';

@Table({
  tableName: 'sys_countries',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SysCountries extends BaseModel<
  SysCountriesAttributes,
  SysCountriesCreationAttributes
> {
  @Column({
    type: DataType.STRING(),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(),
    allowNull: true,
  })
  declare slug?: string;

  @Column({
    type: DataType.STRING(),
    allowNull: false,
    field: 'short_name',
  })
  declare shortName: string;

  @Column({
    type: DataType.STRING(),
    allowNull: true,
    field: 'country_code',
  })
  declare countryCode?: string;

  @Column({
    type: DataType.STRING(),
    allowNull: true,
    field: 'phone_code',
  })
  declare phoneCode?: string;

  @Column({
    type: DataType.STRING(),
    allowNull: true,
  })
  declare capital?: string;

  @Column({
    type: DataType.STRING(),
    allowNull: false,
  })
  declare currency: string;

  @Column({
    type: DataType.STRING(),
    allowNull: true,
    field: 'currency_symbol',
  })
  declare currencySymbol?: string;

  @Column({
    type: DataType.STRING(),
    allowNull: true,
  })
  declare emoji?: string;

  @Column({
    type: DataType.STRING(),
    allowNull: true,
    field: 'emoji_u',
  })
  declare emojiU?: string;

  @Column({
    type: DataType.ENUM('Active', 'Inactive'),
    allowNull: false,
    defaultValue: 'Active',
  })
  declare status: 'Active' | 'Inactive';

  // Audit fks
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
    field: 'deleted_by',
  })
  declare deletedBy?: number;

  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'updated_by',
  })
  declare updatedBy?: number;

  @BelongsTo(() => SysUser, 'createdBy')
  declare creator?: SysUser;
}
