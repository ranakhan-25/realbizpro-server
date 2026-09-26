// src/modules/system/dto/company-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CompanyResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  uuid: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  mobile: string;

  @ApiProperty({ required: false })
  telephone?: string;

  @ApiProperty({ required: false })
  ipPhone?: string;

  @ApiProperty()
  vatRegNum: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  website: string;

  @ApiProperty()
  logo: string;

  @ApiProperty()
  status: 'Active' | 'Inactive';

  @ApiProperty({ required: false })
  createdBy?: number;

  @ApiProperty({ required: false })
  updatedBy?: number;

  @ApiProperty({ required: false })
  deletedBy?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  deletedAt?: Date;
}
