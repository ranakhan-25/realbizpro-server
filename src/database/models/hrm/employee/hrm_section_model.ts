/* eslint-disable prettier/prettier */
import {
  Column,
  DataType,
  HasMany,
  Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import type {
  SectionAttributes,
  SectionCreationAttributes,
  SectionUpdateAttributes,
} from 'src/database/types/section.types'; // ← eta use koro
import { EmployeeList } from './hrm_employeeList_model';
import { SysOrganization } from "src/database/models/system/sys_organization.model";

export enum SectionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'section',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'Section_name_idx',
      fields: ['name'],
    },
    {
      name: 'Section_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
}) // ← fix
export class Section
  extends BaseModel<
    SectionUpdateAttributes, // ← fix
    SectionCreationAttributes // ← fix
  >
  implements SectionAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;

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
      ...Object.values(SectionStatus),
    ),
    allowNull: false,
    defaultValue: SectionStatus.ACTIVE,
  })
  declare status: SectionStatus;

  @HasMany(() => EmployeeList, {
    foreignKey: 'sectionId',
    sourceKey: 'uuid',
    as: 'employees',
  })
  declare employees?: EmployeeList[];
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
