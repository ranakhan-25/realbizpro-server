// Auto-generated types for BookingTransfer
// Source: src/database/models/sales_management/sm_booking_transfer.model.ts

import type { MainBooking as Booking } from '../models/sales_management/sm_main_booking.model';

export interface BookingTransferAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  bookingId: string;
  transferId: string;
  status: string;
  transferDate: Date;
  reason: string;
  propertyName: string;
  propertyCode?: string | null;
  propertyImage?: string | null;
  propertyLocation?: string | null;
  fromBuyerName: string;
  fromBuyerNid?: string | null;
  toBuyerName: string;
  toBuyerNid?: string | null;
  toBuyerPhone?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  booking?: Booking;
}

export interface BookingTransferCreationAttributes {
  bookingId: string;
  transferId: string;
  status?: string; // Has default value
  transferDate: Date;
  reason: string;
  propertyName: string;
  propertyCode?: string | null;
  propertyImage?: string | null;
  propertyLocation?: string | null;
  fromBuyerName: string;
  fromBuyerNid?: string | null;
  toBuyerName: string;
  toBuyerNid?: string | null;
  toBuyerPhone?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type BookingTransferUpdateAttributes = Partial<BookingTransferCreationAttributes>;

// Helper type for including relations
export interface BookingTransferWithRelations extends BookingTransferAttributes {
  booking?: Booking;
}
