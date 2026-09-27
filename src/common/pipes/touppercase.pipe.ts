import {
  PipeTransform,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class ToUpperCasePipe implements PipeTransform {
  transform(value: any) {
    return typeof value === 'string'
      ? value.toUpperCase()
      : value;
  }
}
