import { PartialType } from '@nestjs/swagger';
import { CreateSysOfficeTypeDto } from './create-hrm_office_type.dto';

export class UpdateSysOfficeTypeDto extends PartialType(
  CreateSysOfficeTypeDto,
) {}
