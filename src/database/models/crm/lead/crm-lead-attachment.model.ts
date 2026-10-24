import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { Lead } from './crm-lead.model';

@Table({ tableName: 'crm_lead_attachments', timestamps: true, paranoid: true, underscored: true })
export class LeadAttachment extends BaseModel {
  @ForeignKey(() => Lead)
  @Column({ type: DataType.BIGINT, allowNull: false, field: 'lead_id' }) declare leadId: number;
  @Column({ type: DataType.STRING(200), allowNull: false }) declare title: string;
  @Column({ type: DataType.STRING(1000), allowNull: false, field: 'file_url' }) declare fileUrl: string;
  @Column({ type: DataType.STRING(100), allowNull: true, field: 'file_type' }) declare fileType?: string;
  @Column({ type: DataType.INTEGER, allowNull: true, field: 'file_size' }) declare fileSize?: number;
  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' }) declare createdBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' }) declare updatedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' }) declare deletedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' }) declare projectId?: string;
  @BelongsTo(() => Lead, { foreignKey: 'leadId', targetKey: 'id', as: 'lead' }) declare lead?: Lead;
}
