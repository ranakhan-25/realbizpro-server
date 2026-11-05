import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { ModuleFeatureSelectionDto } from './create-organization-wizard.dto';
import { FeatureOverrideItemDto } from '../../../user-management/users/dto/user-feature-access.dto';

export class UpdateEntitlementsDto {
  @ApiProperty({
    type: [ModuleFeatureSelectionDto],
    description: 'Updated tree of modules and features assigned to this organization',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleFeatureSelectionDto)
  moduleFeatureAccess: ModuleFeatureSelectionDto[];

  @ApiPropertyOptional({
    type: [FeatureOverrideItemDto],
    description: 'Optional granular feature overrides (canView, canCreate, canEdit, canDelete) for organization admin users',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureOverrideItemDto)
  featureOverrides?: FeatureOverrideItemDto[];
}
