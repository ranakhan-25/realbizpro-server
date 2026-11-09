import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProjectBillingRecordDto } from './create-project-billing-record.dto';
import { IsOptional, IsString } from "class-validator";

export class UpdateProjectBillingRecordDto extends PartialType(
  CreateProjectBillingRecordDto,
) {
    @ApiPropertyOptional({ example: 'user-uuid' })
    @IsOptional()
    @IsString()
    updatedBy?: string;
}
