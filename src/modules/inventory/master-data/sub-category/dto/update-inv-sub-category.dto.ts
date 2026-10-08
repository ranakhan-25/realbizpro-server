import { PartialType } from '@nestjs/swagger';
import { CreateInvSubCategoryDto } from './create-inv-sub-category.dto';

export class UpdateInvSubCategoryDto extends PartialType(CreateInvSubCategoryDto) {}
