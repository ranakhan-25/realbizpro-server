import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class SendEmailDto {
  @ApiProperty({
    description: 'Email recipient(s)',
    example: 'user@example.com',
    oneOf: [
      { type: 'string' },
      {
        type: 'array',
        items: { type: 'string' },
      },
    ],
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value : value,
  )
  @ValidateIf((o) => typeof o.to === 'string')
  @IsEmail(
    {},
    {
      message:
        'Please provide a valid email address',
    },
  )
  @ValidateIf((o) => Array.isArray(o.to))
  @IsArray({
    message:
      'to must be a string or array of strings',
  })
  @IsEmail(
    {},
    {
      each: true,
      message: 'Each email must be valid',
    },
  )
  to: string | string[];

  @ApiProperty({
    description: 'Email subject',
    example: 'Welcome to our platform',
  })
  @IsString()
  subject: string;

  @ApiPropertyOptional({
    description: 'Email template name',
    example: 'welcome',
  })
  @IsString()
  @IsOptional()
  template?: string;

  @ApiPropertyOptional({
    description: 'Template context variables',
    example: {
      userName: 'John Doe',
      loginUrl: 'https://app.example.com/login',
    },
  })
  @IsObject()
  @IsOptional()
  context?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Plain text email content',
    example: 'Welcome to our platform!',
  })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.template && !o.html)
  text?: string;

  @ApiPropertyOptional({
    description: 'HTML email content',
    example: '<h1>Welcome to our platform!</h1>',
  })
  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.template && !o.text)
  html?: string;
}
