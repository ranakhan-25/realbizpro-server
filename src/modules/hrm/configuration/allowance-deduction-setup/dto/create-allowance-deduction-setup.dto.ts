import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  PaymentTypeEnum,
  SetupTypeEnum,
} from 'src/database/models/hrm/configuration/allowance_deducation_setup';

export class CreateAllowanceDeductionSetupDto {
  @ApiProperty({
    description: 'Allowance or deduction type',
    enum: SetupTypeEnum,
    example: SetupTypeEnum.ALLOWANCE,
  })
  @IsEnum(SetupTypeEnum, {
    message:
      'Type must be one of: ' +
      Object.values(SetupTypeEnum).join(', '),
  })
  type: SetupTypeEnum;

  @ApiProperty({
    description: 'Allowance or deduction name',
    example: 'House Rent',
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'Payment frequency',
    enum: PaymentTypeEnum,
    example: PaymentTypeEnum.MONTHLY,
  })
  @IsEnum(PaymentTypeEnum, {
    message:
      'Payment type must be one of: ' +
      Object.values(PaymentTypeEnum).join(', '),
  })
  paymentType: PaymentTypeEnum;

  @ApiPropertyOptional({
    description: 'Added by user ID',
    example: 'user-uuid',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  addedById?: string;
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    createdBy?: string;
    @ApiPropertyOptional({ description: 'Organization ID', example: 1 })
    @IsOptional()
    orgId?: number;
    @ApiPropertyOptional({ description: 'Project UUID or ID' })
    @IsOptional()
    @IsString()
    projectId?: string;
}
