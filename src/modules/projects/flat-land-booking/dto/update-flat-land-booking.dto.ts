import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateFlatLandBookingDto } from './create-flat-land-booking.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateFlatLandBookingDto extends PartialType(
  CreateFlatLandBookingDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
