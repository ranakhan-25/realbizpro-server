import type {
  ProjectShareConfigurationAttributes,
  ProjectShareConfigurationCreationAttributes,
} from '../../../types/projectshareconfiguration.types';

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
  tableName: 'pr_project_share_configurations',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'pr_project_share_config_project_id_idx',
      fields: ['projectId'],
    },
  ],
})
export class ProjectShareConfiguration extends BaseModel<
  ProjectShareConfigurationAttributes,
  ProjectShareConfigurationCreationAttributes
> {
  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare projectId: string;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
  })
  declare project?: Project;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare titleName: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare shareType: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare taskNames?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  declare assignType: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare configurationAmount: number;

  @Column({
    type: DataType.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active',
  })
  declare status: 'active' | 'inactive';

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
