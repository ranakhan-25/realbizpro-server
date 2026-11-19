// Auto-generated types for MainBooking
// Source: src/database/models/sales_management/sm_main_booking.model.ts

import { BookingStatus } from '../models/sales_management/sm_main_booking.model';

import type { BookingOverview } from '../models/sales_management/sm_booking_overview.model';
import type { BookingRegistration } from '../models/sales_management/sm_booking_registration.model';
import type { BookingAgreement } from '../models/sales_management/sm_booking_agreement.model';
import type { BookingCancellation } from '../models/sales_management/sm_booking_cancellation.model';
import type { BookingHandover } from '../models/sales_management/sm_booking_handover.model';
import type { BookingTransfer } from '../models/sales_management/sm_booking_transfer.model';
import type { BookingDocument } from '../models/sales_management/sm_booking_document.model';
import type { BookingInstallment } from '../models/sales_management/sm_booking_installment.model';
import type { BookingCommission } from '../models/sales_management/sm_booking_commission.model';

export interface MainBookingAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  bookingCode: string;
  status: BookingStatus;
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;

  // Relations
  overview?: BookingOverview;
  registration?: BookingRegistration;
  agreement?: BookingAgreement;
  cancellation?: BookingCancellation;
  handover?: BookingHandover;
  transfer?: BookingTransfer;
  documents?: BookingDocument[];
  installments?: BookingInstallment[];
  commissions?: BookingCommission[];
}

export interface MainBookingCreationAttributes {
  bookingCode: string;
  status?: BookingStatus; // Has default value
  addedBy?: string | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type MainBookingUpdateAttributes = Partial<MainBookingCreationAttributes>;

// Helper type for including relations
export interface MainBookingWithRelations extends MainBookingAttributes {
  overview?: BookingOverview;
  registration?: BookingRegistration;
  agreement?: BookingAgreement;
  cancellation?: BookingCancellation;
  handover?: BookingHandover;
  transfer?: BookingTransfer;
  documents?: BookingDocument[];
  installments?: BookingInstallment[];
  commissions?: BookingCommission[];
}
