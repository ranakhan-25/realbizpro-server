import type { ProjectDocumentAttributes, ProjectDocumentCreationAttributes } from '../../../types/projectdocument.types';

import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { Project } from '../project/pr_project.model';

@Table({
  tableName: 'project_document',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'project_document_project_id_idx',
      fields: ['projectId'],
    },
  ],
})
export class ProjectDocument extends BaseModel<ProjectDocumentAttributes, ProjectDocumentCreationAttributes> {
  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare projectId: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare documentName: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    defaultValue: 'General',
  })
  declare documentType: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare details?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare rajuk?: string;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
  })
  declare project?: Project;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare createdBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare updatedBy?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare deletedBy?: string;
}
