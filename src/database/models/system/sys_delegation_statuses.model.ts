import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import type {
  SysDelegationStatusAttributes,
  SysDelegationStatusCreationAttributes,
} from 'src/database/types/sys_delegation_statuses.model.types';

@Table({
  tableName: 'sys_delegation_statuses',
  timestamps: true,
  paranoid: false,
  underscored: true,
})
export class SysDelegationStatus extends Model<
  SysDelegationStatusAttributes,
  SysDelegationStatusCreationAttributes
> {
  @Column({
    type: DataType.STRING(55),
    allowNull: true,
  })
  declare module?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare label: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  declare color?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_final',
  })
  declare isFinal: boolean;
}
