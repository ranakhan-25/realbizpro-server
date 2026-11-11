import { PaginateDto } from 'src/common/dto/paginate.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class QueryFlatLandBookingDto extends PaginateDto {
  @ApiPropertyOptional({ example: '2026-10-01' }) @IsOptional() @IsDateString() dateFrom?: string;
  @ApiPropertyOptional({ example: '2026-10-31' }) @IsOptional() @IsDateString() dateTo?: string;
  @ApiPropertyOptional({ format: 'uuid' }) @IsOptional() @IsUUID() projectId?: string;
  @ApiPropertyOptional({ description: 'Sales person name or user code' }) @IsOptional() @IsString() salesBy?: string;
  @ApiPropertyOptional({ format: 'uuid', description: 'Filter through the selected project team member' }) @IsOptional() @IsUUID() teamId?: string;
    @ApiPropertyOptional({ description: 'Filter by organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
}
