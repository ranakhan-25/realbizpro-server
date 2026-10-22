import { PartialType } from '@nestjs/swagger';
import { CreateProcurementBrandDto } from './create-brand.dto';

export class UpdateProcurementBrandDto extends PartialType(
  CreateProcurementBrandDto,
) {}
