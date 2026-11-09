/* eslint-disable prettier/prettier */

import { 
  IsString, 
  IsUUID, 
  IsEnum, 
  IsOptional, 
  IsNumber,
  Min
} from 'class-validator';
import { Type } from 'class-transformer';
import { ControlType } from 'src/database/models/projects/project_control/pr_project_control_model';
import { ApiPropertyOptional } from "@nestjs/swagger";

export class CreateProjectControlDto {
  @IsUUID()
  projectUuid: string;

  @IsString()
  controlCode: string;

  @IsEnum(ControlType)
  controlType: ControlType;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  thresholdTarget: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  actualValue: number;

  @IsString()
  @IsOptional()
  actionStep?: string;

  @IsString()
  @IsOptional()
  addedBy?: string;

  @IsString()
  @IsOptional()
  addedById?: string;
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
    @ApiPropertyOptional({ description: 'Project UUID or ID' })
    @IsOptional()
    @IsString()
    projectId?: string;
}