import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { CommunicationStatus } from './crm-communication-status.model';

import type { LeadStageAttributes, LeadStageCreationAttributes } from '../../../types/leadstage.types';

@Table({
  tableName: 'crm_lead_stages',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class LeadStage extends BaseModel<LeadStageAttributes, LeadStageCreationAttributes> {
  @Column({ type: DataType.STRING(150), allowNull: false, unique: true })
  declare name: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0, field: 'order' })
  declare sortOrder: number;

  @Column({ type: DataType.STRING(50), allowNull: true })
  declare color?: string;

  @Column({ type: DataType.DECIMAL(5, 2), allowNull: true, field: 'sales_probability' })
  declare salesProbability?: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_system' })
  declare isSystem: boolean;

  @ForeignKey(() => SysOrganization)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'org_id',
    defaultValue: null,
  })
  declare orgId?: number | null;

  @BelongsTo(() => SysOrganization, {
    foreignKey: 'orgId',
    targetKey: 'id',
    as: 'organization',
  })
  declare organization?: SysOrganization;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by', defaultValue: null })
  declare createdBy?: string | null;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by', defaultValue: null })
  declare updatedBy?: string | null;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by', defaultValue: null })
  declare deletedBy?: string | null;

  @HasMany(() => CommunicationStatus, {
    foreignKey: 'leadStageId',
    sourceKey: 'uuid',
    as: 'communicationStatuses',
  })
  declare communicationStatuses?: CommunicationStatus[];

  @HasMany(() => Lead, {
    foreignKey: 'leadStageId',
    sourceKey: 'id',
    as: 'leads',
  })
  declare leads?: Lead[];
}
