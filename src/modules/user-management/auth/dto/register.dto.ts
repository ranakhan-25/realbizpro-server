import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsPassword } from '../../../../common/decorators/validation.decorators';

export class RegisterDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString({
    message: 'First name must be a string',
  })
  @IsNotEmpty({
    message: 'First name is required',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString({
    message: 'Last name must be a string',
  })
  @IsNotEmpty({
    message: 'Last name is required',
  })
  lastName: string;

  @ApiProperty({
    description: 'User phone number (optional)',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  // @IsBangladeshPhone({
  //   message: 'Please provide a valid Bangladesh phone number',
  // })
  @IsString({
    message: 'Phone number must be a string',
  })
  phone?: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail(
    {},
    {
      message:
        'Please provide a valid email address',
    },
  )
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'Password@123',
    minLength: 6,
  })
  // @IsPassword()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @ApiProperty({
    description: 'Username (optional)',
    example: 'john_doe',
    required: false,
  })
  @IsOptional()
  @IsString({
    message: 'Username must be a string',
  })
  username?: string;
}
