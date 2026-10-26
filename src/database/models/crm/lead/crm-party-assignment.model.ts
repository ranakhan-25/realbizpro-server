import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { CrmParty } from './crm-party.model';

import type { CrmPartyAssignmentAttributes, CrmPartyAssignmentCreationAttributes } from '../../../types/crmpartyassignment.types';

@Table({ tableName: 'crm_party_assignments', timestamps: true, paranoid: true, underscored: true })
export class CrmPartyAssignment extends BaseModel<CrmPartyAssignmentAttributes, CrmPartyAssignmentCreationAttributes> {
  @ForeignKey(() => CrmParty)
  @Column({ type: DataType.UUID, allowNull: false, field: 'party_uuid' }) declare partyUuid: string;
  @ForeignKey(() => SysUser)
  @Column({ type: DataType.UUID, allowNull: false, field: 'assignee_uuid' }) declare assigneeUuid: string;
  @ForeignKey(() => SysUser)
  @Column({ type: DataType.UUID, allowNull: true, field: 'assigned_by_uuid' }) declare assignedByUuid?: string;
  @Column({ type: DataType.TEXT, allowNull: true }) declare note?: string;

  @BelongsTo(() => CrmParty, { foreignKey: 'partyUuid', targetKey: 'uuid', as: 'party' }) declare party?: CrmParty;
  @BelongsTo(() => SysUser, { foreignKey: 'assigneeUuid', targetKey: 'uuid', as: 'assignee' }) declare assignee?: SysUser;
  @BelongsTo(() => SysUser, { foreignKey: 'assignedByUuid', targetKey: 'uuid', as: 'assignedBy' }) declare assignedBy?: SysUser;
}
