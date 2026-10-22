import { PartialType } from '@nestjs/swagger';
import { CreateProcurementUnitDto } from './create-unit.dto';

export class UpdateProcurementUnitDto extends PartialType(
  CreateProcurementUnitDto,
) {}
