import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class EnumValidationPipe implements PipeTransform {
  constructor(
    private readonly enumType: object,
  ) {}

  transform(value: any) {
    const values = Object.values(this.enumType);
    if (!values.includes(value)) {
      throw new BadRequestException(
        `Invalid value. Allowed: ${values.join(', ')}`,
      );
    }
    return value;
  }
}
