import type { ShareProjectImageAttributes, ShareProjectImageCreationAttributes } from '../../types/shareprojectimage.types';

import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { ShareProject } from './share-project.model';

@Table({ tableName: 'share_project_images', timestamps: true, paranoid: true, underscored: true })
export class ShareProjectImage extends BaseModel<ShareProjectImageAttributes, ShareProjectImageCreationAttributes> {
  @ForeignKey(() => ShareProject)
  @Column({ type: DataType.UUID, allowNull: false, field: 'project_uuid' })
  declare projectId: string;
  @BelongsTo(() => ShareProject, { foreignKey: 'projectId', targetKey: 'uuid' })
  declare project?: ShareProject;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare url: string;
  @Column({ type: DataType.STRING(255), allowNull: true })
  declare altText?: string;
  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  declare sortOrder: number;
}
