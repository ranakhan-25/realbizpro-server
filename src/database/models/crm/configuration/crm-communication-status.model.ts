import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { LeadStage } from './crm-lead-stage.model';

import type { CommunicationStatusAttributes, CommunicationStatusCreationAttributes } from '../../../types/communicationstatus.types';

export enum CommunicationStatusState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Table({
  tableName: 'crm_communication_statuses',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class CommunicationStatus extends BaseModel<CommunicationStatusAttributes, CommunicationStatusCreationAttributes> {
  @Column({ type: DataType.STRING(150), allowNull: false })
  declare name: string;

  @Column({
    type: DataType.ENUM(...Object.values(CommunicationStatusState)),
    allowNull: false,
    defaultValue: CommunicationStatusState.ACTIVE,
  })
  declare status: CommunicationStatusState;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description?: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare isDefault: boolean;

  @ForeignKey(() => LeadStage)
  @Column({ type: DataType.UUID, allowNull: true, field: 'lead_stage_id' })
  declare leadStageId?: string;

  @BelongsTo(() => LeadStage, {
    foreignKey: 'leadStageId',
    targetKey: 'uuid',
    as: 'leadStage',
  })
  declare leadStage?: LeadStage;

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

  @Column({ type: DataType.STRING, allowNull: true })
  declare addedById?: string;
}
