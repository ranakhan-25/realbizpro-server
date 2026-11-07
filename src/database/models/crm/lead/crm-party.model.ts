import { BelongsTo, Column, DataType, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { SysOrganization } from 'src/database/models/system/sys_organization.model';
import { CrmPartyAssignment } from './crm-party-assignment.model';
import { CrmPartyCommunication } from './crm-party-communication.model';

import type { CrmPartyAttributes, CrmPartyCreationAttributes } from '../../../types/crmparty.types';

export enum CrmPartyType { CUSTOMER = 'Customer', INVESTOR = 'Investor', VENDOR = 'Vendor', OTHER = 'Other' }
export enum CrmPartyStatus { ACTIVE = 'active', INACTIVE = 'inactive' }

@Table({ tableName: 'crm_parties', timestamps: true, paranoid: true, underscored: true })
export class CrmParty extends BaseModel<CrmPartyAttributes, CrmPartyCreationAttributes> {
  @Column({ type: DataType.STRING(200), allowNull: false }) declare name: string;
  @Column({ type: DataType.STRING(40), allowNull: false }) declare phone: string;
  @Column({ type: DataType.STRING(200), allowNull: true, validate: { isEmail: true } }) declare email?: string;
  @Column({ type: DataType.STRING(100), allowNull: true, field: 'nid_number' }) declare nidNumber?: string;
  @Column({ type: DataType.ENUM(...Object.values(CrmPartyType)), allowNull: false, field: 'party_type' }) declare partyType: CrmPartyType;
  @Column({ type: DataType.TEXT, allowNull: true }) declare address?: string;
  @Column({ type: DataType.TEXT, allowNull: true, comment: 'Comma-separated tags from the CRM party form' }) declare tags?: string;
  @Column({ type: DataType.ENUM(...Object.values(CrmPartyStatus)), allowNull: false, defaultValue: CrmPartyStatus.ACTIVE }) declare status: CrmPartyStatus;

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

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by', defaultValue: null }) declare createdBy?: string | null;
  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by', defaultValue: null }) declare updatedBy?: string | null;
  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by', defaultValue: null }) declare deletedBy?: string | null;

  @ForeignKey(() => SysUser)
  @Column({ type: DataType.UUID, allowNull: true, field: 'assigned_to_uuid' }) declare assignedToUuid?: string;
  @ForeignKey(() => SysUser)
  @Column({ type: DataType.UUID, allowNull: true, field: 'created_by_uuid' }) declare createdByUuid?: string;
  @ForeignKey(() => SysUser)
  @Column({ type: DataType.UUID, allowNull: true, field: 'updated_by_uuid' }) declare updatedByUuid?: string;
  @ForeignKey(() => SysUser)
  @Column({ type: DataType.UUID, allowNull: true, field: 'deleted_by_uuid' }) declare deletedByUuid?: string;

  @BelongsTo(() => SysUser, { foreignKey: 'assignedToUuid', targetKey: 'uuid', as: 'assignee' }) declare assignee?: SysUser;
  @BelongsTo(() => SysUser, { foreignKey: 'createdByUuid', targetKey: 'uuid', as: 'creator' }) declare creator?: SysUser;
  @HasMany(() => CrmPartyAssignment, { foreignKey: 'partyUuid', sourceKey: 'uuid', as: 'assignments' }) declare assignments?: CrmPartyAssignment[];
  @HasMany(() => CrmPartyCommunication, { foreignKey: 'partyUuid', sourceKey: 'uuid', as: 'communications' }) declare communications?: CrmPartyCommunication[];
}
