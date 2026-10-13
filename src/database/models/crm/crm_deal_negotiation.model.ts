import { Column, DataType, Table, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrmLead } from './crm_lead.model';

import type { CrmDealNegotiationAttributes, CrmDealNegotiationCreationAttributes } from '../../types/crmdealnegotiation.types';

@Table({
  tableName: 'crm_deal_negotiations',
  timestamps: true,
  paranoid: true,
})
export class CrmDealNegotiation extends BaseModel<CrmDealNegotiationAttributes, CrmDealNegotiationCreationAttributes> {
  @Column({ type: DataType.BIGINT, allowNull: false })
  lead_id: number;

  @Column({ type: DataType.STRING, allowNull: true })
  property_id?: string;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: false })
  offer_price: number;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: true })
  agreed_price?: number;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: true })
  discount_amount?: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  special_terms?: string;

  @Column({ type: DataType.STRING, defaultValue: 'pending' })
  approval_status: string;

  @Column({ type: DataType.STRING, allowNull: true })
  approved_by?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  approval_date?: Date;

  @Column({ type: DataType.TEXT, allowNull: true })
  rejection_reason?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' })
  declare projectId?: string;

  @BelongsTo(() => CrmLead, { foreignKey: 'lead_id' })
  lead: CrmLead;
}
