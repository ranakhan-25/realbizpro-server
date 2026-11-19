// Auto-generated types for BookingRegistration
// Source: src/database/models/sales_management/sm_booking_registration.model.ts

import type { MainBooking as Booking } from '../models/sales_management/sm_main_booking.model';

export interface BookingRegistrationAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  bookingId: string;
  registrationId: string;
  status: string;
  deedNo: string;
  registrationDate: Date;
  subRegistry: string;
  propertyValue: number;
  stampDuty: number;
  registrationFee: number;
  totalPaid: number;
  mutationStatus?: string | null;
  mutationKhatiyanNo?: string | null;
  mutationUpdatedDate?: Date | null;
  propertyName: string;
  propertyCode?: string | null;
  propertyType?: string | null;
  propertyArea?: string | null;
  propertyImage?: string | null;
  propertyLocation?: string | null;
  buyerName: string;
  buyerNid?: string | null;
  sellerName: string;
  sellerRep?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  booking?: Booking;
}

export interface BookingRegistrationCreationAttributes {
  bookingId: string;
  registrationId: string;
  status?: string; // Has default value
  deedNo: string;
  registrationDate: Date;
  subRegistry: string;
  propertyValue?: number; // Has default value
  stampDuty?: number; // Has default value
  registrationFee?: number; // Has default value
  totalPaid?: number; // Has default value
  mutationStatus?: string | null;
  mutationKhatiyanNo?: string | null;
  mutationUpdatedDate?: Date | null;
  propertyName: string;
  propertyCode?: string | null;
  propertyType?: string | null;
  propertyArea?: string | null;
  propertyImage?: string | null;
  propertyLocation?: string | null;
  buyerName: string;
  buyerNid?: string | null;
  sellerName: string;
  sellerRep?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type BookingRegistrationUpdateAttributes = Partial<BookingRegistrationCreationAttributes>;

// Helper type for including relations
export interface BookingRegistrationWithRelations extends BookingRegistrationAttributes {
  booking?: Booking;
}
