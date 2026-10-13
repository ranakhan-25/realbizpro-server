import { Column, DataType, Table, HasMany } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { CrmTeamMember } from './crm_team_member.model';

import type { CrmTeamAttributes, CrmTeamCreationAttributes } from '../../types/crmteam.types';

@Table({
  tableName: 'crm_teams',
  timestamps: true,
  paranoid: true,
})
export class CrmTeam extends BaseModel<CrmTeamAttributes, CrmTeamCreationAttributes> {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  leader_id?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  department?: string;

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

  @HasMany(() => CrmTeamMember, { foreignKey: 'team_id' })
  members: CrmTeamMember[];
}
