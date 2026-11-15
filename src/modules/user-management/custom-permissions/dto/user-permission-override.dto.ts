import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export enum PermissionOverrideEffect {
  DENY = 'DENY',
  ALLOW = 'ALLOW',
  INHERIT = 'INHERIT',
}

export class SetUserCustomPermissionOverrideDto {
  @ApiProperty({ description: 'ID of the custom permission' })
  @IsNotEmpty()
  customPermissionId: number | string;

  @ApiProperty({ enum: ['DENY', 'ALLOW'], default: 'DENY', description: 'Effect of the override' })
  @IsEnum(['DENY', 'ALLOW'])
  effect: 'DENY' | 'ALLOW';

  @ApiPropertyOptional({ description: 'Reason for this override restriction or grant' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class BulkUserCustomPermissionOverrideItemDto {
  @ApiProperty({ description: 'ID of the custom permission' })
  @IsNotEmpty()
  customPermissionId: number | string;

  @ApiProperty({ enum: PermissionOverrideEffect, description: 'Effect or INHERIT to clear override' })
  @IsEnum(PermissionOverrideEffect)
  effect: PermissionOverrideEffect;

  @ApiPropertyOptional({ description: 'Reason for this override' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class BulkSetUserCustomPermissionOverridesDto {
  @ApiProperty({ type: [BulkUserCustomPermissionOverrideItemDto] })
  @IsNotEmpty()
  overrides: BulkUserCustomPermissionOverrideItemDto[];
}
