import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';
import {
  EmployeeListAttributes,
  EmployeeListCreationAttributes,
  EmployeeListUpdateAttributes,
} from 'src/database/types/employeelist.types';
import { Unit } from './hrm_unit_model';
import { Section } from './hrm_section_model';
import { Department } from './hrm_department_model';
import { Designation } from './hrm_designation_model';
import { SalaryGrade } from './hrm_salary_grade_model';
// import { HrmShift } from './hrm_hrm_shift_model';

import { Under } from './hrm_under_model';
import { EmployeeSalary } from './hrm_employeesalary_model';
import { Allowance } from './hrm_allowance_model';
import { Commission } from './hrm_commission_model';
import { Loan } from './hrm_loan_model';
import { SaturationDeduction } from './hrm_saturationdeduction_model';
import { Overtime } from './hrm_overtime_model';
import { EmployeeType } from './hrm_employee_type-model';
import { Increment } from './hrm_increment_model';
import { Attendance } from './hrm_attendance_model';
import { BonusGenerate } from './hrm_bonus_generate_model';
import { Shift } from './hrm_shift_model';
import { AttendanceReconciliation } from '../attendance/attendance_reconciliation_model';
import { LeaveApplication } from '../leaveapplication/leaveapplication_modes';
import { SysOrganization } from "src/database/models/system/sys_organization.model";
import { Project } from "src/database/models/projects/project/pr_project.model";

export enum EmployeeListStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum MaritalStatus {
  MARRIED = 'married',
  SINGLE = 'single',
  DIVORCED = 'divorced',
}

@Table({
  tableName: 'employee_list',
  timestamps: true,
  paranoid: true,
  underscored: false,
  indexes: [
    {
      name: 'EmployeeList_employeeCode_idx',
      fields: ['employeeCode'],
      unique: true,
    },
    {
      name: 'EmployeeList_name_idx',
      fields: ['name'],
    },
    {
      name: 'EmployeeList_email_idx',
      fields: ['email'],
    },
    {
      name: 'EmployeeList_phone_idx',
      fields: ['phone'],
    },
    {
      name: 'EmployeeList_nid_idx',
      fields: ['nid'],
    },
    {
      name: 'EmployeeList_departmentId_idx',
      fields: ['departmentId'],
    },
    {
      name: 'EmployeeList_designationId_idx',
      fields: ['designationId'],
    },
    {
      name: 'EmployeeList_unitId_idx',
      fields: ['unitId'],
    },
    {
      name: 'EmployeeList_sectionId_idx',
      fields: ['sectionId'],
    },
    {
      name: 'EmployeeList_salaryGradeId_idx',
      fields: ['salaryGradeId'],
    },
    {
      name: 'EmployeeList_shiftId_idx',
      fields: ['shiftId'],
    },
    {
      name: 'EmployeeList_employeeTypeId_idx',
      fields: ['employeeTypeId'],
    },
    {
      name: 'EmployeeList_underId_idx',
      fields: ['underId'],
    },
    {
      name: 'EmployeeList_status_idx',
      fields: ['status'],
    },
    {
      name: 'EmployeeList_deletedAt_idx',
      fields: ['deleted_at'],
    },
  ],
})
export class EmployeeList
  extends BaseModel<
    EmployeeListUpdateAttributes,
    EmployeeListCreationAttributes
  >
  implements EmployeeListAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare employeeCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare code?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare secondaryPhone?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare birthDate: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare nid: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare tin?: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(MaritalStatus),
    ),
    allowNull: false,
  })
  declare maritalStatus: MaritalStatus;

  @ForeignKey(() => Unit)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare unitId?: string;

  @BelongsTo(() => Unit, {
    foreignKey: 'unitId',
    targetKey: 'uuid',
    as: 'unit',
  })
  declare unit?: Unit;

  @ForeignKey(() => Section)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare sectionId?: string;

  @BelongsTo(() => Section, {
    foreignKey: 'sectionId',
    targetKey: 'uuid',
    as: 'section',
  })
  declare section?: Section;

  @ForeignKey(() => Department)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare departmentId: string;

  @BelongsTo(() => Department, {
    foreignKey: 'departmentId',
    targetKey: 'uuid',
    as: 'department',
  })
  declare department?: Department;

  @ForeignKey(() => Designation)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare designationId: string;

  @BelongsTo(() => Designation, {
    foreignKey: 'designationId',
    targetKey: 'uuid',
    as: 'designation',
  })
  declare designation?: Designation;

  @ForeignKey(() => SalaryGrade)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare salaryGradeId?: string;

  @BelongsTo(() => SalaryGrade, {
    foreignKey: 'salaryGradeId',
    targetKey: 'uuid',
    as: 'salaryGrade',
  })
  declare salaryGrade?: SalaryGrade;

  @BelongsTo(() => Shift, {
    foreignKey: 'shiftId',
    targetKey: 'uuid',
    as: 'shift',
  })
  declare shift?: Shift;

  @BelongsTo(() => EmployeeType, {
    foreignKey: 'employeeTypeId',
    targetKey: 'uuid',
    as: 'employeeType',
  })
  declare employeeType?: EmployeeType;

  @ForeignKey(() => Under)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare underId: string;

  @BelongsTo(() => Under, {
    foreignKey: 'underId',
    targetKey: 'uuid',
    as: 'under',
  })
  declare under?: Under;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare grossSalary: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare joiningDate: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare leaveDate?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare image?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare cv?: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(EmployeeListStatus),
    ),
    allowNull: false,
    defaultValue: EmployeeListStatus.ACTIVE,
  })
  declare status: EmployeeListStatus;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare hasOtherInformation: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare hasNomineeInformation: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare hasBankInformation: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare createUser: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare nomineeName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare nomineePhone?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare nomineeNid?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare nomineeImage?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare bankName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare accountHolderName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare accountNo?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare branchName?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare swiftCode?: string;

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

  @HasMany(() => EmployeeSalary, {
    foreignKey: 'employeeId',
    sourceKey: 'uuid',
    as: 'salaries',
  })
  declare salaries?: EmployeeSalary[];

  @HasMany(() => Allowance, {
    foreignKey: 'employeeId',
    sourceKey: 'uuid',
    as: 'allowances',
  })
  declare allowances?: Allowance[];

  @HasMany(() => Commission, {
    foreignKey: 'employeeId',
    sourceKey: 'uuid',
    as: 'commissions',
  })
  declare commissions?: Commission[];

  @HasMany(() => Loan, {
    foreignKey: 'employeeId',
    sourceKey: 'uuid',
    as: 'loans',
  })
  declare loans?: Loan[];

  @HasMany(() => SaturationDeduction, {
    foreignKey: 'employeeId',
    sourceKey: 'uuid',
    as: 'saturationDeductions',
  })
  declare saturationDeductions?: SaturationDeduction[];

  @HasMany(() => Overtime, {
    foreignKey: 'employeeId',
    sourceKey: 'uuid',
    as: 'overtimes',
  })
  declare overtimes?: Overtime[];
  @HasMany(() => Increment, {
    foreignKey: 'employeeId',
    sourceKey: 'uuid',
    as: 'increments',
  })
  declare increments?: Increment[];
  @HasMany(() => Attendance, {
    foreignKey: 'employeeId',
    sourceKey: 'uuid',
    as: 'attendances',
  })
  declare attendances?: Attendance[];
  @HasMany(() => BonusGenerate, {
    foreignKey: 'employeeId',
    sourceKey: 'uuid',
    as: 'bonusGenerates',
  })
  declare bonusGenerates?: BonusGenerate[];
  @HasMany(() => AttendanceReconciliation, {
    foreignKey: 'employeeId',
    sourceKey: 'uuid',
    as: 'attendanceReconciliations',
  })
  declare attendanceReconciliations?: AttendanceReconciliation[];
  @HasMany(() => LeaveApplication, {
    foreignKey: 'employeeId',
    sourceKey: 'uuid',
    as: 'leaveApplications',
  })
  declare leaveApplications?: LeaveApplication[];
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
