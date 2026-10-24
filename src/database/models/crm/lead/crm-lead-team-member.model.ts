import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { LeadTeam } from './crm-lead-master-data.model';

import type { LeadTeamMemberAttributes, LeadTeamMemberCreationAttributes } from '../../../types/leadteammember.types';

@Table({ tableName: 'crm_team_members', timestamps: true, paranoid: true, underscored: true })
export class LeadTeamMember extends BaseModel<LeadTeamMemberAttributes, LeadTeamMemberCreationAttributes> {
  @ForeignKey(() => LeadTeam)
  @Column({ type: DataType.BIGINT, allowNull: false, field: 'team_id' }) declare teamId: number;

  @ForeignKey(() => SysUser)
  @Column({ type: DataType.STRING, allowNull: false, field: 'user_id' }) declare userId: string;

  @Column({ type: DataType.STRING(100), allowNull: true, field: 'role_in_team' }) declare roleInTeam?: string;
  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true, field: 'is_active' }) declare isActive?: boolean;
  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' }) declare createdBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' }) declare updatedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' }) declare deletedBy?: string;
  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' }) declare projectId?: string;

  @BelongsTo(() => LeadTeam, { foreignKey: 'teamId', targetKey: 'id', as: 'team' }) declare team?: LeadTeam;
  @BelongsTo(() => SysUser, { foreignKey: 'userId', targetKey: 'uuid', as: 'user' }) declare user?: SysUser;
}
