import {
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
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
