import { PartialType } from '@nestjs/swagger';
import { CreateAssetRfqDto } from './create-asset-rfq.dto';
export class UpdateAssetRfqDto extends PartialType(CreateAssetRfqDto) {}
