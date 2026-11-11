import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginateDto } from 'src/common/dto/paginate.dto';

export class QueryMaterialRequisitionDto extends PaginateDto {
  @ApiPropertyOptional({ example: 'bricks' })
  @IsOptional()
  @IsString()
  declare search?: string;
    @ApiPropertyOptional({ description: 'Filter by organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
    @ApiPropertyOptional({ description: 'Filter by project ID' })
    @IsOptional()
    @IsString()
    projectId?: string;
}
