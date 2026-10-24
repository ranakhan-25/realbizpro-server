/* eslint-disable prettier/prettier */
import { IsString, IsUUID, IsEnum, IsOptional, IsNumberString } from 'class-validator';
import { MilestoneStatus } from 'src/database/models/projects/project_milestone/pr_project_milestone_model'; // ✅ সঠিক পাথ

export class QueryProjectMilestoneDto {
  @IsUUID()
  @IsOptional()
  projectUuid?: string;

  @IsEnum(MilestoneStatus)
  @IsOptional()
  status?: MilestoneStatus;

  @IsString()
  @IsOptional()
  search?: string;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}