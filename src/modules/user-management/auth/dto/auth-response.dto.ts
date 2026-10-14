import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer',
  })
  tokenType: string;

  @ApiProperty({
    description:
      'Refresh token to obtain new access tokens',
    example:
      'd1f3e4c5b6a7980123456789abcdef0123456789abcdef0123456789abcdef0',
  })
  refreshToken: string;

  @ApiProperty({
    description:
      'Token expiration time in seconds',
    example: 3600,
  })
  expiresIn: number;

  @ApiProperty({
    description: 'Issued at timestamp',
    example: 1617187200,
    required: false,
  })
  iat?: number;

  @ApiProperty({
    description: 'Expiration timestamp',
    example: 1617190800,
    required: false,
  })
  exp?: number;
}
