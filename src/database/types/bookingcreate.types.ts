// Auto-generated types for BookingCreate
// Source: src/database/models/sales_management/sm_booking_create_model.ts

import { BookingStatus } from '../models/sales_management/sm_booking_create_model';

export interface BookingCreateAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  bookingId: string;
  status: BookingStatus;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerNid?: string | null;
  propertyId: string;
  propertyName: string;
  propertyPrice: number;
  visitDate: Date;
  startTime: string;
  endTime: string;
  agentId?: string | null;
  agentName?: string | null;
  area?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  selectedAddons?: { id: string; name: string; price: number }[] | null;
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  notes?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export interface BookingCreateCreationAttributes {
  bookingId: string;
  status?: BookingStatus; // Has default value
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerNid?: string | null;
  propertyId: string;
  propertyName: string;
  propertyPrice: number;
  visitDate: Date;
  startTime: string;
  endTime: string;
  agentId?: string | null;
  agentName?: string | null;
  area?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  selectedAddons?: { id: string; name: string; price: number }[] | null;
  subtotal?: number; // Has default value
  tax?: number; // Has default value
  discount?: number; // Has default value
  totalAmount?: number; // Has default value
  paymentMethod: string;
  notes?: string | null;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type BookingCreateUpdateAttributes = Partial<BookingCreateCreationAttributes>;

// Helper type for including relations
export interface BookingCreateWithRelations extends BookingCreateAttributes {
  // No relations defined
}
