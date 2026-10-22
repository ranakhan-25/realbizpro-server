import { PartialType } from '@nestjs/swagger';
import { CreateProcurementSubCategoryDto } from './create-sub-category.dto';

export class UpdateProcurementSubCategoryDto extends PartialType(
  CreateProcurementSubCategoryDto,
) {}
