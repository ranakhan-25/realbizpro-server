import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateFlatLandOfferDto } from './create-flat-land-offer.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateFlatLandOfferDto extends PartialType(
  CreateFlatLandOfferDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
