import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import { Project } from '../project/pr_project.model';
import {
  ProjectTeamMemberAttributes,
  ProjectTeamMemberCreationAttributes,
  ProjectTeamMemberUpdateAttributes,
} from 'src/database/types/projectteammember.types';
import { SysOrganization } from "src/database/models/system/sys_organization.model";

@Table({
  tableName: 'pr_project_team_members',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'ProjectTeamMember_projectId_email_idx',
      unique: true,
      fields: ['projectId', 'email'],
      where: { deletedAt: null },
    },
  ],
})
export class ProjectTeamMember
  extends BaseModel<
    ProjectTeamMemberUpdateAttributes,
    ProjectTeamMemberCreationAttributes
  >
  implements ProjectTeamMemberAttributes
{
  @ForeignKey(() => Project)
  @Column({
              field: 'project_id',
              type: DataType.UUID,
              allowNull: false,
            })
  declare projectId: string;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare project?: Project;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare phone?: string | null;

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
