import { PartialType } from '@nestjs/swagger';
import { CreateMutationTrackingDto } from './create-mutation-tracking.dto';

export class UpdateMutationTrackingDto extends PartialType(CreateMutationTrackingDto) {}
