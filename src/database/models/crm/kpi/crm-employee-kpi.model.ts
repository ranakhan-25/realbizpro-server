import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { LeadTeam } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { SysUser } from 'src/database/models/system/sys_user.model';

import type { CrmEmployeeKpiAttributes, CrmEmployeeKpiCreationAttributes } from '../../../types/crmemployeekpi.types';

@Table({ tableName: 'crm_employee_kpis', timestamps: true, paranoid: true, underscored: true })
export class CrmEmployeeKpi extends BaseModel<CrmEmployeeKpiAttributes, CrmEmployeeKpiCreationAttributes> {
  @Column({ type: DataType.ENUM('INDIVIDUAL', 'TEAM'), allowNull: false })
  declare type: 'INDIVIDUAL' | 'TEAM';

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare name: string;

  @ForeignKey(() => SysUser)
  @Column({ type: DataType.UUID, allowNull: true, field: 'user_id' })
  declare userId?: string;

  @ForeignKey(() => LeadTeam)
  @Column({ type: DataType.BIGINT, allowNull: true, field: 'team_id' })
  declare teamId?: number;

  @Column({ type: DataType.STRING(100), allowNull: false, field: 'work_type_1' })
  declare workType1: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, field: 'target_1' })
  declare target1: number;

  @Column({ type: DataType.STRING(100), allowNull: false, field: 'work_type_2' })
  declare workType2: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, field: 'target_2' })
  declare target2: number;

  @Column({ type: DataType.STRING(100), allowNull: false, field: 'work_type_3' })
  declare workType3: string;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false, field: 'target_3' })
  declare target3: number;

  @Column({ type: DataType.DATEONLY, allowNull: false, field: 'from_date' })
  declare fromDate: string;

  @Column({ type: DataType.DATEONLY, allowNull: false, field: 'to_date' })
  declare toDate: string;

  @Column({ type: DataType.ENUM('ACTIVE', 'INACTIVE'), allowNull: false, defaultValue: 'ACTIVE' })
  declare status: 'ACTIVE' | 'INACTIVE';

  @Column({ type: DataType.STRING, allowNull: true, field: 'created_by' })
  declare createdBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'updated_by' })
  declare updatedBy?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'deleted_by' })
  declare deletedBy?: string;

  @BelongsTo(() => SysUser, { foreignKey: 'userId', targetKey: 'uuid', as: 'user' })
  declare user?: SysUser;

  @BelongsTo(() => LeadTeam, { foreignKey: 'teamId', targetKey: 'id', as: 'team' })
  declare team?: LeadTeam;
}
