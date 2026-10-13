/* eslint-disable prettier/prettier */
import {
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import type {
  BonusAttributes,
  BonusCreationAttributes,
  BonusUpdateAttributes,
} from 'src/database/types/bonus.types';
import { BonusGenerate } from './hrm_bonus_generate_model';

export enum BonusStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'bonus',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'Bonus_name_idx',
      fields: ['name'],
    },
    {
      name: 'Bonus_festivalDate_idx',
      fields: ['festivalDate'],
    },
    {
      name: 'Bonus_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class Bonus
  extends BaseModel<
    BonusUpdateAttributes,
    BonusCreationAttributes
  >
  implements BonusAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
  })
  declare percentage: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare festivalDate: Date;

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
      ...Object.values(BonusStatus),
    ),
    allowNull: false,
    defaultValue: BonusStatus.ACTIVE,
  })
  declare status: BonusStatus;
  @HasMany(() => BonusGenerate, {
    foreignKey: 'bonusId',
    sourceKey: 'uuid',
    as: 'bonusGenerates',
  })
  declare bonusGenerates?: BonusGenerate[];
}
