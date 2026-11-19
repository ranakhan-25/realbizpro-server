// Auto-generated types for BookingInstallment
// Source: src/database/models/sales_management/sm_booking_installment.model.ts

import type { MainBooking as Booking } from '../models/sales_management/sm_main_booking.model';

export interface BookingInstallmentAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  bookingId: string;
  title: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date | null;
  status: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  booking?: Booking;
}

export interface BookingInstallmentCreationAttributes {
  bookingId: string;
  title: string;
  amount?: number; // Has default value
  dueDate: Date;
  paidDate?: Date | null;
  status?: string; // Has default value
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type BookingInstallmentUpdateAttributes = Partial<BookingInstallmentCreationAttributes>;

// Helper type for including relations
export interface BookingInstallmentWithRelations extends BookingInstallmentAttributes {
  booking?: Booking;
}
