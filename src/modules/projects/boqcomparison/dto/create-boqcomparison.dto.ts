/* eslint-disable prettier/prettier */

import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { BoqComparisonStatus } from 'src/database/models/projects/boqcomparison/boq-comparison.model';


export class CreateBoqComparisonDto {
  @IsOptional()
  @IsString()
  uid?: string;

  @IsString()
  titleOfWork: string;

  @IsString()
  task: string;

  @IsString()
  type: string;

  @IsString()
  description: string;

  @IsNumber()
  boqQty: number;

  @IsNumber()
  boqAmount: number;

  @IsNumber()
  issueQty: number;

  @IsNumber()
  issueAmount: number;

  @IsNumber()
  qtyDiff: number;

  @IsNumber()
  amountDiff: number;

  @IsOptional()
  @IsEnum(BoqComparisonStatus)
  status?: BoqComparisonStatus;
}