// Auto-generated types for BookingDocument
// Source: src/database/models/sales_management/sm_booking_document.model.ts

import type { MainBooking as Booking } from '../models/sales_management/sm_main_booking.model';

export interface BookingDocumentAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  bookingId: string;
  category: string;
  fileName: string;
  fileUrl: string;
  fileSize?: string | null;
  fileType?: string | null;
  uploadedDate: Date;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  booking?: Booking;
}

export interface BookingDocumentCreationAttributes {
  bookingId: string;
  category: string;
  fileName: string;
  fileUrl: string;
  fileSize?: string | null;
  fileType?: string | null;
  uploadedDate: Date;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type BookingDocumentUpdateAttributes = Partial<BookingDocumentCreationAttributes>;

// Helper type for including relations
export interface BookingDocumentWithRelations extends BookingDocumentAttributes {
  booking?: Booking;
}
