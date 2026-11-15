import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

import type { CrInstallmentSetupAttributes, CrInstallmentSetupCreationAttributes } from '../../types/crinstallmentsetup.types';

@Table({
  tableName: 'cr_installment_setups',
  timestamps: true,
  paranoid: true,
})
export class CrInstallmentSetup extends BaseModel<CrInstallmentSetupAttributes, CrInstallmentSetupCreationAttributes> {
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  plan_code: string;

  @Column({ type: DataType.STRING, allowNull: false })
  plan_name: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  number_of_installments: number;

  @Column({ type: DataType.STRING, defaultValue: 'monthly' })
  frequency: string;

  @Column({ type: DataType.DECIMAL(6, 4), defaultValue: 0.05 })
  penalty_rate_percentage: number;

  @Column({ type: DataType.INTEGER, defaultValue: 7 })
  grace_period_days: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  description?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  is_active: boolean;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'org_id' })
  declare org_id?: string;
}
