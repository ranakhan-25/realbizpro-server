// Auto-generated types for BookingAgreement
// Source: src/database/models/sales_management/sm_booking_agreement.model.ts

import type { MainBooking as Booking } from '../models/sales_management/sm_main_booking.model';

export interface BookingAgreementAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  bookingId: string;
  agreementDate?: Date | null;
  signedByBuyer: boolean;
  signedBySeller: boolean;
  documentUrl?: string | null;
  notes?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  booking?: Booking;
}

export interface BookingAgreementCreationAttributes {
  bookingId: string;
  agreementDate?: Date | null;
  signedByBuyer?: boolean; // Has default value
  signedBySeller?: boolean; // Has default value
  documentUrl?: string | null;
  notes?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type BookingAgreementUpdateAttributes = Partial<BookingAgreementCreationAttributes>;

// Helper type for including relations
export interface BookingAgreementWithRelations extends BookingAgreementAttributes {
  booking?: Booking;
}
