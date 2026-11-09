import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import {
  SaturationDeductionAttributes,
  SaturationDeductionCreationAttributes,
  SaturationDeductionUpdateAttributes,
} from 'src/database/types/saturationdeduction.types';
import { EmployeeList } from './hrm_employeeList_model';
import { PaymentType } from './hrm_payment_enum';
import { SysOrganization } from "src/database/models/system/sys_organization.model";
import { Project } from "src/database/models/projects/project/pr_project.model";

// fix: Allowance model theke na, alada enum file theke

@Table({
  tableName: 'hrm_saturation_deduction',
  underscored: true,
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      name: 'SaturationDeduction_employeeId_idx',
      fields: ['employee_id'],
    },
    {
      name: 'SaturationDeduction_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class SaturationDeduction
  extends BaseModel<
    SaturationDeductionUpdateAttributes,
    SaturationDeductionCreationAttributes
  >
  implements SaturationDeductionAttributes
{
  @ForeignKey(() => EmployeeList)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare employeeId: string;

  @BelongsTo(() => EmployeeList, {
    foreignKey: 'employeeId',
    targetKey: 'uuid',
    as: 'employee',
  })
  declare employee?: EmployeeList;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  declare amount: number;

  @Column({
    type: DataType.ENUM(
      ...Object.values(PaymentType),
    ),
    allowNull: true,
  })
  declare paymentType?: PaymentType;

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
