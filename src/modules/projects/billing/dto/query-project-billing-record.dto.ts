import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginateDto } from 'src/common/dto/paginate.dto';

export class QueryProjectBillingRecordDto extends PartialType(PaginateDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  resource?: string;
    @ApiPropertyOptional({ description: 'Filter by organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
    @ApiPropertyOptional({ description: 'Filter by project ID' })
    @IsOptional()
    @IsString()
    projectId?: string;
}
