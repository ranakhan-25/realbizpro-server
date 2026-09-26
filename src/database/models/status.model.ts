import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../base.model';
import type {
  StatusAttributes,
  StatusCreationAttributes,
} from '../types/status.types';

@Table({
  tableName: 'gen_status',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class Status extends BaseModel<
  StatusAttributes,
  StatusCreationAttributes
> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;
}
