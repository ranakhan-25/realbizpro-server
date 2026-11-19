// Auto-generated types for PaySlip
// Source: src/database/models/hrm/employee/hrm_pay_slip_model.ts

export interface PaySlipAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  month: string;
  year: number;
  grossSalary: number;
  workingDays: number;
  absentDays: number;
  absentAmount: number;
  deduction: number;
  netSalary: number;
  bankPayableAmount: number;
  cashPayableAmount: number;
  status: string;
  generatedAt: Date;
  createdBy?: string | null;
  orgId?: number | null;
}

export interface PaySlipCreationAttributes {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  month: string;
  year: number;
  grossSalary?: number; // Has default value
  workingDays?: number; // Has default value
  absentDays?: number; // Has default value
  absentAmount?: number; // Has default value
  deduction?: number; // Has default value
  netSalary?: number; // Has default value
  bankPayableAmount?: number; // Has default value
  cashPayableAmount?: number; // Has default value
  status?: string; // Has default value
  generatedAt?: Date; // Has default value
  createdBy?: string | null;
  orgId?: number | null;
}

export type PaySlipUpdateAttributes = Partial<PaySlipCreationAttributes>;

// Helper type for including relations
export interface PaySlipWithRelations extends PaySlipAttributes {
  // No relations defined
}
