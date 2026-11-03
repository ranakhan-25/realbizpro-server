import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class FeatureOverrideItemDto {
  @ApiProperty({ example: 10 })
  @IsInt()
  featureId: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isGranted?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  canView?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  canCreate?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  canEdit?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  canDelete?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  canApprove?: boolean;
}

export class UpdateUserFeatureAccessDto {
  @ApiProperty({ example: [1, 2, 3], required: false })
  @IsOptional()
  @IsArray()
  moduleIds?: number[];

  @ApiProperty({ type: [FeatureOverrideItemDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureOverrideItemDto)
  featureOverrides?: FeatureOverrideItemDto[];
}
