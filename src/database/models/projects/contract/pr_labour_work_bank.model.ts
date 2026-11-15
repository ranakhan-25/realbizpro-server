/* eslint-disable prettier/prettier */
import {
  Column,
  DataType,
  Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import type {
  LabourWorkBankAttributes,
  LabourWorkBankCreationAttributes,
  LabourWorkBankUpdateAttributes,
} from 'src/database/types/labourworkbank.types';
import { SysOrganization } from "src/database/models/system/sys_organization.model";
import { Project } from "src/database/models/projects/project/pr_project.model";

export enum LabourWorkBankStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  BLOCKED = 'blocked',
}

@Table({
  tableName: 'labour_work_bank',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'LabourWorkBank_code_idx',
      fields: ['code'],
    },
    {
      name: 'LabourWorkBank_phone_idx',
      fields: ['phone'],
    },
    {
      name: 'LabourWorkBank_email_idx',
      fields: ['email'],
    },
    {
      name: 'LabourWorkBank_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class LabourWorkBank
  extends BaseModel<
    LabourWorkBankUpdateAttributes,
    LabourWorkBankCreationAttributes
  >
  implements LabourWorkBankAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare businessName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare email?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare phone: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare address?: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    defaultValue: 0,
  })
  declare creditLimit?: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare dueDate?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: 'Labour',
  })
  declare underGroup?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare addedById?: string;

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

  @Column({
    type: DataType.ENUM(
      ...Object.values(LabourWorkBankStatus),
    ),
    allowNull: false,
    defaultValue: LabourWorkBankStatus.ACTIVE,
  })
  declare status: LabourWorkBankStatus;
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
