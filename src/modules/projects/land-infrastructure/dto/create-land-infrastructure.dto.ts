import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { LandInfrastructureKind } from 'src/database/models/projects/land-infrastructure/pr_land_infrastructure.model';

export class CreateLandInfrastructureDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  projectId: string;

  @ApiProperty({ enum: LandInfrastructureKind })
  @IsEnum(LandInfrastructureKind)
  kind: LandInfrastructureKind;

  @ApiProperty({ example: 'Road 3/A or Block B' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ example: '30 ft' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  size?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  details?: string;
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
}
