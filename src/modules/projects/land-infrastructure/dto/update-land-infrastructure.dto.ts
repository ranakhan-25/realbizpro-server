import { PartialType } from '@nestjs/swagger';
import { CreateLandInfrastructureDto } from './create-land-infrastructure.dto';

export class UpdateLandInfrastructureDto extends PartialType(
  CreateLandInfrastructureDto,
) {}
