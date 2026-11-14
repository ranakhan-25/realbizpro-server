import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { AssociationGovernanceStatus } from 'src/database/models/customer-service/cs_property_care.types';

export class CreateOwnersAssociationDto {
  @ApiPropertyOptional({ description: 'Project UUID' })
  @IsOptional()
  @IsUUID()
  project_id?: string;

  @ApiProperty({ description: 'Project Name' })
  @IsNotEmpty()
  @IsString()
  project_name: string;

  @ApiPropertyOptional({ description: 'Association Code (auto-generated if omitted e.g. OA-01)' })
  @IsOptional()
  @IsString()
  association_code?: string;

  @ApiProperty({ description: 'Association Name' })
  @IsNotEmpty()
  @IsString()
  association_name: string;

  @ApiProperty({ description: 'President / Leadership Name' })
  @IsNotEmpty()
  @IsString()
  president_name: string;

  @ApiPropertyOptional({ description: 'Contact Phone Number' })
  @IsOptional()
  @IsString()
  contact_phone?: string;

  @ApiProperty({ description: 'Total Flats in building' })
  @IsNotEmpty()
  @IsNumber()
  total_flats: number;

  @ApiProperty({ description: 'Number of flats handed over' })
  @IsNotEmpty()
  @IsNumber()
  handed_over_count: number;

  @ApiProperty({ description: 'Monthly service charge per flat' })
  @IsNotEmpty()
  @IsNumber()
  monthly_service_charge_per_flat: number;

  @ApiPropertyOptional({ description: 'Association Bank Account info' })
  @IsOptional()
  @IsString()
  association_bank_acc?: string;

  @ApiPropertyOptional({
    enum: AssociationGovernanceStatus,
    default: AssociationGovernanceStatus.DEVELOPER_MANAGING,
  })
  @IsOptional()
  @IsEnum(AssociationGovernanceStatus)
  handover_status?: AssociationGovernanceStatus;

  @ApiPropertyOptional({ description: 'Governance transition date' })
  @IsOptional()
  @IsString()
  transition_date?: string;

  @ApiPropertyOptional({ description: 'Remarks' })
  @IsOptional()
  @IsString()
  remarks?: string;
}
