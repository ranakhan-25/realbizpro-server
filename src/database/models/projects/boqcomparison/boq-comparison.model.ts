/* eslint-disable prettier/prettier */

import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { BaseModel } from '../../../base.model';
import {
  BoqComparisonAttributes,
  BoqComparisonCreationAttributes,
  BoqComparisonUpdateAttributes,
} from 'src/database/types/boqcomparison.types';

export enum BoqComparisonStatus {
  IN_PROGRESS = 'In Progress',
}

@Table({
  tableName: 'pr_boq_comparisons',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class BoqComparison
  extends BaseModel<
    BoqComparisonUpdateAttributes,
    BoqComparisonCreationAttributes
  >
  implements BoqComparisonAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare uid?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare titleOfWork: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare task: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare description: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare boqQty: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare boqAmount: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare issueQty: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare issueAmount: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare qtyDiff: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare amountDiff: number;

  @Column({
    type: DataType.ENUM(
      ...Object.values(BoqComparisonStatus).map((v) => String(v)),
    ),
    allowNull: false,
    defaultValue: BoqComparisonStatus.IN_PROGRESS,
  })
  declare status: BoqComparisonStatus;

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
}