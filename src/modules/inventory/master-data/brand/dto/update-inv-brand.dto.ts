import { PartialType } from '@nestjs/swagger';
import { CreateInvBrandDto } from './create-inv-brand.dto';

export class UpdateInvBrandDto extends PartialType(CreateInvBrandDto) {}
