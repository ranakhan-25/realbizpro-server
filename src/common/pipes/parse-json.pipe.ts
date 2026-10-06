import {
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

type JsonType = 'any' | 'object' | 'array';

@Injectable()
export class ParseJsonStrictPipe implements PipeTransform {
  constructor(
    private readonly expectedType: JsonType = 'any',
  ) {}

  transform(value: any) {
    if (
      value === undefined ||
      value === null ||
      value === ''
    ) {
      return null;
    }

    let parsed: any = value;

    // Try to parse string
    if (typeof value === 'string') {
      try {
        parsed = JSON.parse(value);
      } catch {
        throw new BadRequestException(
          'Invalid JSON string',
        );
      }
    }

    // Type enforcement
    if (
      this.expectedType === 'array' &&
      !Array.isArray(parsed)
    ) {
      throw new BadRequestException(
        'Validation failed (array expected)',
      );
    }
    if (
      this.expectedType === 'object' &&
      (typeof parsed !== 'object' ||
        Array.isArray(parsed))
    ) {
      throw new BadRequestException(
        'Validation failed (object expected)',
      );
    }

    return parsed;
  }
}
