// Auto-generated types for BookingDetails
// Source: src/database/models/sales_management/sm_booking_details_model.ts

import { BookingStatus } from '../models/sales_management/sm_booking_details_model';

export interface BookingDetailsAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  bookingId: string;
  bookingCode: string;
  status: BookingStatus;
  propertyName: string;
  propertyCategory?: string | null;
  propertySize?: string | null;
  propertyFacing?: string | null;
  propertyPlotNo?: string | null;
  visitDate?: Date | null;
  startTime?: string | null;
  endTime?: string | null;
  duration?: string | null;
  area?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  buyerName: string;
  buyerEmail?: string | null;
  buyerPhone?: string | null;
  buyerNid?: string | null;
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus?: string | null;
  paymentMethod?: string | null;
  transactionId?: string | null;
  notes?: string | null;
  agentName?: string | null;
  agentEmail?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export interface BookingDetailsCreationAttributes {
  bookingId: string;
  bookingCode: string;
  status?: BookingStatus; // Has default value
  propertyName: string;
  propertyCategory?: string | null;
  propertySize?: string | null;
  propertyFacing?: string | null;
  propertyPlotNo?: string | null;
  visitDate?: Date | null;
  startTime?: string | null;
  endTime?: string | null;
  duration?: string | null;
  area?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  buyerName: string;
  buyerEmail?: string | null;
  buyerPhone?: string | null;
  buyerNid?: string | null;
  subtotal?: number; // Has default value
  tax?: number; // Has default value
  discount?: number; // Has default value
  totalAmount?: number; // Has default value
  paidAmount?: number; // Has default value
  paymentStatus?: string | null;
  paymentMethod?: string | null;
  transactionId?: string | null;
  notes?: string | null;
  agentName?: string | null;
  agentEmail?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type BookingDetailsUpdateAttributes = Partial<BookingDetailsCreationAttributes>;

// Helper type for including relations
export interface BookingDetailsWithRelations extends BookingDetailsAttributes {
  // No relations defined
}
