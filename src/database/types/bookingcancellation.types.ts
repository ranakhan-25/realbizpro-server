// Auto-generated types for BookingCancellation
// Source: src/database/models/sales_management/sm_booking_cancellation.model.ts

import type { MainBooking as Booking } from '../models/sales_management/sm_main_booking.model';

export interface BookingCancellationAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  bookingId: string;
  cancellationId: string;
  status: string;
  cancellationDate: Date;
  processedBy?: string | null;
  reason: string;
  notes?: string | null;
  totalPaid: number;
  cancellationFee: number;
  refundAmount: number;
  refundMethod?: string | null;
  refundTxnId?: string | null;
  refundDate?: Date | null;
  refundStatus?: string | null;
  propertyName: string;
  propertyCode?: string | null;
  propertyType?: string | null;
  propertyArea?: string | null;
  propertyImage?: string | null;
  propertyLocation?: string | null;
  buyerName: string;
  buyerEmail?: string | null;
  buyerPhone?: string | null;
  buyerAvatar?: string | null;
  buyerNid?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  booking?: Booking;
}

export interface BookingCancellationCreationAttributes {
  bookingId: string;
  cancellationId: string;
  status?: string; // Has default value
  cancellationDate: Date;
  processedBy?: string | null;
  reason: string;
  notes?: string | null;
  totalPaid?: number; // Has default value
  cancellationFee?: number; // Has default value
  refundAmount?: number; // Has default value
  refundMethod?: string | null;
  refundTxnId?: string | null;
  refundDate?: Date | null;
  refundStatus?: string | null;
  propertyName: string;
  propertyCode?: string | null;
  propertyType?: string | null;
  propertyArea?: string | null;
  propertyImage?: string | null;
  propertyLocation?: string | null;
  buyerName: string;
  buyerEmail?: string | null;
  buyerPhone?: string | null;
  buyerAvatar?: string | null;
  buyerNid?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type BookingCancellationUpdateAttributes = Partial<BookingCancellationCreationAttributes>;

// Helper type for including relations
export interface BookingCancellationWithRelations extends BookingCancellationAttributes {
  booking?: Booking;
}
