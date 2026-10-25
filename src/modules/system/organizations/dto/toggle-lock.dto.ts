import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ToggleLockDto {
  @ApiProperty({ example: true, description: 'True to lock tenant and all users, False to unlock' })
  @IsBoolean()
  @IsNotEmpty()
  isLocked: boolean;

  @ApiPropertyOptional({ example: 'Payment past due 30 days or Terms violation', description: 'Reason presented on login failure' })
  @IsString()
  @IsOptional()
  lockReason?: string;
}
