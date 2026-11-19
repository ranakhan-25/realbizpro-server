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
import { SysOrganization } from "src/database/models/system/sys_organization.model";

@Table({
  tableName: 'project_document',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'project_document_project_id_idx',
      fields: ['project_id'],
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
          field: 'created_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare createdBy?: string;

  @Column({
          field: 'updated_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare updatedBy?: string;

  @Column({
          field: 'deleted_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare deletedBy?: string;
    @ForeignKey(() => SysOrganization)
    @Column({
            type: DataType.BIGINT,
            allowNull: true,
            field: 'org_id',
            defaultValue: null,
          })
    declare orgId?: number | null;
    @BelongsTo(() => SysOrganization, {
            foreignKey: 'orgId',
            targetKey: 'id',
            as: 'organization',
          })
    declare organization?: SysOrganization;
}
