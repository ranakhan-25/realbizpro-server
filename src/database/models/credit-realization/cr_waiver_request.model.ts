import { Column, DataType, Table, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrSaleAgreement } from './cr_sale_agreement.model';
import { CrInstallmentPlan } from './cr_installment_plan.model';

import type { CrWaiverRequestAttributes, CrWaiverRequestCreationAttributes } from '../../types/crwaiverrequest.types';

@Table({
  tableName: 'cr_waiver_requests',
  timestamps: true,
  paranoid: true,
})
export class CrWaiverRequest extends BaseModel<CrWaiverRequestAttributes, CrWaiverRequestCreationAttributes> {
  @Column({ type: DataType.STRING, allowNull: false, field: 'org_id' })
  declare org_id: string;

  @Column({ type: DataType.BIGINT, allowNull: false })
  sale_agreement_id: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  installment_plan_id: number;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: false })
  requested_amount: number;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: false, defaultValue: 0.00 })
  approved_amount: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  reason: string;

  @Column({ type: DataType.STRING, allowNull: true })
  attachment_url?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  approver_id?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  approver_name?: string;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'pending' })
  approval_status: string; // pending, approved, rejected

  @Column({ type: DataType.TEXT, allowNull: true })
  approval_remarks?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  actioned_at?: Date;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @BelongsTo(() => CrSaleAgreement, { foreignKey: 'sale_agreement_id' })
  sale_agreement: CrSaleAgreement;

  @BelongsTo(() => CrInstallmentPlan, { foreignKey: 'installment_plan_id' })
  installment_plan: CrInstallmentPlan;
}
