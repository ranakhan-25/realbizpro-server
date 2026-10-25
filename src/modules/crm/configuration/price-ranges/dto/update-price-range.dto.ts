import { PartialType } from '@nestjs/swagger';
import { CreatePriceRangeDto } from './create-price-range.dto';

export class UpdatePriceRangeDto extends PartialType(CreatePriceRangeDto) {}
