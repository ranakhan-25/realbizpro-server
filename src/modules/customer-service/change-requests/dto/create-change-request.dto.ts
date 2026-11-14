import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import {
  ChangeRequestStatus,
  ChangeRequestType,
} from 'src/database/models/customer-service/cs_change_request.model';

export class CreateChangeRequestDto {
  @ApiProperty({
    description: 'Type of change request',
    enum: ChangeRequestType,
    example: ChangeRequestType.OWNERSHIP_TRANSFER,
  })
  @IsNotEmpty()
  @IsEnum(ChangeRequestType)
  request_type: ChangeRequestType;

  @ApiProperty({
    description: 'Existing customer name',
    example: 'Mohammad Rafiqul Islam',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  customer_name: string;

  @ApiProperty({
    description: 'Unit number / designation',
    example: 'A-7, Hena Heights',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  unit: string;

  @ApiPropertyOptional({
    description:
      'Customer profile ID (cs_customer_profiles.id)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  customer_profile_id?: number;

  @ApiPropertyOptional({
    description: 'Project name',
    example: 'Hena Heights, Gulshan',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  project?: string;

  @ApiPropertyOptional({
    description: 'Project UUID reference',
  })
  @IsOptional()
  @IsUUID()
  project_id?: string;

  @ApiPropertyOptional({
    description:
      'Booking UUID reference (pr_flat_land_bookings.uuid)',
  })
  @IsOptional()
  @IsUUID()
  booking_id?: string;

  @ApiPropertyOptional({
    description:
      'Reason / purpose for change request',
    example:
      'Transferring deed rights to son (Engr. Salman Islam)',
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({
    description: 'Transfer fee in BDT',
    example: 150000,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  transfer_fee?: number;

  @ApiPropertyOptional({
    description: 'Transferee / new buyer name',
    example: 'Salman Islam',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  new_buyer_name?: string;

  @ApiPropertyOptional({
    description: 'Transferee / new buyer NID',
    example: '20012698765432100',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  new_buyer_nid?: string;

  @ApiPropertyOptional({
    description:
      'Transferee / new buyer phone number',
    example: '+880 1711-234567',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  new_buyer_phone?: string;

  @ApiPropertyOptional({
    description: 'Initial workflow status',
    enum: ChangeRequestStatus,
    default:
      ChangeRequestStatus.LEGAL_VERIFICATION,
  })
  @IsOptional()
  @IsEnum(ChangeRequestStatus)
  status?: ChangeRequestStatus;

  @ApiPropertyOptional({
    description: 'Application date (YYYY-MM-DD)',
    example: '2026-11-05',
  })
  @IsOptional()
  @IsString()
  applied_date?: string;

  @ApiPropertyOptional({
    description:
      'Initial approval / processing notes',
  })
  @IsOptional()
  @IsString()
  approval_notes?: string;
}
