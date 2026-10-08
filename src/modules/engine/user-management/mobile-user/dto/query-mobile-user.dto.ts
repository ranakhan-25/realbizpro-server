import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginateDto } from '@/common/dto/paginate.dto';

export class QueryMobileUserDto extends PaginateDto {
  @ApiPropertyOptional({
    description:
      'Search by username, email, employee code, or phone',
  })
  @IsOptional()
  declare search?: string;
}
