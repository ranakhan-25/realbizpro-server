import { DateTime } from 'luxon';

/**
 * Get business date time
 * If current time < 5 AM => previous day end time
 * Otherwise => current time
 */
export const getBusinessDateTime = (
  cutoffHour = 5,
  format = 'yyyy-MM-dd HH:mm:ss',
): string => {
  const now = DateTime.local();

  const dateTime =
    now.hour < cutoffHour
      ? now.minus({ days: 1 }).endOf('day')
      : now;

  return dateTime.toFormat(format);
};

// import { getBusinessDateTime } from 'src/common/helpers/date.helper';
// const date = getBusinessDateTime();
// console.log(date);
// // Example:
// // Before 5 AM => 2026-05-24 23:59:59
// // After 5 AM => 2026-05-25 10:30:12

// Change cutoff hour:
// const date = getBusinessDateTime(6);

// Change format:
// const date = getBusinessDateTime(
//   5,
//   'yyyy-MM-dd',
// );
