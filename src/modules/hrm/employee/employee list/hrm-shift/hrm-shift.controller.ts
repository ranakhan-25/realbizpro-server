// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Patch,
//   Post,
//   Query,
// } from '@nestjs/common';

// import {
//   ApiBearerAuth,
//   ApiOperation,
//   ApiTags,
// } from '@nestjs/swagger';

// import { HrmShiftService } from './hrm-shift.service';
// import { CreateHrmShiftDto } from './dto/create-hrm-shift.dto';
// import { QueryHrmShiftDto } from './dto/query-hrm-shift.dto';
// import { UpdateHrmShiftDto } from './dto/update-hrm-shift.dto';

// @ApiTags('HRM | Employee | HRM Shift')
// @ApiBearerAuth()
// @Controller('hrm-shift')
// export class HrmShiftController {
//   constructor(
//     private readonly hrmShiftService: HrmShiftService,
//   ) {}

//   @Post()
//   @ApiOperation({
//     summary: 'Create a new shift',
//   })
//   create(
//     @Body()
//     createHrmShiftDto: CreateHrmShiftDto,
//   ) {
//     return this.hrmShiftService.create(
//       createHrmShiftDto,
//     );
//   }

//   @Get()
//   @ApiOperation({
//     summary: 'Get all shifts (paginated)',
//   })
//   findAll(
//     @Query()
//     query: QueryHrmShiftDto,
//   ) {
//     return this.hrmShiftService.findAll(query);
//   }

//   @Get(':uuid')
//   @ApiOperation({
//     summary: 'Get shift by UUID',
//   })
//   findOne(@Param('uuid') uuid: string) {
//     return this.hrmShiftService.findOne(uuid);
//   }

//   @Patch(':uuid')
//   @ApiOperation({
//     summary: 'Update shift',
//   })
//   update(
//     @Param('uuid') uuid: string,
//     @Body()
//     updateHrmShiftDto: UpdateHrmShiftDto,
//   ) {
//     return this.hrmShiftService.update(
//       uuid,
//       updateHrmShiftDto,
//     );
//   }

//   @Delete(':uuid')
//   @ApiOperation({
//     summary:
//       'Soft delete shift (status → inactive)',
//   })
//   remove(@Param('uuid') uuid: string) {
//     return this.hrmShiftService.remove(uuid);
//   }

//   @Patch(':uuid/restore')
//   @ApiOperation({
//     summary:
//       'Restore soft-deleted shift (status → active)',
//   })
//   restore(@Param('uuid') uuid: string) {
//     return this.hrmShiftService.restore(uuid);
//   }
// }
