import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import {
  ApproverType,
  ConditionOperator,
} from '../../../../database/models/deligation/sys_step_approvers.model';

class ApproverDto {
  @ApiPropertyOptional({
    example: 5,
    description: 'User ID who is approver',
  })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiPropertyOptional({
    example: 'DEFAULT',
    description:
      'Approver type: DEFAULT / CONDITIONAL',
    enum: ApproverType,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  approverType?: ApproverType;

  @ApiPropertyOptional({
    example: 'department_id',
    description:
      'Condition field: department_id, amount, grade, etc.',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  conditionField?: string;

  @ApiPropertyOptional({
    example: '=',
    description:
      'Operator: =, >, <, >=, <=, IN, BETWEEN',
    enum: ConditionOperator,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  conditionOperator?: string;

  @ApiPropertyOptional({
    example: '5',
    description:
      'Condition value (can be JSON for IN/BETWEEN)',
  })
  @IsOptional()
  @IsString()
  conditionValue?: string;

  //conditionFieldTableName
  @ApiPropertyOptional({
    description:
      'Condition field table name: pos_challan.',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  conditionFieldTableName?: string;

  @ApiPropertyOptional({
    description:
      'Condition field user field name: department_id, amount, grade, etc.',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  conditionFieldUserFieldName?: string;
}

export class CreateStepDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Step sequence: 1, 2, 3, ... N',
  })
  @IsOptional()
  @IsNumber()
  stepNumber?: number;

  @ApiPropertyOptional({
    example: 'Department Manager',
    description: 'Step name',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  stepName?: string;

  @ApiProperty({
    example: 'ANY',
    description:
      'Approval rule: ANY / ALL / MAJORITY / CUSTOM',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  ruleType: string;

  @ApiPropertyOptional({
    example: 2,
    description:
      'Required count for ANY/CUSTOM rules',
  })
  @IsOptional()
  @IsNumber()
  requiredCount?: number;

  @ApiPropertyOptional({
    example: false,
    description: 'Is this the final step',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFinal?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Is step active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    type: [ApproverDto],
    description:
      'Array of approvers to assign to step',
    example: [
      {
        userId: 5,
        approverType: 'DEFAULT',
        priority: 1,
        sequence: 1,
      },
      {
        userId: 10,
        approverType: 'CONDITION',
        conditionField: 'number_of_days',
        conditionOperator: '>',
        conditionValue: '5',
        priority: 2,
        sequence: 2,
        overrideReason:
          'For leaves > 5 days need HR approval',
      },
      {
        userId: 15,
        approverType: 'OVERRIDE',
        priority: 3,
        sequence: 3,
        overrideReason:
          'On emergency, escalate to director',
      },
    ],
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApproverDto)
  approvers: ApproverDto[];
}
