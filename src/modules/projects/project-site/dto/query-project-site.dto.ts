import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginateDto } from 'src/common/dto/paginate.dto';

export class QueryProjectSiteDto extends PaginateDto {
  @ApiPropertyOptional({
    description: 'Search by site code, name, location, or description',
  })
  @IsOptional()
  @IsString()
  declare search?: string;
}
