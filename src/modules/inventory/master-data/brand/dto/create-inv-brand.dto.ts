import { ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import { IsString, IsNotEmpty , IsOptional } from 'class-validator';

export class CreateInvBrandDto {
  @ApiProperty({ description: 'The unique code for the brand', example: 'BRND-001' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'The display name of the brand', example: 'Holcim' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'uuid', description: 'Created By ID' })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiPropertyOptional({ example: 'uuid', description: 'Updated By ID' })
  @IsOptional()
  @IsString()
  updatedBy?: string;

  @ApiPropertyOptional({ example: 'uuid', description: 'Deleted By ID' })
  @IsOptional()
  @IsString()
  deletedBy?: string;
}


