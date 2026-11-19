// Auto-generated types for BookingApproval
// Source: src/database/models/sales_management/sm_approvals_model.ts

import { ApprovalStatus } from '../models/sales_management/sm_approvals_model';

import type { MainBooking as Booking } from '../models/sales_management/sm_main_booking.model';

export interface BookingApprovalAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  bookingId: string;
  approvalId: string;
  title: string;
  requestedBy: string;
  approverName?: string | null;
  status: ApprovalStatus;
  notes?: string | null;
  approvedDate?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  booking?: Booking;
}

export interface BookingApprovalCreationAttributes {
  bookingId: string;
  approvalId: string;
  title: string;
  requestedBy: string;
  approverName?: string | null;
  status?: ApprovalStatus; // Has default value
  notes?: string | null;
  approvedDate?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type BookingApprovalUpdateAttributes = Partial<BookingApprovalCreationAttributes>;

// Helper type for including relations
export interface BookingApprovalWithRelations extends BookingApprovalAttributes {
  booking?: Booking;
}
