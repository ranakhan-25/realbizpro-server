import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class LoginDto {
  @ApiPropertyOptional({
    description: 'User email address',
    example: 'admin',
  })
  @IsString({
    message: 'Email or username must be a string',
  })
  @IsNotEmpty({
    message: 'Email or username is required',
  })
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'Easy@2025',
    minLength: 6,
  })
  @IsString({
    message: 'Password must be a string',
  })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
