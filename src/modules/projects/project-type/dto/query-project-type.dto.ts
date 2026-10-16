import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginateDto } from 'src/common/dto/paginate.dto';

export class QueryProjectTypeDto extends PaginateDto {
  @ApiPropertyOptional({
    description: 'Search by project type code or name',
  })
  @IsOptional()
  @IsString()
  declare search?: string;
}
