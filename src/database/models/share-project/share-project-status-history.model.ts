import type { ShareProjectStatusHistoryAttributes, ShareProjectStatusHistoryCreationAttributes } from '../../types/shareprojectstatushistory.types';

import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { ShareProject } from './share-project.model';

@Table({ tableName: 'share_project_status_history', timestamps: true, paranoid: true, underscored: true })
export class ShareProjectStatusHistory extends BaseModel<ShareProjectStatusHistoryAttributes, ShareProjectStatusHistoryCreationAttributes> {
  @ForeignKey(() => ShareProject)
  @Column({ type: DataType.UUID, allowNull: false, field: 'project_uuid' })
  declare projectId: string;
  @BelongsTo(() => ShareProject, { foreignKey: 'projectId', targetKey: 'uuid' })
  declare project?: ShareProject;

  @Column({ type: DataType.STRING(30), allowNull: false, field: 'from_status' })
  declare fromStatus: string;
  @Column({ type: DataType.STRING(30), allowNull: false, field: 'to_status' })
  declare toStatus: string;
  @Column({ type: DataType.BIGINT, allowNull: true, field: 'changed_by' })
  declare changedBy?: number;
  @Column({ type: DataType.TEXT, allowNull: true })
  declare note?: string;
}
