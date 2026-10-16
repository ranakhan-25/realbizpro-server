/* eslint-disable prettier/prettier */

import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

import {
  Type,
  Transform,
} from 'class-transformer';

export class CreateBoqDto {
  // -------------------- Project Relation --------------------
  @IsUUID()
  @IsNotEmpty({ message: 'Project ID is required' })
  projectId: string;

  // -------------------- UID (optional) --------------------
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  uid?: string;

  // -------------------- Date --------------------
  @IsDate({ message: 'date must be a Date instance' })
  @Type(() => Date)
  date: Date;

  // -------------------- Title of Work --------------------
  @IsString({ message: 'titleOfWork must be a string' })
  @IsNotEmpty({ message: 'titleOfWork should not be empty' })
  titleOfWork: string;

  // -------------------- Task --------------------
  @IsString({ message: 'task must be a string' })
  @IsNotEmpty({ message: 'task should not be empty' })
  task: string;

  // -------------------- Budget --------------------
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'budget must be a number conforming to the specified constraints',
    },
  )
  @Min(0)
  budget: number;

  // -------------------- Percentage of Total Budget --------------------
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'percentageOfTotalBudget must be a number conforming to the specified constraints',
    },
  )
  @Min(0)
  @Max(100)
  percentageOfTotalBudget: number;

  // -------------------- Per Sft Budget --------------------
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'perSftBudget must be a number conforming to the specified constraints',
    },
  )
  @Min(0)
  perSftBudget: number;

  // -------------------- Cost --------------------
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'cost must be a number conforming to the specified constraints',
    },
  )
  @Min(0)
  cost: number;

  // -------------------- Available --------------------
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'available must be a number conforming to the specified constraints',
    },
  )
  @Min(-999999) // negative allowed (available can be negative)
  available: number;

  // -------------------- Added By --------------------
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    value === '' ? null : value,
  )
  addedBy?: string;
}