import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { CrmParty } from './crm-party.model';

import type { CrmPartyCommunicationAttributes, CrmPartyCommunicationCreationAttributes } from '../../../types/crmpartycommunication.types';

export enum CrmPartyCommunicationChannel { CALL = 'Call', SMS = 'SMS', EMAIL = 'Email', WHATSAPP = 'WhatsApp', MEETING = 'Meeting' }
export enum CrmPartyCommunicationDirection { INBOUND = 'Inbound (Received)', OUTBOUND = 'Outbound (Sent)' }

@Table({ tableName: 'crm_party_communications', timestamps: true, paranoid: true, underscored: true })
export class CrmPartyCommunication extends BaseModel<CrmPartyCommunicationAttributes, CrmPartyCommunicationCreationAttributes> {
  @ForeignKey(() => CrmParty)
  @Column({ type: DataType.UUID, allowNull: false, field: 'party_uuid' }) declare partyUuid: string;
  @Column({ type: DataType.ENUM(...Object.values(CrmPartyCommunicationChannel)), allowNull: false }) declare channel: CrmPartyCommunicationChannel;
  @Column({ type: DataType.ENUM(...Object.values(CrmPartyCommunicationDirection)), allowNull: false }) declare direction: CrmPartyCommunicationDirection;
  @Column({ type: DataType.DATE, allowNull: false, field: 'occurred_at' }) declare occurredAt: Date;
  @Column({ type: DataType.TEXT, allowNull: false }) declare summary: string;
  @ForeignKey(() => SysUser)
  @Column({ type: DataType.UUID, allowNull: true, field: 'logged_by_uuid' }) declare loggedByUuid?: string;

  @BelongsTo(() => CrmParty, { foreignKey: 'partyUuid', targetKey: 'uuid', as: 'party' }) declare party?: CrmParty;
  @BelongsTo(() => SysUser, { foreignKey: 'loggedByUuid', targetKey: 'uuid', as: 'loggedBy' }) declare loggedBy?: SysUser;
}
