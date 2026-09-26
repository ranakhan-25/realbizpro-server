import { DateTime } from 'luxon';

const DEFAULT_ZONE = 'Asia/Dhaka';

export function getDateBoundary(
  date: string,
  isEnd = false,
  zone: string = process.env.DATABASE_TIMEZONE ||
    DEFAULT_ZONE,
): Date {
  return DateTime.fromISO(date, { zone })
    .plus(isEnd ? { days: 1 } : {})
    .startOf('day')
    .toJSDate();
}

export class DateHelper {
  /**
   * ISO date (yyyy-MM-dd or ISO string) → JS Date
   * Used for DB insert/update
   */
  static isoToJsDate(
    iso: string,
    zone: string = DEFAULT_ZONE,
  ): Date {
    const dt = DateTime.fromISO(iso, { zone });

    if (!dt.isValid) {
      throw new Error(`Invalid ISO date: ${iso}`);
    }

    return dt.toJSDate();
  }

  /**
   * STRING (custom format) → JS Date
   * Example formats:
   *  - yyyy-MM-dd
   *  - dd-MM-yyyy
   *  - yyyy/MM/dd
   */
  static stringToJsDate(
    dateStr?: string,
    format: string = 'yyyy-MM-dd',
    zone: string = DEFAULT_ZONE,
  ): Date {
    // Return current date for empty/undefined dates
    if (!dateStr || dateStr.trim() === '') {
      return new Date();
    }

    const dt = DateTime.fromFormat(
      dateStr,
      format,
      { zone },
    );

    if (!dt.isValid) {
      throw new Error(
        `Invalid date string: ${dateStr} (expected format: ${format}). Reason: ${dt.invalidReason}`,
      );
    }

    return dt.toJSDate();
  }

  /**
   * JS Date → ISO date string (yyyy-MM-dd)
   * Used for API responses
   */
  static jsDateToIsoDate(
    date: Date,
    zone: string = DEFAULT_ZONE,
  ): string {
    return DateTime.fromJSDate(date, {
      zone,
    }).toFormat('yyyy-MM-dd');
  }

  /**
   * Now → JS Date (Asia/Dhaka)
   */
  static now(zone: string = DEFAULT_ZONE): Date {
    return DateTime.now()
      .setZone(zone)
      .toJSDate();
  }

  /**
   * Custom date function for sale extended dates.
   * Currently returns the current date.
   */
  static saleExtendedDate(
    zone: string = DEFAULT_ZONE,
  ): Date {
    return DateHelper.now(zone);
  }

  static todayIsoDate(
    zone: string = DEFAULT_ZONE,
  ): string {
    return DateTime.now()
      .setZone(zone)
      .toFormat('yyyy-MM-dd');
  }

  static normalizeIsoDate(
    iso?: string,
    zone: string = DEFAULT_ZONE,
  ): string | undefined {
    if (!iso || iso.trim() === '') {
      return undefined;
    }

    const value = iso.trim();
    const dt = DateTime.fromISO(value, { zone });

    if (!dt.isValid) {
      return value;
    }

    return dt.toFormat('yyyy-MM-dd');
  }

  static capIsoDateAtToday(
    iso?: string,
    zone: string = DEFAULT_ZONE,
  ): string {
    const today = DateHelper.todayIsoDate(zone);
    const normalized =
      DateHelper.normalizeIsoDate(iso, zone);

    if (!normalized || normalized > today) {
      return today;
    }

    return normalized;
  }

  /**
   * ISO → formatted string (dd-MM-yyyy)
   */
  static format(
    iso: string,
    format = 'dd-MM-yyyy',
    zone: string = DEFAULT_ZONE,
  ): string {
    const dt = DateTime.fromISO(iso, { zone });

    if (!dt.isValid) {
      throw new Error(`Invalid ISO date: ${iso}`);
    }

    return dt.toFormat(format);
  }

  static normalizeAsOfDate(
    asOfDate?: string,
  ): Date | undefined {
    if (!asOfDate) return undefined;
    if (asOfDate.includes('T')) {
      return new Date(asOfDate);
    }

    // If only a date is provided, include the full day.
    return new Date(`${asOfDate}T23:59:59.999Z`);
  }

  /**
   * Normalize end date to end of day (23:59:59.999)
   * If dateStr is provided, parse it and set to end of day
   * If not provided, use current date and set to end of day
   */
  static normalizeEndDate(
    dateStr?: string,
    zone: string = DEFAULT_ZONE,
  ): Date {
    let date: Date;

    if (dateStr) {
      // If it's an ISO string, use isoToJsDate
      if (
        dateStr.includes('T') ||
        dateStr.includes('Z')
      ) {
        date = DateHelper.isoToJsDate(
          dateStr,
          zone,
        );
      } else {
        // Assume it's a date string like yyyy-MM-dd
        date = DateHelper.stringToJsDate(
          dateStr,
          'yyyy-MM-dd',
          zone,
        );
      }
    } else {
      // Use current date
      date = DateHelper.now(zone);
    }

    // Set to end of day
    date.setHours(23, 59, 59, 999);
    return date;
  }

  /**
   * Normalize start date
   * If dateStr is provided, parse it
   * If not provided, use the beginning of time (new Date(0))
   */
  static normalizeStartDate(
    dateStr?: string,
    zone: string = DEFAULT_ZONE,
  ): Date {
    if (dateStr) {
      // If it's an ISO string, use isoToJsDate
      if (
        dateStr.includes('T') ||
        dateStr.includes('Z')
      ) {
        return DateHelper.isoToJsDate(
          dateStr,
          zone,
        );
      } else {
        // Assume it's a date string like yyyy-MM-dd
        return DateHelper.stringToJsDate(
          dateStr,
          'yyyy-MM-dd',
          zone,
        );
      }
    } else {
      // Use beginning of time
      return new Date(0);
    }
  }
}
