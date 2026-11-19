// Auto-generated types for BookingHandover
// Source: src/database/models/sales_management/sm_booking_handover.model.ts

import type { MainBooking as Booking } from '../models/sales_management/sm_main_booking.model';

export interface BookingHandoverAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  bookingId: string;
  handoverId: string;
  status: string;
  handoverDate: Date;
  handoverTime?: string | null;
  electricityReading?: string | null;
  waterReading?: string | null;
  gasReading?: string | null;
  checklist?: any | null;
  propertyName: string;
  propertyCode?: string | null;
  propertyImage?: string | null;
  propertyLocation?: string | null;
  buyerName: string;
  buyerAvatar?: string | null;
  buyerPhone?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  booking?: Booking;
}

export interface BookingHandoverCreationAttributes {
  bookingId: string;
  handoverId: string;
  status?: string; // Has default value
  handoverDate: Date;
  handoverTime?: string | null;
  electricityReading?: string | null;
  waterReading?: string | null;
  gasReading?: string | null;
  checklist?: any | null;
  propertyName: string;
  propertyCode?: string | null;
  propertyImage?: string | null;
  propertyLocation?: string | null;
  buyerName: string;
  buyerAvatar?: string | null;
  buyerPhone?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type BookingHandoverUpdateAttributes = Partial<BookingHandoverCreationAttributes>;

// Helper type for including relations
export interface BookingHandoverWithRelations extends BookingHandoverAttributes {
  booking?: Booking;
}
