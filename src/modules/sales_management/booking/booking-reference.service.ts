import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BookingCreate as Booking } from '../../../database/models/sales_management/sm_booking_create_model';
import { MainBooking } from '../../../database/models/sales_management/sm_main_booking.model';
import { Op } from 'sequelize';

/** Resolves the public booking identifier to the UUID used by booking detail tables. */
@Injectable()
export class BookingReferenceService {
  constructor(
    @InjectModel(Booking) private readonly bookingModel: typeof Booking,
    @InjectModel(MainBooking) private readonly mainBookingModel: typeof MainBooking,
  ) {}

  async resolveUuid(identifier: string): Promise<string> {
    const value = identifier.trim();
    // PostgreSQL attempts to cast values compared against a UUID column even
    // when another branch of the OR matches. Public booking IDs are often
    // human-readable, so only include the UUID predicate for valid UUIDs.
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
    const booking = await this.bookingModel.findOne({
      where: isUuid
        ? { [Op.or]: [{ uuid: value }, { bookingId: value }] }
        : { bookingId: value },
      attributes: ['uuid'],
    });

    if (booking) return booking.uuid;

    const mainBooking = await this.mainBookingModel.findOne({
      where: isUuid ? { uuid: value } : { bookingCode: value },
      attributes: ['uuid'],
    });

    if (mainBooking) return mainBooking.uuid;

    throw new NotFoundException(`Booking ${identifier} not found`);
  }
}
