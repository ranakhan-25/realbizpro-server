import { PartialType } from '@nestjs/swagger';
import { CreateVisitPlaceDto } from './create-visit-place.dto';

export class UpdateVisitPlaceDto extends PartialType(CreateVisitPlaceDto) {}
