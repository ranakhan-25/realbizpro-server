import { PartialType } from '@nestjs/swagger';
import { CreateRegistrationTrackingDto } from './create-registration-tracking.dto';

export class UpdateRegistrationTrackingDto extends PartialType(CreateRegistrationTrackingDto) {}
