import { Column, DataType, Table, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrmTeam } from './crm_team.model';

import type { CrmTeamMemberAttributes, CrmTeamMemberCreationAttributes } from '../../types/crmteammember.types';

@Table({
  tableName: 'crm_team_members',
  timestamps: true,
  paranoid: true,
})
export class CrmTeamMember extends BaseModel<CrmTeamMemberAttributes, CrmTeamMemberCreationAttributes> {
  @Column({ type: DataType.BIGINT, allowNull: false })
  team_id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  user_id: string;

  @Column({ type: DataType.STRING, allowNull: true })
  role_in_team?: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  is_active: boolean;

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'project_id' })
  declare projectId?: string;

  @BelongsTo(() => CrmTeam, { foreignKey: 'team_id' })
  team: CrmTeam;
}
