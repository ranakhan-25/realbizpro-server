import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { LeadVisitPlace, LeadVisitStatus } from './crm-lead-master-data.model';
import { Lead } from './crm-lead.model';

@Table({ tableName: 'crm_lead_activities', timestamps: true, paranoid: true, underscored: true })
export class LeadActivity extends BaseModel {
  @ForeignKey(() => Lead)
  @Column({ type: DataType.BIGINT, allowNull: false, field: 'lead_id' }) declare leadId: number;
  @Column({ type: DataType.STRING(50), allowNull: false, field: 'activity_type' }) declare activityType: string;
  @Column({ type: DataType.DATE, allowNull: false, field: 'activity_date' }) declare activityDate: Date;
  @Column({ type: DataType.TEXT, allowNull: false }) declare summary: string;
  @Column({ type: DataType.TEXT, allowNull: true, field: 'discussion_points' }) declare discussionPoints?: string;
  @Column({ type: DataType.DATE, allowNull: true, field: 'next_followup_date' }) declare nextFollowupDate?: Date;
  @ForeignKey(() => LeadVisitPlace)
  @Column({ type: DataType.BIGINT, allowNull: true, field: 'visit_place_id' }) declare visitPlaceId?: number;
  @ForeignKey(() => LeadVisitStatus)
  @Column({ type: DataType.BIGINT, allowNull: true, field: 'visit_status_id' }) declare visitStatusId?: number;
  @Column({ type: DataType.TEXT, allowNull: true }) declare feedback?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'conducted_by' }) declare conductedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' }) declare createdBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' }) declare updatedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' }) declare deletedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' }) declare projectId?: string;

  @BelongsTo(() => Lead, { foreignKey: 'leadId', targetKey: 'id', as: 'lead' }) declare lead?: Lead;
  @BelongsTo(() => LeadVisitPlace, { foreignKey: 'visitPlaceId', targetKey: 'id', as: 'visitPlace' }) declare visitPlace?: LeadVisitPlace;
  @BelongsTo(() => LeadVisitStatus, { foreignKey: 'visitStatusId', targetKey: 'id', as: 'visitStatus' }) declare visitStatus?: LeadVisitStatus;
  @BelongsTo(() => SysUser, { foreignKey: 'conductedBy', targetKey: 'uuid', as: 'conductedByUser' }) declare conductedByUser?: SysUser;
}
