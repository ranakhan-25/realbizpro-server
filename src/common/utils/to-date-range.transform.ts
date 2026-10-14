import { Transform } from 'class-transformer';
import { DateTime } from 'luxon';

export function ToDateRange() {
  return Transform(({ value }) => {
    if (!value || typeof value !== 'string') {
      return undefined;
    }

    const [from, to] = value
      .split(' - ')
      .map((d) => d.trim());

    if (!from || !to) {
      return undefined;
    }

    const start = DateTime.fromISO(from);
    const end = DateTime.fromISO(to);

    if (!start.isValid || !end.isValid) {
      return undefined;
    }

    return [
      start.toFormat('yyyy-MM-dd'),
      end.toFormat('yyyy-MM-dd'),
    ];
  });
}
