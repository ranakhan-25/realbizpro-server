import { Column, DataType, Table, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrmLead } from './crm_lead.model';

import type { CrmCampaignAttributes, CrmCampaignCreationAttributes } from '../../types/crmcampaign.types';

@Table({
  tableName: 'crm_campaigns',
  timestamps: true,
  paranoid: true,
})
export class CrmCampaign extends BaseModel<CrmCampaignAttributes, CrmCampaignCreationAttributes> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  start_date?: string;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  end_date?: string;

  @Column({ type: DataType.DECIMAL(14, 2), allowNull: true })
  budget?: number;

  @Column({ type: DataType.STRING, allowNull: true })
  channel?: string;

  @Column({ type: DataType.STRING, defaultValue: 'active' })
  status: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' })
  declare projectId?: string;

  @HasMany(() => CrmLead, { foreignKey: 'campaign_id' })
  leads: CrmLead[];
}
