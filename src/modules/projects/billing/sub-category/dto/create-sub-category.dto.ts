import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsString,
  MaxLength,
} from 'class-validator';
import { SubCategoryType } from 'src/database/models/projects/billing/pr_sub_category.model';

export class CreateSubCategoryDto {
  @IsEnum(SubCategoryType)
  @IsNotEmpty()
  type: SubCategoryType;

  @Transform(({ value }) =>
    value === '' ? undefined : value,
  )
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  code: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsString()
  @IsOptional()
  updatedBy?: string;
}
