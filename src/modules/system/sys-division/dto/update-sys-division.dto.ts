import { PartialType } from '@nestjs/swagger';
import { CreateSysDivisionDto } from './create-sys-division.dto';

export class UpdateSysDivisionDto extends PartialType(
  CreateSysDivisionDto,
) {}
