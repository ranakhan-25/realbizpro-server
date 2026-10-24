/* eslint-disable prettier/prettier */

import { IsString, IsUUID, IsEnum, IsOptional, IsNumberString } from 'class-validator';
import { ControlStatus, ControlType } from 'src/database/models/projects/project_control/pr_project_control_model';


export class QueryProjectControlDto {
  @IsUUID()
  @IsOptional()
  projectUuid?: string;

  @IsEnum(ControlType)
  @IsOptional()
  controlType?: ControlType;

  @IsEnum(ControlStatus)
  @IsOptional()
  status?: ControlStatus; // Filter by calculated status

  @IsString()
  @IsOptional()
  search?: string; // Search by controlCode or actionStep

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}