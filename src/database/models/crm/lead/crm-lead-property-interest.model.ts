import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { Lead } from './crm-lead.model';

import type { LeadPropertyInterestAttributes, LeadPropertyInterestCreationAttributes } from '../../../types/leadpropertyinterest.types';

@Table({ tableName: 'crm_lead_property_interests', timestamps: true, paranoid: true, underscored: true })
export class LeadPropertyInterest extends BaseModel<LeadPropertyInterestAttributes, LeadPropertyInterestCreationAttributes> {
  @ForeignKey(() => Lead)
  @Column({ type: DataType.BIGINT, allowNull: false, field: 'lead_id' }) declare leadId: number;
  @Column({ type: DataType.STRING(255), allowNull: true, field: 'project_name' }) declare projectName?: string;
  @Column({ type: DataType.STRING(150), allowNull: true, field: 'plot_flat_no' }) declare plotFlatNo?: string;
  @Column({ type: DataType.STRING(100), allowNull: true }) declare size?: string;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true, field: 'quoted_price' }) declare quotedPrice?: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true, field: 'client_offered_price' }) declare clientOfferedPrice?: number;
  @Column({ type: DataType.STRING(50), allowNull: true }) declare status?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' }) declare createdBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' }) declare updatedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' }) declare deletedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' }) declare projectId?: string;
  @BelongsTo(() => Lead, { foreignKey: 'leadId', targetKey: 'id', as: 'lead' }) declare lead?: Lead;
}
