import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PasswordStrengthPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value !== 'string')
      throw new BadRequestException(
        'Password must be string',
      );
    const strong =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strong.test(value)) {
      throw new BadRequestException(
        'Password too weak. Must contain uppercase, lowercase, number, special char, min 8 chars',
      );
    }
    return value;
  }
}
