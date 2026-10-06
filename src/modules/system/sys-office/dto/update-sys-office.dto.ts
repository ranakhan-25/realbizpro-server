import { PartialType } from '@nestjs/swagger';
import { CreateSysOfficeDto } from './create-sys-office.dto';

export class UpdateSysOfficeDto extends PartialType(
  CreateSysOfficeDto,
) {}
