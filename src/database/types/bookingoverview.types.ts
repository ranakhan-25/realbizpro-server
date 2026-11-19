// Auto-generated types for BookingOverview
// Source: src/database/models/sales_management/sm_booking_overview.model.ts

import type { MainBooking as Booking } from '../models/sales_management/sm_main_booking.model';

export interface BookingOverviewAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  bookingId: string;
  propertyName: string;
  propertyCode?: string | null;
  propertyType?: string | null;
  propertyArea?: string | null;
  propertyPrice: number;
  propertyLocation?: string | null;
  propertyImage?: string | null;
  buyerName: string;
  buyerEmail?: string | null;
  buyerPhone?: string | null;
  buyerAvatar?: string | null;
  buyerNid?: string | null;
  totalPrice: number;
  amountPaid: number;
  remainingDue: number;
  nextDueDate?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  booking?: Booking;
}

export interface BookingOverviewCreationAttributes {
  bookingId: string;
  propertyName: string;
  propertyCode?: string | null;
  propertyType?: string | null;
  propertyArea?: string | null;
  propertyPrice?: number; // Has default value
  propertyLocation?: string | null;
  propertyImage?: string | null;
  buyerName: string;
  buyerEmail?: string | null;
  buyerPhone?: string | null;
  buyerAvatar?: string | null;
  buyerNid?: string | null;
  totalPrice?: number; // Has default value
  amountPaid?: number; // Has default value
  remainingDue?: number; // Has default value
  nextDueDate?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type BookingOverviewUpdateAttributes = Partial<BookingOverviewCreationAttributes>;

// Helper type for including relations
export interface BookingOverviewWithRelations extends BookingOverviewAttributes {
  booking?: Booking;
}
