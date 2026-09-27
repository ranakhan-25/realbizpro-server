import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateHrmMobileAuthFaceDto {
  @ApiProperty({
    example: 'EBR-107',
    description: 'Employee code',
  })
  @IsString()
  @IsNotEmpty()
  employeeCode: string;
}
