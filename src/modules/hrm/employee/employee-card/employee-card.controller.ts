import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { EmployeeCardService } from './employee-card.service';
import { QueryEmployeeCardDto } from './dto/query-employee-card.dto';

@ApiTags('HRM | Employee | Employee Card')
@ApiBearerAuth()
@Controller('employee-card')
export class EmployeeCardController {
  constructor(
    private readonly employeeCardService: EmployeeCardService,
  ) {}

  @Get()
  @ApiOperation({
    summary:
      'Get employee ID card data by department & designation (paginated)',
  })
  findAll(
    @Query()
    query: QueryEmployeeCardDto,
  ) {
    return this.employeeCardService.findAll(
      query,
    );
  }
}
