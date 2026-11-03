// Auto-generated types for EmployeeList
// Source: src/database/models/hrm/employee/hrm_employeeList_model.ts

import { MaritalStatus } from '../models/hrm/employee/hrm_employeeList_model';
import { EmployeeListStatus } from '../models/hrm/employee/hrm_employeeList_model';

import type { Unit } from '../models/hrm/employee/hrm_unit_model';
import type { Section } from '../models/hrm/employee/hrm_section_model';
import type { Department } from '../models/hrm/employee/hrm_department_model';
import type { Designation } from '../models/hrm/employee/hrm_designation_model';
import type { SalaryGrade } from '../models/hrm/employee/hrm_salary_grade_model';
import type { Shift } from '../models/hrm/employee/hrm_shift_model';
import type { EmployeeType } from '../models/hrm/employee/hrm_employee_type-model';
import type { Under } from '../models/hrm/employee/hrm_under_model';
import type { EmployeeSalary } from '../models/hrm/employee/hrm_employeesalary_model';
import type { Allowance } from '../models/hrm/employee/hrm_allowance_model';
import type { Commission } from '../models/hrm/employee/hrm_commission_model';
import type { Loan } from '../models/hrm/employee/hrm_loan_model';
import type { SaturationDeduction } from '../models/hrm/employee/hrm_saturationdeduction_model';
import type { Overtime } from '../models/hrm/employee/hrm_overtime_model';
import type { Increment } from '../models/hrm/employee/hrm_increment_model';
import type { Attendance } from '../models/hrm/employee/hrm_attendance_model';
import type { BonusGenerate } from '../models/hrm/employee/hrm_bonus_generate_model';
import type { AttendanceReconciliation } from '../models/hrm/attendance/attendance_reconciliation_model';
import type { LeaveApplication } from '../models/hrm/leaveapplication/leaveapplication_modes';

export interface EmployeeListAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  name: string;
  employeeCode: string;
  code?: string | null;
  phone: string;
  secondaryPhone?: string | null;
  email: string;
  birthDate: string;
  nid: string;
  tin?: string | null;
  maritalStatus: MaritalStatus;
  unitId?: string | null;
  sectionId?: string | null;
  departmentId: string;
  designationId: string;
  salaryGradeId?: string | null;
  underId: string;
  grossSalary: number;
  joiningDate: string;
  leaveDate?: string | null;
  image?: string | null;
  cv?: string | null;
  status: EmployeeListStatus;
  hasOtherInformation: boolean;
  hasNomineeInformation: boolean;
  hasBankInformation: boolean;
  createUser: boolean;
  nomineeName?: string | null;
  nomineePhone?: string | null;
  nomineeNid?: string | null;
  nomineeImage?: string | null;
  bankName?: string | null;
  accountHolderName?: string | null;
  accountNo?: string | null;
  branchName?: string | null;
  swiftCode?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  unit?: Unit;
  section?: Section;
  department?: Department;
  designation?: Designation;
  salaryGrade?: SalaryGrade;
  shift?: Shift;
  employeeType?: EmployeeType;
  under?: Under;
  salaries?: EmployeeSalary[];
  allowances?: Allowance[];
  commissions?: Commission[];
  loans?: Loan[];
  saturationDeductions?: SaturationDeduction[];
  overtimes?: Overtime[];
  increments?: Increment[];
  attendances?: Attendance[];
  bonusGenerates?: BonusGenerate[];
  attendanceReconciliations?: AttendanceReconciliation[];
  leaveApplications?: LeaveApplication[];
}

export interface EmployeeListCreationAttributes {
  name: string;
  employeeCode: string;
  code?: string | null;
  phone: string;
  secondaryPhone?: string | null;
  email: string;
  birthDate: string;
  nid: string;
  tin?: string | null;
  maritalStatus: MaritalStatus;
  unitId?: string | null;
  sectionId?: string | null;
  departmentId: string;
  designationId: string;
  salaryGradeId?: string | null;
  underId: string;
  grossSalary?: number; // Has default value
  joiningDate: string;
  leaveDate?: string | null;
  image?: string | null;
  cv?: string | null;
  status?: EmployeeListStatus; // Has default value
  hasOtherInformation?: boolean; // Has default value
  hasNomineeInformation?: boolean; // Has default value
  hasBankInformation?: boolean; // Has default value
  createUser?: boolean; // Has default value
  nomineeName?: string | null;
  nomineePhone?: string | null;
  nomineeNid?: string | null;
  nomineeImage?: string | null;
  bankName?: string | null;
  accountHolderName?: string | null;
  accountNo?: string | null;
  branchName?: string | null;
  swiftCode?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type EmployeeListUpdateAttributes = Partial<EmployeeListCreationAttributes>;

// Helper type for including relations
export interface EmployeeListWithRelations extends EmployeeListAttributes {
  unit?: Unit;
  section?: Section;
  department?: Department;
  designation?: Designation;
  salaryGrade?: SalaryGrade;
  shift?: Shift;
  employeeType?: EmployeeType;
  under?: Under;
  salaries?: EmployeeSalary[];
  allowances?: Allowance[];
  commissions?: Commission[];
  loans?: Loan[];
  saturationDeductions?: SaturationDeduction[];
  overtimes?: Overtime[];
  increments?: Increment[];
  attendances?: Attendance[];
  bonusGenerates?: BonusGenerate[];
  attendanceReconciliations?: AttendanceReconciliation[];
  leaveApplications?: LeaveApplication[];
}
