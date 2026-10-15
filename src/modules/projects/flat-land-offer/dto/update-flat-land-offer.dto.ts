import { PartialType } from '@nestjs/swagger';
import { CreateFlatLandOfferDto } from './create-flat-land-offer.dto';

export class UpdateFlatLandOfferDto extends PartialType(
  CreateFlatLandOfferDto,
) {}
