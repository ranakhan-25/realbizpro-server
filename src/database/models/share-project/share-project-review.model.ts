import type { ShareProjectReviewAttributes, ShareProjectReviewCreationAttributes } from '../../types/shareprojectreview.types';

import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { ShareProject } from './share-project.model';
import { ShareUser } from '../share-user/share-user.model';

export enum ShareProjectReviewDecision {
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Table({ tableName: 'share_project_reviews', timestamps: true, paranoid: true, underscored: true })
export class ShareProjectReview extends BaseModel<ShareProjectReviewAttributes, ShareProjectReviewCreationAttributes> {
  @ForeignKey(() => ShareProject)
  @Column({ type: DataType.UUID, allowNull: false, field: 'project_uuid' })
  declare projectId: string;
  @BelongsTo(() => ShareProject, { foreignKey: 'projectId', targetKey: 'uuid' })
  declare project?: ShareProject;

  @ForeignKey(() => ShareUser)
  @Column({ type: DataType.BIGINT, allowNull: false, field: 'reviewed_by' })
  declare reviewedBy: number;
  @BelongsTo(() => ShareUser, 'reviewedBy')
  declare reviewer?: ShareUser;

  @Column({ type: DataType.ENUM(...Object.values(ShareProjectReviewDecision)), allowNull: false })
  declare decision: ShareProjectReviewDecision;
  @Column({ type: DataType.TEXT, allowNull: true })
  declare reason?: string;
}
