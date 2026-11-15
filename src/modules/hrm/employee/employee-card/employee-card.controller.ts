/* eslint-disable prettier/prettier */

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmployeeCardService } from './employee-card.service';
import { QueryEmployeeCardDto } from './dto/query-employee-card.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/auth.decorators';

@ApiTags('HRM | Employee | Employee Card')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('employee-card')
export class EmployeeCardController {
  constructor(private readonly employeeCardService: EmployeeCardService) {}

  @Get()
  @Permissions('list_employee_card')
  @ApiOperation({ summary: 'Get employee ID card data by department & designation (paginated)' })
  findAll(
    @Query() query: QueryEmployeeCardDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.employeeCardService.findAll(query, currentUser);
  }
}
