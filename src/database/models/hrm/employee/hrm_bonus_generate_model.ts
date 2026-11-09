import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';

import { Bonus } from './hrm_bonus_model';
// import { Employee } from './hrm_employee_model';
import {
  BonusGenerateAttributes,
  BonusGenerateCreationAttributes,
  BonusGenerateUpdateAttributes,
} from 'src/database/types/bonusgenerate.types';
import { EmployeeList } from './hrm_employeeList_model';
import { SysOrganization } from "src/database/models/system/sys_organization.model";
import { Project } from "src/database/models/projects/project/pr_project.model";

export enum BonusGenerateStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'bonus_generate',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'BonusGenerate_bonusId_idx',
      fields: ['bonusId'],
    },
    {
      name: 'BonusGenerate_employeeId_idx',
      fields: ['employeeId'],
    },
    {
      name: 'BonusGenerate_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class BonusGenerate
  extends BaseModel<
    BonusGenerateUpdateAttributes,
    BonusGenerateCreationAttributes
  >
  implements BonusGenerateAttributes
{
  @ForeignKey(() => Bonus)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare bonusId: string;

  @ForeignKey(() => EmployeeList)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare employeeId: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  declare amount: number;

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
      ...Object.values(BonusGenerateStatus),
    ),
    allowNull: false,
    defaultValue: BonusGenerateStatus.ACTIVE,
  })
  declare status: BonusGenerateStatus;

  // Relations
  @BelongsTo(() => Bonus, {
    foreignKey: 'bonusId',
    targetKey: 'uuid',
    as: 'bonus',
  })
  declare bonus?: Bonus;

  @BelongsTo(() => EmployeeList, {
    foreignKey: 'employeeId',
    targetKey: 'uuid',
    as: 'employee',
  })
  declare employee?: EmployeeList;
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
