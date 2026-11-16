import { Column, DataType, Table, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrSaleAgreement } from './cr_sale_agreement.model';

import type { CrOfficerAssignmentAttributes, CrOfficerAssignmentCreationAttributes } from '../../types/crofficerassignment.types';

@Table({
  tableName: 'cr_officer_assignments',
  timestamps: true,
  paranoid: true,
})
export class CrOfficerAssignment extends BaseModel<CrOfficerAssignmentAttributes, CrOfficerAssignmentCreationAttributes> {
  @Column({ type: DataType.STRING, allowNull: false, field: 'org_id' })
  declare org_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  officer_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  officer_name: string;

  @Column({ type: DataType.BIGINT, allowNull: false })
  sale_agreement_id: number;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: false, defaultValue: 0.00 })
  target_amount: number;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: false, defaultValue: 0.00 })
  collected_amount: number;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  due_date: string;

  @Column({ type: DataType.DATEONLY, allowNull: false, defaultValue: DataType.NOW })
  assignment_date: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'assigned' })
  status: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  notes?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @BelongsTo(() => CrSaleAgreement, { foreignKey: 'sale_agreement_id' })
  sale_agreement: CrSaleAgreement;
}
