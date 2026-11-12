import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryInstallmentDto {
  @ApiPropertyOptional({ description: 'Search by buyer name or plan code' })
  @IsOptional()
  @IsString()
  search?: string;
}