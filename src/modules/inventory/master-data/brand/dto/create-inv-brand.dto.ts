import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateInvBrandDto {
  @ApiProperty({ description: 'The unique code for the brand', example: 'BRND-001' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'The display name of the brand', example: 'Holcim' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
