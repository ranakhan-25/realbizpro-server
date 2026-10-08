import { Transform } from 'class-transformer';

export const ToNumberArray = () =>
  Transform(({ value }) => {
    if (
      value === undefined ||
      value === null ||
      value === ''
    ) {
      return undefined;
    }

    // array => number[]
    if (Array.isArray(value)) {
      return value
        .map((v) => Number(v))
        .filter((v) => !Number.isNaN(v));
    }

    // string => support "1" and "1,2,3"
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((v) => Number(v.trim()))
        .filter((v) => !Number.isNaN(v));
    }

    // number => [number]
    if (typeof value === 'number') {
      return [value];
    }

    return undefined;
  });
