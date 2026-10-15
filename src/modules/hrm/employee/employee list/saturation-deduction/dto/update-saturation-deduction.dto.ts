import { PartialType } from '@nestjs/swagger';
import { CreateSaturationDeductionDto } from './create-saturation-deduction.dto';

export class UpdateSaturationDeductionDto extends PartialType(
  CreateSaturationDeductionDto,
) {}
