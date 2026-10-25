import { BelongsTo, Column, DataType, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { Lead } from './crm-lead.model';
import { LeadTeamMember } from './crm-lead-team-member.model';
import { LeadActivity } from './crm-lead-activity.model';
import { LeadRequirement } from './crm-lead-requirement.model';

abstract class LeadMasterModel extends BaseModel {
  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' }) declare createdBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' }) declare updatedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' }) declare deletedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' }) declare projectId?: string;
}

@Table({ tableName: 'crm_lead_categories', timestamps: true, paranoid: true, underscored: true })
export class LeadCategory extends LeadMasterModel {
  @Column({ type: DataType.STRING(150), allowNull: false }) declare name: string;
  @Column({ type: DataType.STRING(100), allowNull: true }) declare code?: string;
  @Column({ type: DataType.TEXT, allowNull: true }) declare description?: string;
  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true, field: 'is_active' }) declare isActive?: boolean;
  @HasMany(() => Lead, { foreignKey: 'leadCategoryId', sourceKey: 'id', as: 'leads' }) declare leads?: Lead[];
}

@Table({ tableName: 'crm_lead_sources', timestamps: true, paranoid: true, underscored: true })
export class LeadSource extends LeadMasterModel {
  @Column({ type: DataType.STRING(150), allowNull: false }) declare name: string;
  @Column({ type: DataType.STRING(100), allowNull: true }) declare code?: string;
  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true, field: 'is_active' }) declare isActive?: boolean;
  @HasMany(() => Lead, { foreignKey: 'leadSourceId', sourceKey: 'id', as: 'leads' }) declare leads?: Lead[];
}

@Table({ tableName: 'crm_campaigns', timestamps: true, paranoid: true, underscored: true })
export class LeadCampaign extends LeadMasterModel {
  @Column({ type: DataType.STRING(200), allowNull: false }) declare name: string;
  @Column({ type: DataType.DATEONLY, allowNull: true, field: 'start_date' }) declare startDate?: string;
  @Column({ type: DataType.DATEONLY, allowNull: true, field: 'end_date' }) declare endDate?: string;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true }) declare budget?: number;
  @Column({ type: DataType.STRING(100), allowNull: true }) declare channel?: string;
  @Column({ type: DataType.STRING(50), allowNull: true }) declare status?: string;
  @Column({ type: DataType.TEXT, allowNull: true }) declare description?: string;
  @HasMany(() => Lead, { foreignKey: 'campaignId', sourceKey: 'id', as: 'leads' }) declare leads?: Lead[];
}

@Table({ tableName: 'crm_professions', timestamps: true, paranoid: true, underscored: true })
export class LeadProfession extends LeadMasterModel {
  @Column({ type: DataType.STRING(150), allowNull: false }) declare name: string;
  @Column({ type: DataType.TEXT, allowNull: true }) declare description?: string;
  @HasMany(() => Lead, { foreignKey: 'professionId', sourceKey: 'id', as: 'leads' }) declare leads?: Lead[];
}

@Table({ tableName: 'crm_areas', timestamps: true, paranoid: true, underscored: true })
export class LeadArea extends LeadMasterModel {
  @Column({ type: DataType.STRING(150), allowNull: false }) declare name: string;
  @Column({ type: DataType.STRING(150), allowNull: true }) declare city?: string;
  @Column({ type: DataType.STRING(150), allowNull: true }) declare zone?: string;
  @HasMany(() => Lead, { foreignKey: 'areaId', sourceKey: 'id', as: 'leads' }) declare leads?: Lead[];
}

@Table({ tableName: 'crm_price_ranges', timestamps: true, paranoid: true, underscored: true })
export class LeadPriceRange extends LeadMasterModel {
  @Column({ type: DataType.STRING(150), allowNull: false }) declare name: string;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true, field: 'min_price' }) declare minPrice?: number;
  @Column({ type: DataType.DECIMAL(15, 2), allowNull: true, field: 'max_price' }) declare maxPrice?: number;
  @HasMany(() => Lead, { foreignKey: 'priceRangeId', sourceKey: 'id', as: 'leads' }) declare leads?: Lead[];
}

@Table({ tableName: 'crm_teams', timestamps: true, paranoid: true, underscored: true })
export class LeadTeam extends LeadMasterModel {
  @Column({ type: DataType.STRING(150), allowNull: false }) declare name: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'leader_id' }) declare leaderId?: string;
  @Column({ type: DataType.STRING(150), allowNull: true }) declare department?: string;
  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true, field: 'is_active' }) declare isActive?: boolean;
  @BelongsTo(() => SysUser, { foreignKey: 'leaderId', targetKey: 'uuid', as: 'leader' }) declare leader?: SysUser;
  @HasMany(() => LeadTeamMember, { foreignKey: 'teamId', sourceKey: 'id', as: 'members' }) declare members?: LeadTeamMember[];
}

@Table({ tableName: 'crm_visit_places', timestamps: true, paranoid: true, underscored: true })
export class LeadVisitPlace extends LeadMasterModel {
  @Column({ type: DataType.STRING(150), allowNull: false }) declare name: string;
  @Column({ type: DataType.STRING(255), allowNull: true }) declare address?: string;
  @Column({ type: DataType.STRING(150), allowNull: true, field: 'contact_person' }) declare contactPerson?: string;
  @Column({ type: DataType.STRING(50), allowNull: true, field: 'contact_number' }) declare contactNumber?: string;
  @HasMany(() => LeadActivity, { foreignKey: 'visitPlaceId', sourceKey: 'id', as: 'activities' }) declare activities?: LeadActivity[];
}

@Table({ tableName: 'crm_visit_statuses', timestamps: true, paranoid: true, underscored: true })
export class LeadVisitStatus extends LeadMasterModel {
  @Column({ type: DataType.STRING(100), allowNull: false }) declare name: string;
  @Column({ type: DataType.STRING(50), allowNull: true }) declare color?: string;
  @HasMany(() => LeadActivity, { foreignKey: 'visitStatusId', sourceKey: 'id', as: 'activities' }) declare activities?: LeadActivity[];
}

@Table({ tableName: 'crm_requirement_types', timestamps: true, paranoid: true, underscored: true })
export class LeadRequirementType extends LeadMasterModel {
  @Column({ type: DataType.STRING(150), allowNull: false }) declare name: string;
  @Column({ type: DataType.TEXT, allowNull: true }) declare description?: string;
  @HasMany(() => LeadRequirement, { foreignKey: 'requirementTypeId', sourceKey: 'id', as: 'requirements' }) declare requirements?: LeadRequirement[];
}
