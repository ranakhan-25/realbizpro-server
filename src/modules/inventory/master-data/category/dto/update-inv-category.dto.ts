import { PartialType } from '@nestjs/swagger';
import { CreateInvCategoryDto } from './create-inv-category.dto';

export class UpdateInvCategoryDto extends PartialType(CreateInvCategoryDto) {}
