// Auto-generated types for Cancellation
// Source: src/database/models/sales_management/sm_cencellationview.model.ts

import { CancellationReason } from '../models/sales_management/sm_cencellationview.model';
import { CancellationStatus } from '../models/sales_management/sm_cencellationview.model';

import type { BookingCreate as Booking } from '../models/sales_management/sm_booking_create_model';

export interface CancellationAttributes {
  id: string;
  cancellationCode: string;
  bookingId: number;
  reason: CancellationReason;
  cancellationDate: string;
  refundAmount: number;
  penaltyFee: number;
  paidAmount: number;
  notes: string | null;
  isAcknowledged: boolean;
  status: CancellationStatus;
  processedBy: string | null;
  processedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Relations
  booking?: Booking;
}

export interface CancellationCreationAttributes {
  id?: string; // Auto increment
  cancellationCode: string;
  bookingId: number;
  reason: CancellationReason;
  cancellationDate: string;
  refundAmount: number;
  penaltyFee: number;
  paidAmount: number;
  notes?: string | null; // Nullable
  isAcknowledged: boolean;
  status: CancellationStatus;
  processedBy?: string | null; // Nullable
  processedAt?: Date | null; // Nullable
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type CancellationUpdateAttributes = Partial<CancellationCreationAttributes>;

// Helper type for including relations
export interface CancellationWithRelations extends CancellationAttributes {
  booking?: Booking;
}
