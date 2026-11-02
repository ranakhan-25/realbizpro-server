import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterShareUserDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() phone?: string;
  @ApiProperty({ minLength: 8 }) @IsString() @MinLength(8) password: string;
}

export class LoginShareUserDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() @MinLength(8) password: string;
}

export class ForgotShareUserPasswordDto {
  @ApiProperty() @IsEmail() email: string;
}

export class ResetShareUserPasswordDto {
  @ApiProperty() @IsString() @IsNotEmpty() token: string;
  @ApiProperty({ minLength: 8 }) @IsString() @MinLength(8) password: string;
}

export class VerifyShareUserEmailDto {
  @ApiProperty() @IsString() @IsNotEmpty() token: string;
}

export class UpdateShareUserProfileDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() name?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() phone?: string;
}

export class ChangeShareUserPasswordDto {
  @ApiProperty() @IsString() @IsNotEmpty() currentPassword: string;
  @ApiProperty({ minLength: 8 }) @IsString() @MinLength(8) newPassword: string;
}

export class RefreshShareUserTokenDto {
  @ApiProperty() @IsString() @IsNotEmpty() refreshToken: string;
}
