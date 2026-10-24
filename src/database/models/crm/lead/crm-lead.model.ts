import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { LeadStage } from 'src/database/models/crm/configuration/crm-lead-stage.model';
import { LeadActivity } from './crm-lead-activity.model';
import { LeadAttachment } from './crm-lead-attachment.model';
import { LeadCallAssignment } from './crm-lead-call-assignment.model';
import { LeadPropertyInterest } from './crm-lead-property-interest.model';
import { LeadRequirement } from './crm-lead-requirement.model';
import { LeadTransferLog } from './crm-lead-transfer-log.model';
import {
  LeadArea,
  LeadCampaign,
  LeadCategory,
  LeadPriceRange,
  LeadProfession,
  LeadSource,
} from './crm-lead-master-data.model';

@Table({ tableName: 'crm_leads', timestamps: true, paranoid: true, underscored: true })
export class Lead extends BaseModel {
  @Column({ type: DataType.STRING(50), allowNull: false, field: 'lead_code' })
  declare leadCode: string;

  @Column({ type: DataType.STRING(255), allowNull: false, field: 'client_name' })
  declare clientName: string;

  @Column({ type: DataType.STRING(30), allowNull: false })
  declare phone: string;

  @Column({ type: DataType.STRING(30), allowNull: true, field: 'alternate_phone' })
  declare alternatePhone?: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare email?: string;

  @ForeignKey(() => LeadCategory)
  @Column({ type: DataType.BIGINT, allowNull: true, field: 'lead_category_id' })
  declare leadCategoryId?: number;

  @ForeignKey(() => LeadStage)
  @Column({ type: DataType.BIGINT, allowNull: true, field: 'lead_stage_id' })
  declare leadStageId?: number;

  @ForeignKey(() => LeadSource)
  @Column({ type: DataType.BIGINT, allowNull: true, field: 'lead_source_id' })
  declare leadSourceId?: number;

  @ForeignKey(() => LeadCampaign)
  @Column({ type: DataType.BIGINT, allowNull: true, field: 'campaign_id' })
  declare campaignId?: number;

  @ForeignKey(() => LeadProfession)
  @Column({ type: DataType.BIGINT, allowNull: true, field: 'profession_id' })
  declare professionId?: number;

  @Column({ type: DataType.STRING(150), allowNull: true })
  declare designation?: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare organization?: string;

  @Column({ type: DataType.TEXT, allowNull: true, field: 'present_address' })
  declare presentAddress?: string;

  @Column({ type: DataType.TEXT, allowNull: true, field: 'permanent_address' })
  declare permanentAddress?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'assigned_to' })
  declare assignedTo?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare priority?: string;

  @Column({ type: DataType.INTEGER, allowNull: true, field: 'lead_score' })
  declare leadScore?: number;

  @Column({ type: DataType.STRING(50), allowNull: true, defaultValue: 'active' })
  declare status?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes?: string;

  @Column({ type: DataType.DATEONLY, allowNull: false, field: 'lead_date' })
  declare leadDate: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'credit_officer_id' })
  declare creditOfficerId?: string;

  @Column({ type: DataType.DATEONLY, allowNull: true, field: 'birth_date' })
  declare birthDate?: string;

  @Column({ type: DataType.DATEONLY, allowNull: true, field: 'anniversary_date' })
  declare anniversaryDate?: string;

  @ForeignKey(() => LeadArea)
  @Column({ type: DataType.BIGINT, allowNull: true, field: 'area_id' })
  declare areaId?: number;

  @ForeignKey(() => LeadPriceRange)
  @Column({ type: DataType.BIGINT, allowNull: true, field: 'price_range_id' })
  declare priceRangeId?: number;

  @Column({ type: DataType.STRING(100), allowNull: true, field: 'lead_type' })
  declare leadType?: string;

  @Column({ type: DataType.TEXT, allowNull: true, field: 'initial_remark' })
  declare initialRemark?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare query?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' })
  declare projectId?: string;

  @BelongsTo(() => LeadCategory, { foreignKey: 'leadCategoryId', targetKey: 'id', as: 'category' })
  declare category?: LeadCategory;

  @BelongsTo(() => LeadStage, { foreignKey: 'leadStageId', targetKey: 'id', as: 'stage' })
  declare stage?: LeadStage;

  @BelongsTo(() => LeadSource, { foreignKey: 'leadSourceId', targetKey: 'id', as: 'source' })
  declare source?: LeadSource;

  @BelongsTo(() => LeadCampaign, { foreignKey: 'campaignId', targetKey: 'id', as: 'campaign' })
  declare campaign?: LeadCampaign;

  @BelongsTo(() => LeadProfession, { foreignKey: 'professionId', targetKey: 'id', as: 'profession' })
  declare profession?: LeadProfession;

  @BelongsTo(() => LeadArea, { foreignKey: 'areaId', targetKey: 'id', as: 'area' })
  declare area?: LeadArea;

  @BelongsTo(() => LeadPriceRange, { foreignKey: 'priceRangeId', targetKey: 'id', as: 'priceRange' })
  declare priceRange?: LeadPriceRange;

  @BelongsTo(() => SysUser, { foreignKey: 'assignedTo', targetKey: 'uuid', as: 'assignedUser' })
  declare assignedUser?: SysUser;

  @BelongsTo(() => SysUser, { foreignKey: 'creditOfficerId', targetKey: 'uuid', as: 'creditOfficer' })
  declare creditOfficer?: SysUser;

  @HasMany(() => LeadActivity, { foreignKey: 'leadId', sourceKey: 'id', as: 'activities' })
  declare activities?: LeadActivity[];

  @HasMany(() => LeadAttachment, { foreignKey: 'leadId', sourceKey: 'id', as: 'attachments' })
  declare attachments?: LeadAttachment[];

  @HasMany(() => LeadCallAssignment, { foreignKey: 'leadId', sourceKey: 'id', as: 'callAssignments' })
  declare callAssignments?: LeadCallAssignment[];

  @HasMany(() => LeadPropertyInterest, { foreignKey: 'leadId', sourceKey: 'id', as: 'propertyInterests' })
  declare propertyInterests?: LeadPropertyInterest[];

  @HasMany(() => LeadRequirement, { foreignKey: 'leadId', sourceKey: 'id', as: 'requirements' })
  declare requirements?: LeadRequirement[];

  @HasMany(() => LeadTransferLog, { foreignKey: 'leadId', sourceKey: 'id', as: 'transferLogs' })
  declare transferLogs?: LeadTransferLog[];
}
