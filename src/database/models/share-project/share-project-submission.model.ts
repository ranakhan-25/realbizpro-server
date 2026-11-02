import type { ShareProjectSubmissionAttributes, ShareProjectSubmissionCreationAttributes } from '../../types/shareprojectsubmission.types';

import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { ShareProject } from './share-project.model';

@Table({ tableName: 'share_project_submissions', timestamps: true, paranoid: true, underscored: true })
export class ShareProjectSubmission extends BaseModel<ShareProjectSubmissionAttributes, ShareProjectSubmissionCreationAttributes> {
  @ForeignKey(() => ShareProject)
  @Column({ type: DataType.UUID, allowNull: false, field: 'project_uuid' })
  declare projectId: string;
  @BelongsTo(() => ShareProject, { foreignKey: 'projectId', targetKey: 'uuid' })
  declare project?: ShareProject;

  @Column({ type: DataType.STRING(30), allowNull: false })
  declare type: string;
  @Column({ type: DataType.TEXT, allowNull: true })
  declare note?: string;
  @Column({ type: DataType.BIGINT, allowNull: false, field: 'submitted_by' })
  declare submittedBy: number;
}
