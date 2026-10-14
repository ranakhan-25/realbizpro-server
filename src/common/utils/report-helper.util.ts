import { DateTime } from 'luxon';
import { Transform } from 'class-transformer';

export function toRecord(
  value: unknown,
): Record<string, unknown> {
  if (value && typeof value === 'object') {
    return value as Record<string, unknown>;
  }

  return {};
}

export function cleanProduct(
  product: unknown,
): Record<string, unknown> {
  const safeProduct = toRecord(product);
  const { _pdMap, ...cleanProd } = safeProduct;
  return cleanProd;
}

export function cleanCategory(
  category: unknown,
): Record<string, unknown> {
  const safeCategory = toRecord(category);
  const { _productMap, ...cleanCat } =
    safeCategory;

  const products = Array.isArray(cleanCat.product)
    ? cleanCat.product
    : [];

  cleanCat.product = products.map((product) =>
    cleanProduct(product),
  );

  return cleanCat;
}

// --------------------------------------------------------------
// Helper: Convert date string to end-of-day Date (UTC)
// --------------------------------------------------------------
export const EndOfDayDate = () =>
  Transform(({ value }) => {
    if (
      value === undefined ||
      value === null ||
      value === ''
    ) {
      return undefined;
    }

    let dt: DateTime;
    if (typeof value === 'string') {
      dt = DateTime.fromISO(value, {
        zone: 'utc',
      });
    } else if (value instanceof Date) {
      dt = DateTime.fromJSDate(value, {
        zone: 'utc',
      });
    } else {
      return value; // fallback
    }

    if (!dt.isValid) {
      return value;
    }

    // Set to end of day (23:59:59.999) and return as JS Date
    return dt.endOf('day').toJSDate();
  });

// --------------------------------------------------------------
// Helper: Convert date string to start-of-day Date (UTC)
// --------------------------------------------------------------

export const StartOfDayDate = () =>
  Transform(({ value }) => {
    if (
      value === undefined ||
      value === null ||
      value === ''
    ) {
      return undefined;
    }

    let dt: DateTime;
    if (typeof value === 'string') {
      dt = DateTime.fromISO(value, {
        zone: 'utc',
      });
    } else if (value instanceof Date) {
      dt = DateTime.fromJSDate(value, {
        zone: 'utc',
      });
    } else {
      return value; // fallback
    }

    if (!dt.isValid) {
      return value;
    }

    // Set to end of day (00:00:00.00) and return as JS Date
    return dt.startOf('day').toJSDate();
  });
