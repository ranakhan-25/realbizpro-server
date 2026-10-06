import { PartialType } from '@nestjs/swagger';
import { CreateFeatureDto } from './create.dto';

export class UpdateFeatureDto extends PartialType(
  CreateFeatureDto,
) {}
