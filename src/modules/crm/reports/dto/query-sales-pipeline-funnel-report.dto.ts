import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class QuerySalesPipelineFunnelReportDto {
  @ApiPropertyOptional({ description: 'Lead date lower bound (YYYY-MM-DD)', example: '2026-10-01' })
  @IsOptional() @IsDateString() declare dateFrom?: string;

  @ApiPropertyOptional({ description: 'Lead date upper bound (YYYY-MM-DD)', example: '2026-10-28' })
  @IsOptional() @IsDateString() declare dateTo?: string;

  @ApiPropertyOptional({ description: 'User UUID, user code or user name' })
  @IsOptional() @IsString() declare userId?: string;

  @ApiPropertyOptional({ description: 'Team database ID, UUID or team name' })
  @IsOptional() @IsString() declare teamId?: string;

  @ApiPropertyOptional({ description: 'Project UUID, project code or project name' })
  @IsOptional() @IsString() declare projectId?: string;
}
