import type { ShareProjectAttributes, ShareProjectCreationAttributes } from '../../types/shareproject.types';

import { BelongsTo, Column, DataType, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { ShareUser } from '../share-user/share-user.model';
import { ShareProjectCategory } from './share-project-category.model';
import { ShareProjectImage } from './share-project-image.model';
import { ShareProjectDocument } from './share-project-document.model';
import { ShareProjectSubmission } from './share-project-submission.model';
import { ShareProjectReview } from './share-project-review.model';
import { ShareProjectStatusHistory } from './share-project-status-history.model';

export enum ShareProjectStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PUBLISHED = 'published',
  UNPUBLISHED = 'unpublished',
}

@Table({ tableName: 'share_projects', timestamps: true, paranoid: true, underscored: true })
export class ShareProject extends BaseModel<ShareProjectAttributes, ShareProjectCreationAttributes> {
  @Column({ type: DataType.STRING(40), allowNull: true, unique: true })
  declare code?: string;

  @Column({ type: DataType.STRING(150), allowNull: true })
  declare creatorName?: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare creatorEmail?: string;

  @Column({ type: DataType.STRING(20), allowNull: true })
  declare creatorPhone?: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare companyName?: string;
  @ForeignKey(() => ShareUser)
  @Column({ type: DataType.BIGINT, allowNull: false, field: 'owner_id' })
  declare ownerId: number;
  @BelongsTo(() => ShareUser, 'ownerId')
  declare owner?: ShareUser;

  @ForeignKey(() => ShareProjectCategory)
  @Column({ type: DataType.BIGINT, allowNull: false, field: 'category_id' })
  declare categoryId: number;
  @BelongsTo(() => ShareProjectCategory, 'categoryId')
  declare category?: ShareProjectCategory;

  @Column({ type: DataType.STRING(200), allowNull: false })
  declare name: string;
  @Column({ type: DataType.TEXT, allowNull: false })
  declare description: string;
  @Column({ type: DataType.STRING(255), allowNull: true })
  declare location?: string;
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: false, field: 'total_investment_amount' })
  declare totalInvestmentAmount: string;
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'total_shares' })
  declare totalShares: number;
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: false, field: 'price_per_share' })
  declare pricePerShare: string;
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: false, field: 'minimum_investment' })
  declare minimumInvestment: string;
  @Column({ type: DataType.DECIMAL(8, 2), allowNull: true, field: 'expected_annual_return' })
  declare expectedAnnualReturn?: string;
  @Column({ type: DataType.DATEONLY, allowNull: true, field: 'start_date' })
  declare startDate?: string;
  @Column({ type: DataType.DATEONLY, allowNull: true, field: 'end_date' })
  declare endDate?: string;
  @Column({ type: DataType.TEXT, allowNull: true, field: 'thumbnail_url' })
  declare thumbnailUrl?: string;
  @Column({
    type: DataType.ENUM(...Object.values(ShareProjectStatus)),
    allowNull: false,
    defaultValue: ShareProjectStatus.DRAFT,
  })
  declare status: ShareProjectStatus;
  @Column({ type: DataType.TEXT, allowNull: true, field: 'rejection_reason' })
  declare rejectionReason?: string;
  @Column({ type: DataType.DATE, allowNull: true, field: 'submitted_at' })
  declare submittedAt?: Date;
  @Column({ type: DataType.DATE, allowNull: true, field: 'published_at' })
  declare publishedAt?: Date;

  @HasMany(() => ShareProjectImage, { foreignKey: 'projectId', sourceKey: 'uuid' }) declare images?: ShareProjectImage[];
  @HasMany(() => ShareProjectDocument, { foreignKey: 'projectId', sourceKey: 'uuid' }) declare documents?: ShareProjectDocument[];
  @HasMany(() => ShareProjectSubmission, { foreignKey: 'projectId', sourceKey: 'uuid' }) declare submissions?: ShareProjectSubmission[];
  @HasMany(() => ShareProjectReview, { foreignKey: 'projectId', sourceKey: 'uuid' }) declare reviews?: ShareProjectReview[];
  @HasMany(() => ShareProjectStatusHistory, { foreignKey: 'projectId', sourceKey: 'uuid' }) declare statusHistory?: ShareProjectStatusHistory[];
}
