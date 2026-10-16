// /* eslint-disable prettier/prettier */

// import {
//   ApiProperty,
//   ApiPropertyOptional,
// } from '@nestjs/swagger';

// import { Transform } from 'class-transformer';

// import {
//   IsEnum,
//   IsNotEmpty,
//   IsOptional,
//   IsString,
// } from 'class-validator';
// import { HrmShiftStatus } from 'src/database/models/hrm/employee/hrm_hrm_shift_model';

// export class CreateHrmShiftDto {
//   @ApiProperty({
//     description: 'Shift name',
//     example: 'Morning Shift',
//   })
//   @Transform(({ value }) =>
//     typeof value === 'string'
//       ? value.trim()
//       : value,
//   )
//   @IsString()
//   @IsNotEmpty({
//     message: 'Shift name is required',
//   })
//   name: string;

//   @ApiPropertyOptional({
//     description: 'Added by user ID',
//     example: 'user-uuid',
//   })
//   @IsOptional()
//   @IsString()
//   @Transform(({ value }) =>
//     value === '' ? null : value,
//   )
//   addedById?: string;

//   @ApiPropertyOptional({
//     description: 'Shift status',
//     enum: HrmShiftStatus,
//     default: HrmShiftStatus.ACTIVE,
//   })
//   @IsOptional()
//   @IsEnum(HrmShiftStatus)
//   status?: HrmShiftStatus;
// }
