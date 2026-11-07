import type { ShareProjectDocumentAttributes, ShareProjectDocumentCreationAttributes } from '../../types/shareprojectdocument.types';

import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { ShareProject } from './share-project.model';

@Table({ tableName: 'share_project_documents', timestamps: true, paranoid: true, underscored: true })
export class ShareProjectDocument extends BaseModel<ShareProjectDocumentAttributes, ShareProjectDocumentCreationAttributes> {
  @ForeignKey(() => ShareProject)
  @Column({ type: DataType.UUID, allowNull: false, field: 'project_uuid' })
  declare projectId: string;
  @BelongsTo(() => ShareProject, { foreignKey: 'projectId', targetKey: 'uuid' })
  declare project?: ShareProject;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare title: string;
  @Column({ type: DataType.STRING(255), allowNull: false })
  declare url: string;
  @Column({ type: DataType.STRING(50), allowNull: true })
  declare fileType?: string;
}
