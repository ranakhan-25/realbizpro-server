import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateInvSubCategoryDto {
  @ApiProperty({ description: 'The parent category ID (UUID)', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  category_id: string;

  @ApiProperty({ description: 'The unique code for the sub-category', example: 'SCAT-001' })
  @IsString()
  @IsNotEmpty()
  sub_category_code: string;

  @ApiProperty({ description: 'The display name of the sub-category', example: 'Cement' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
