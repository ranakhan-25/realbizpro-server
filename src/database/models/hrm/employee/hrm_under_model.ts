/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */
import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import type {
  UnderAttributes,
  UnderCreationAttributes,
  UnderUpdateAttributes,
} from 'src/database/types/under.types';

export enum UnderStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'under',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    { name: 'Under_name_idx', fields: ['name'] },
    {
      name: 'Under_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class Under
  extends BaseModel<
    UnderUpdateAttributes,
    UnderCreationAttributes
  >
  implements UnderAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedById?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare createdBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare updatedBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare deletedBy?: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(UnderStatus),
    ),
    allowNull: false,
    defaultValue: UnderStatus.ACTIVE,
  })
  declare status: UnderStatus;
}
