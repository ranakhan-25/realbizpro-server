import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { LeadStage } from './crm-lead-stage.model';

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
export class CommunicationStatus extends BaseModel {
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

  @Column({ type: DataType.STRING, allowNull: true })
  declare addedById?: string;
}
