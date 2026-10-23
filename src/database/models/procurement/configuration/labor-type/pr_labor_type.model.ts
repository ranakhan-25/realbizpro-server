import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';

import type { ProcurementLaborTypeAttributes, ProcurementLaborTypeCreationAttributes } from '../../../../types/procurementlabortype.types';

export enum LaborTypeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'pr_labor_types',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class ProcurementLaborType extends BaseModel<ProcurementLaborTypeAttributes, ProcurementLaborTypeCreationAttributes> {
  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(80),
    allowNull: false,
  })
  declare unit: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(LaborTypeStatus),
    ),
    allowNull: false,
    defaultValue: LaborTypeStatus.ACTIVE,
  })
  declare status: LaborTypeStatus;
}
