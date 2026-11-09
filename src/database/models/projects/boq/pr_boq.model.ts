import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';

import { BaseModel } from '../../../base.model';

import type {
  BoqAttributes,
  BoqCreationAttributes,
  BoqUpdateAttributes,
} from 'src/database/types/boq.types';

import { Project } from 'src/database/models/projects/project/pr_project.model';
import { SysOrganization } from "src/database/models/system/sys_organization.model";

@Table({
  tableName: 'pr_boq',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class Boq
  extends BaseModel<
    BoqUpdateAttributes,
    BoqCreationAttributes
  >
  implements BoqAttributes
{
  // -------------------- Foreign Key: Project --------------------

  @ForeignKey(() => Project)
  @Column({
              field: 'project_id',
              type: DataType.UUID,
              allowNull: true,
            })
  declare projectId: string | null;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare project?: Project | null;

  // -------------------- Boq Fields --------------------

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare uid?: string | null;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare date: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare titleOfWork: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare task: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare budget: number;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare percentageOfTotalBudget: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare perSftBudget: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare cost: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare available: number;

  // -------------------- Audit --------------------

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedBy?: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedById?: string | null;

  @Column({
          field: 'created_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare createdBy?: string | null;

  @Column({
          field: 'updated_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare updatedBy?: string | null;

  @Column({
          field: 'deleted_by',
          type: DataType.STRING,
          allowNull: true,
        })
  declare deletedBy?: string | null;
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
