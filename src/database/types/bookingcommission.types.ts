// Auto-generated types for BookingCommission
// Source: src/database/models/sales_management/sm_booking_commission.model.ts

import type { MainBooking as Booking } from '../models/sales_management/sm_main_booking.model';

export interface BookingCommissionAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  bookingId: string;
  commissionId: string;
  status: string;
  dealValue: number;
  commissionRate: number;
  grossCommission: number;
  deductions: number;
  netCommission: number;
  paidDate?: Date | null;
  txnId?: string | null;
  agentName: string;
  agentRole?: string | null;
  agentAvatar?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  booking?: Booking;
}

export interface BookingCommissionCreationAttributes {
  bookingId: string;
  commissionId: string;
  status?: string; // Has default value
  dealValue?: number; // Has default value
  commissionRate?: number; // Has default value
  grossCommission?: number; // Has default value
  deductions?: number; // Has default value
  netCommission?: number; // Has default value
  paidDate?: Date | null;
  txnId?: string | null;
  agentName: string;
  agentRole?: string | null;
  agentAvatar?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type BookingCommissionUpdateAttributes = Partial<BookingCommissionCreationAttributes>;

// Helper type for including relations
export interface BookingCommissionWithRelations extends BookingCommissionAttributes {
  booking?: Booking;
}
