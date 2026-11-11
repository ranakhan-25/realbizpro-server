/* eslint-disable prettier/prettier */
import {
  Column,
  DataType,
  HasMany,
  Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import type {
  BonusAttributes,
  BonusCreationAttributes,
  BonusUpdateAttributes,
} from 'src/database/types/bonus.types';
import { BonusGenerate } from './hrm_bonus_generate_model';
import { SysOrganization } from "src/database/models/system/sys_organization.model";
import { Project } from "src/database/models/projects/project/pr_project.model";

export enum BonusStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'hrm_bonus',
  underscored: true,
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      name: 'Bonus_name_idx',
      fields: ['name'],
    },
    {
      name: 'Bonus_festivalDate_idx',
      fields: ['festival_date'],
    },
    {
      name: 'Bonus_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class Bonus
  extends BaseModel<
    BonusUpdateAttributes,
    BonusCreationAttributes
  >
  implements BonusAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
  })
  declare percentage: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare festivalDate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedById?: string;

  @Column({
          type: DataType.STRING,
          allowNull: true,
          field: 'created_by',
        })
  declare createdBy?: string;

  @Column({
          type: DataType.STRING,
          allowNull: true,
          field: 'updated_by',
        })
  declare updatedBy?: string;

  @Column({
          type: DataType.STRING,
          allowNull: true,
          field: 'deleted_by',
        })
  declare deletedBy?: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(BonusStatus),
    ),
    allowNull: false,
    defaultValue: BonusStatus.ACTIVE,
  })
  declare status: BonusStatus;
  @HasMany(() => BonusGenerate, {
    foreignKey: 'bonusId',
    sourceKey: 'uuid',
    as: 'bonusGenerates',
  })
  declare bonusGenerates?: BonusGenerate[];
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
    @ForeignKey(() => Project)
    @Column({
            type: DataType.UUID,
            allowNull: true,
            field: 'project_id',
            defaultValue: null,
          })
    declare projectId?: string | null;
    @BelongsTo(() => Project, {
            foreignKey: 'projectId',
            targetKey: 'uuid',
            as: 'project',
          })
    declare project?: Project;
}
