import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { ModuleFeatureSelectionDto } from './create-organization-wizard.dto';

export class UpdateEntitlementsDto {
  @ApiProperty({
    type: [ModuleFeatureSelectionDto],
    description: 'Updated tree of modules and features assigned to this organization',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleFeatureSelectionDto)
  moduleFeatureAccess: ModuleFeatureSelectionDto[];
}
