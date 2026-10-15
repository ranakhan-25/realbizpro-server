import { PartialType } from '@nestjs/swagger';
import { CreateFlatLandBookingDto } from './create-flat-land-booking.dto';

export class UpdateFlatLandBookingDto extends PartialType(
  CreateFlatLandBookingDto,
) {}
