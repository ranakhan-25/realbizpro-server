/* eslint-disable prettier/prettier */
import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import {
  HrmShiftAttributes,
  HrmShiftCreationAttributes,
  HrmShiftUpdateAttributes,
} from 'src/database/types/hrmshift.types';

export enum HrmShiftStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'hrm_shift',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'HrmShift_name_idx',
      fields: ['name'],
    },
    {
      name: 'HrmShift_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class HrmShift
  extends BaseModel<
    HrmShiftUpdateAttributes,
    HrmShiftCreationAttributes
  >
  implements HrmShiftAttributes
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
      ...Object.values(HrmShiftStatus),
    ),
    allowNull: false,
    defaultValue: HrmShiftStatus.ACTIVE,
  })
  declare status: HrmShiftStatus;
}
